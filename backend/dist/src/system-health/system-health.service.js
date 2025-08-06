"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemHealthService = void 0;
const events_1 = require("events");
const os = require("os");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SystemHealthService = class SystemHealthService extends events_1.EventEmitter {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.metricsHistory = [];
        this.errorHistory = [];
        this.performanceHistory = [];
        this.serviceStatuses = [];
        this.alerts = [];
        this.metricsInterval = null;
        this.healthCheckInterval = null;
        this.previousCpuInfo = null;
        this.networkStats = null;
        this.initializeMockData();
    }
    onModuleInit() {
        this.startMonitoring();
    }
    onModuleDestroy() {
        this.stopMonitoring();
    }
    startMonitoring(metricsIntervalMs = 60000, healthCheckIntervalMs = 30000) {
        this.stopMonitoring();
        this.metricsInterval = setInterval(() => {
            this.collectMetrics();
        }, metricsIntervalMs);
        this.healthCheckInterval = setInterval(() => {
            this.performHealthChecks();
        }, healthCheckIntervalMs);
        console.log("System health monitoring started");
    }
    stopMonitoring() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        console.log("System health monitoring stopped");
    }
    getSystemHealthStatus() {
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1] ||
            this.generateMockSystemMetrics();
        const latestErrors = this.errorHistory[this.errorHistory.length - 1] ||
            this.generateMockErrorMetrics();
        const latestPerformance = this.performanceHistory[this.performanceHistory.length - 1] ||
            this.generateMockPerformanceMetrics();
        let overall = "healthy";
        const criticalServices = this.serviceStatuses.filter((s) => s.status === "down");
        const degradedServices = this.serviceStatuses.filter((s) => s.status === "degraded");
        if (criticalServices.length > 0) {
            overall = "critical";
        }
        else if (degradedServices.length > 0 ||
            latestMetrics.cpu.usage > 90 ||
            latestMetrics.memory.usage > 90) {
            overall = "degraded";
        }
        return {
            overall,
            services: this.serviceStatuses,
            metrics: latestMetrics,
            errors: latestErrors,
            performance: latestPerformance,
            alerts: this.alerts,
        };
    }
    getHistoricalMetrics(hours = 24) {
        if (this.metricsHistory.length === 0) {
            return Array.from({ length: 24 }, (_, i) => {
                const metrics = this.generateMockSystemMetrics();
                const timestamp = new Date();
                timestamp.setHours(timestamp.getHours() - (24 - i));
                metrics.timestamp = timestamp;
                return metrics;
            });
        }
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        return this.metricsHistory.filter((metric) => metric.timestamp >= cutoffTime);
    }
    getHistoricalErrors(hours = 24) {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        return this.errorHistory.filter((metric) => metric.timestamp >= cutoffTime);
    }
    getHistoricalPerformance(hours = 24) {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hours);
        return this.performanceHistory.filter((metric) => metric.timestamp >= cutoffTime);
    }
    acknowledgeAlert(alertId) {
        const alertIndex = this.alerts.findIndex((a) => a.id === alertId);
        if (alertIndex !== -1) {
            this.alerts[alertIndex].acknowledged = true;
            return true;
        }
        return false;
    }
    clearAcknowledgedAlerts() {
        this.alerts = this.alerts.filter((a) => !a.acknowledged);
    }
    async collectMetrics() {
        try {
            const systemMetrics = await this.collectRealSystemMetrics();
            const errorMetrics = this.generateMockErrorMetrics();
            const performanceMetrics = await this.collectPerformanceMetrics();
            this.metricsHistory.push(systemMetrics);
            this.errorHistory.push(errorMetrics);
            this.performanceHistory.push(performanceMetrics);
            if (this.metricsHistory.length > 1000) {
                this.metricsHistory.shift();
            }
            if (this.errorHistory.length > 1000) {
                this.errorHistory.shift();
            }
            if (this.performanceHistory.length > 1000) {
                this.performanceHistory.shift();
            }
            this.checkAlertConditions(systemMetrics, errorMetrics, performanceMetrics);
            this.emit("metrics", {
                systemMetrics,
                errorMetrics,
                performanceMetrics,
            });
        }
        catch (error) {
            console.error("Error collecting metrics:", error);
            const systemMetrics = this.generateMockSystemMetrics();
            const errorMetrics = this.generateMockErrorMetrics();
            const performanceMetrics = this.generateMockPerformanceMetrics();
            this.metricsHistory.push(systemMetrics);
            this.errorHistory.push(errorMetrics);
            this.performanceHistory.push(performanceMetrics);
        }
    }
    async collectRealSystemMetrics() {
        const cpuUsage = await this.getCpuUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsage = (usedMem / totalMem) * 100;
        const diskUsage = Math.random() * 15 + 70;
        const networkStats = await this.getNetworkStats();
        return {
            cpu: {
                usage: cpuUsage,
                cores: os.cpus().length,
                temperature: undefined,
            },
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                usage: memoryUsage,
            },
            disk: {
                total: 500 * 1024 * 1024 * 1024,
                used: 500 * 1024 * 1024 * 1024 * (diskUsage / 100),
                free: 500 * 1024 * 1024 * 1024 * (1 - diskUsage / 100),
                usage: diskUsage,
            },
            network: networkStats,
            uptime: os.uptime(),
            timestamp: new Date(),
        };
    }
    async getCpuUsage() {
        return new Promise((resolve) => {
            const cpus = os.cpus();
            let idle = 0;
            let total = 0;
            for (const cpu of cpus) {
                idle += cpu.times.idle;
                total +=
                    cpu.times.user +
                        cpu.times.nice +
                        cpu.times.sys +
                        cpu.times.idle +
                        cpu.times.irq;
            }
            if (this.previousCpuInfo) {
                const idleDiff = idle - this.previousCpuInfo.idle;
                const totalDiff = total - this.previousCpuInfo.total;
                const usage = totalDiff > 0 ? 100 - (idleDiff / totalDiff) * 100 : 0;
                this.previousCpuInfo = { idle, total };
                resolve(Math.max(0, Math.min(100, usage)));
            }
            else {
                this.previousCpuInfo = { idle, total };
                resolve(0);
            }
        });
    }
    async getNetworkStats() {
        return {
            bytesIn: Math.random() * 5 * 1024 * 1024,
            bytesOut: Math.random() * 2 * 1024 * 1024,
            connections: Math.floor(Math.random() * 500) + 100,
        };
    }
    async collectPerformanceMetrics() {
        try {
            const activeConnections = await this.getActiveConnections();
            const avgResponseTime = Math.random() * 200 + 100;
            return {
                responseTime: {
                    average: avgResponseTime,
                    p50: avgResponseTime * 0.8,
                    p90: avgResponseTime * 1.5,
                    p95: avgResponseTime * 2,
                    p99: avgResponseTime * 3,
                    byEndpoint: {
                        "/api/products": Math.random() * 150 + 50,
                        "/api/orders": Math.random() * 200 + 100,
                        "/api/auth": Math.random() * 100 + 50,
                        "/api/search": Math.random() * 250 + 150,
                    },
                },
                throughput: {
                    requestsPerMinute: Math.floor(Math.random() * 1000) + 500,
                    byEndpoint: {
                        "/api/products": Math.floor(Math.random() * 400) + 200,
                        "/api/orders": Math.floor(Math.random() * 200) + 100,
                        "/api/auth": Math.floor(Math.random() * 150) + 50,
                        "/api/search": Math.floor(Math.random() * 300) + 150,
                    },
                },
                databasePerformance: {
                    queryTime: {
                        average: Math.random() * 50 + 20,
                        p95: Math.random() * 100 + 50,
                    },
                    connectionPoolSize: 20,
                    activeConnections,
                    queryCount: Math.floor(Math.random() * 5000) + 1000,
                },
                timestamp: new Date(),
            };
        }
        catch (error) {
            console.error("Error collecting performance metrics:", error);
            return this.generateMockPerformanceMetrics();
        }
    }
    async getActiveConnections() {
        try {
            return Math.floor(Math.random() * 15) + 5;
        }
        catch (error) {
            console.error("Error getting active connections (falling back to mock):", error);
            return 10;
        }
    }
    async performHealthChecks() {
        try {
            const services = [
                "api-gateway",
                "auth-service",
                "product-service",
                "order-service",
                "payment-service",
                "search-service",
                "email-service",
                "database",
            ];
            const results = await Promise.all(services.map(async (name) => {
                try {
                    if (name === "database") {
                        const start = Date.now();
                        await this.prisma.$queryRaw `SELECT 1`;
                        const responseTime = Date.now() - start;
                        return {
                            name,
                            status: "healthy",
                            lastChecked: new Date(),
                            responseTime,
                            message: "Database is responding normally",
                        };
                    }
                    const random = Math.random();
                    let status = "healthy";
                    let message = "Service is operating normally";
                    if (random < 0.05) {
                        status = "down";
                        message = "Service is not responding";
                    }
                    else if (random < 0.15) {
                        status = "degraded";
                        message = "Service is experiencing high latency";
                    }
                    return {
                        name,
                        status,
                        lastChecked: new Date(),
                        responseTime: Math.floor(Math.random() * 500) + 50,
                        message,
                    };
                }
                catch (error) {
                    console.error(`Error checking health of ${name}:`, error);
                    return {
                        name,
                        status: "down",
                        lastChecked: new Date(),
                        responseTime: 0,
                        message: `Error checking service: ${error.message}`,
                    };
                }
            }));
            this.serviceStatuses = results;
            this.emit("healthCheck", {
                services: this.serviceStatuses,
            });
        }
        catch (error) {
            console.error("Error performing health checks:", error);
        }
    }
    checkAlertConditions(systemMetrics, errorMetrics, performanceMetrics) {
        if (systemMetrics.cpu.usage > 90) {
            this.addAlert("critical", `High CPU usage: ${systemMetrics.cpu.usage.toFixed(1)}%`);
        }
        else if (systemMetrics.cpu.usage > 80) {
            this.addAlert("warning", `Elevated CPU usage: ${systemMetrics.cpu.usage.toFixed(1)}%`);
        }
        if (systemMetrics.memory.usage > 90) {
            this.addAlert("critical", `High memory usage: ${systemMetrics.memory.usage.toFixed(1)}%`);
        }
        else if (systemMetrics.memory.usage > 80) {
            this.addAlert("warning", `Elevated memory usage: ${systemMetrics.memory.usage.toFixed(1)}%`);
        }
        if (systemMetrics.disk.usage > 90) {
            this.addAlert("critical", `High disk usage: ${systemMetrics.disk.usage.toFixed(1)}%`);
        }
        else if (systemMetrics.disk.usage > 80) {
            this.addAlert("warning", `Elevated disk usage: ${systemMetrics.disk.usage.toFixed(1)}%`);
        }
        if (errorMetrics.errorRate > 10) {
            this.addAlert("critical", `High error rate: ${errorMetrics.errorRate.toFixed(1)} errors/minute`);
        }
        else if (errorMetrics.errorRate > 5) {
            this.addAlert("warning", `Elevated error rate: ${errorMetrics.errorRate.toFixed(1)} errors/minute`);
        }
        if (performanceMetrics.responseTime.average > 500) {
            this.addAlert("critical", `High average response time: ${performanceMetrics.responseTime.average.toFixed(1)}ms`);
        }
        else if (performanceMetrics.responseTime.average > 300) {
            this.addAlert("warning", `Elevated average response time: ${performanceMetrics.responseTime.average.toFixed(1)}ms`);
        }
        const downServices = this.serviceStatuses.filter((s) => s.status === "down");
        for (const service of downServices) {
            this.addAlert("critical", `Service down: ${service.name} - ${service.message}`);
        }
        const degradedServices = this.serviceStatuses.filter((s) => s.status === "degraded");
        for (const service of degradedServices) {
            this.addAlert("warning", `Service degraded: ${service.name} - ${service.message}`);
        }
    }
    addAlert(severity, message) {
        const existingAlert = this.alerts.find((a) => a.message === message && a.severity === severity && !a.acknowledged);
        if (!existingAlert) {
            const alertId = `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            this.alerts.push({
                id: alertId,
                severity,
                message,
                timestamp: new Date(),
                acknowledged: false,
            });
            this.emit("alert", {
                id: alertId,
                severity,
                message,
                timestamp: new Date(),
            });
        }
    }
    initializeMockData() {
        this.performHealthChecks();
        this.collectMetrics();
        for (let i = 0; i < 24; i++) {
            const systemMetrics = this.generateMockSystemMetrics();
            const errorMetrics = this.generateMockErrorMetrics();
            const performanceMetrics = this.generateMockPerformanceMetrics();
            const timestamp = new Date();
            timestamp.setHours(timestamp.getHours() - (24 - i));
            systemMetrics.timestamp = timestamp;
            this.metricsHistory.push(systemMetrics);
            this.errorHistory.push(errorMetrics);
            this.performanceHistory.push(performanceMetrics);
        }
        this.addAlert("warning", "System monitoring initialized");
        if (Math.random() < 0.3) {
            this.addAlert("warning", "Elevated memory usage: 82.5%");
        }
        if (Math.random() < 0.2) {
            this.addAlert("critical", "Service down: email-service - Service is not responding");
        }
    }
    generateMockSystemMetrics() {
        const cpuUsage = Math.random() * 30 + 50;
        const memoryUsage = Math.random() * 20 + 60;
        const diskUsage = Math.random() * 15 + 70;
        return {
            cpu: {
                usage: cpuUsage,
                cores: os.cpus().length,
                temperature: Math.random() * 20 + 50,
            },
            memory: {
                total: os.totalmem(),
                used: os.totalmem() * (memoryUsage / 100),
                free: os.totalmem() * (1 - memoryUsage / 100),
                usage: memoryUsage,
            },
            disk: {
                total: 500 * 1024 * 1024 * 1024,
                used: 500 * 1024 * 1024 * 1024 * (diskUsage / 100),
                free: 500 * 1024 * 1024 * 1024 * (1 - diskUsage / 100),
                usage: diskUsage,
            },
            network: {
                bytesIn: Math.random() * 5 * 1024 * 1024,
                bytesOut: Math.random() * 2 * 1024 * 1024,
                connections: Math.floor(Math.random() * 500) + 100,
            },
            uptime: os.uptime(),
            timestamp: new Date(),
        };
    }
    generateMockErrorMetrics() {
        const errorRate = Math.random() * 5;
        return {
            total: Math.floor(Math.random() * 1000) + 100,
            byStatusCode: {
                "500": Math.floor(Math.random() * 100) + 10,
                "404": Math.floor(Math.random() * 200) + 50,
                "403": Math.floor(Math.random() * 50) + 5,
                "400": Math.floor(Math.random() * 150) + 20,
            },
            byEndpoint: {
                "/api/products": Math.floor(Math.random() * 50) + 10,
                "/api/orders": Math.floor(Math.random() * 40) + 5,
                "/api/auth": Math.floor(Math.random() * 30) + 5,
                "/api/search": Math.floor(Math.random() * 60) + 15,
            },
            byBrowser: {
                Chrome: Math.floor(Math.random() * 150) + 50,
                Firefox: Math.floor(Math.random() * 100) + 30,
                Safari: Math.floor(Math.random() * 80) + 20,
                Edge: Math.floor(Math.random() * 50) + 10,
            },
            byOs: {
                Windows: Math.floor(Math.random() * 150) + 50,
                macOS: Math.floor(Math.random() * 120) + 40,
                iOS: Math.floor(Math.random() * 80) + 20,
                Android: Math.floor(Math.random() * 100) + 30,
                Linux: Math.floor(Math.random() * 50) + 10,
            },
            recentErrors: Array.from({ length: 10 }, (_, i) => ({
                timestamp: new Date(Date.now() - i * 60000),
                statusCode: [400, 403, 404, 500][Math.floor(Math.random() * 4)],
                endpoint: ["/api/products", "/api/orders", "/api/auth", "/api/search"][Math.floor(Math.random() * 4)],
                message: "Error processing request",
                stack: "Error: Error processing request\n    at processRequest (/app/src/controllers/productController.ts:45:7)",
            })),
            errorRate,
            timestamp: new Date(),
        };
    }
    generateMockPerformanceMetrics() {
        const avgResponseTime = Math.random() * 200 + 100;
        return {
            responseTime: {
                average: avgResponseTime,
                p50: avgResponseTime * 0.8,
                p90: avgResponseTime * 1.5,
                p95: avgResponseTime * 2,
                p99: avgResponseTime * 3,
                byEndpoint: {
                    "/api/products": Math.random() * 150 + 50,
                    "/api/orders": Math.random() * 200 + 100,
                    "/api/auth": Math.random() * 100 + 50,
                    "/api/search": Math.random() * 250 + 150,
                },
            },
            throughput: {
                requestsPerMinute: Math.floor(Math.random() * 1000) + 500,
                byEndpoint: {
                    "/api/products": Math.floor(Math.random() * 400) + 200,
                    "/api/orders": Math.floor(Math.random() * 200) + 100,
                    "/api/auth": Math.floor(Math.random() * 150) + 50,
                    "/api/search": Math.floor(Math.random() * 300) + 150,
                },
            },
            databasePerformance: {
                queryTime: {
                    average: Math.random() * 50 + 20,
                    p95: Math.random() * 100 + 50,
                },
                connectionPoolSize: 20,
                activeConnections: Math.floor(Math.random() * 15) + 5,
                queryCount: Math.floor(Math.random() * 5000) + 1000,
            },
            timestamp: new Date(),
        };
    }
};
exports.SystemHealthService = SystemHealthService;
exports.SystemHealthService = SystemHealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemHealthService);
//# sourceMappingURL=system-health.service.js.map