import { EventEmitter } from "events";
import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
export interface SystemMetrics {
    cpu: {
        usage: number;
        cores: number;
        temperature?: number;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usage: number;
    };
    disk: {
        total: number;
        used: number;
        free: number;
        usage: number;
    };
    network: {
        bytesIn: number;
        bytesOut: number;
        connections: number;
    };
    uptime: number;
    timestamp: Date;
}
export interface ErrorMetrics {
    total: number;
    byStatusCode: Record<string, number>;
    byEndpoint: Record<string, number>;
    byBrowser: Record<string, number>;
    byOs: Record<string, number>;
    recentErrors: Array<{
        timestamp: Date;
        statusCode: number;
        endpoint: string;
        message: string;
        stack?: string;
    }>;
    errorRate: number;
    timestamp: Date;
}
export interface PerformanceMetrics {
    responseTime: {
        average: number;
        p50: number;
        p90: number;
        p95: number;
        p99: number;
        byEndpoint: Record<string, number>;
    };
    throughput: {
        requestsPerMinute: number;
        byEndpoint: Record<string, number>;
    };
    databasePerformance: {
        queryTime: {
            average: number;
            p95: number;
        };
        connectionPoolSize: number;
        activeConnections: number;
        queryCount: number;
    };
    timestamp: Date;
}
export interface ServiceStatus {
    name: string;
    status: "healthy" | "degraded" | "down";
    lastChecked: Date;
    responseTime?: number;
    message?: string;
}
export interface SystemHealthStatus {
    overall: "healthy" | "degraded" | "critical";
    services: ServiceStatus[];
    metrics: SystemMetrics;
    errors: ErrorMetrics;
    performance: PerformanceMetrics;
    alerts: Array<{
        id: string;
        severity: "info" | "warning" | "critical";
        message: string;
        timestamp: Date;
        acknowledged: boolean;
    }>;
}
export declare class SystemHealthService extends EventEmitter implements OnModuleInit, OnModuleDestroy {
    private prisma;
    private metricsHistory;
    private errorHistory;
    private performanceHistory;
    private serviceStatuses;
    private alerts;
    private metricsInterval;
    private healthCheckInterval;
    private previousCpuInfo;
    private networkStats;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    startMonitoring(metricsIntervalMs?: number, healthCheckIntervalMs?: number): void;
    stopMonitoring(): void;
    getSystemHealthStatus(): SystemHealthStatus;
    getHistoricalMetrics(hours?: number): SystemMetrics[];
    getHistoricalErrors(hours?: number): ErrorMetrics[];
    getHistoricalPerformance(hours?: number): PerformanceMetrics[];
    acknowledgeAlert(alertId: string): boolean;
    clearAcknowledgedAlerts(): void;
    private collectMetrics;
    private collectRealSystemMetrics;
    private getCpuUsage;
    private getNetworkStats;
    private collectPerformanceMetrics;
    private getActiveConnections;
    private performHealthChecks;
    private checkAlertConditions;
    private addAlert;
    private initializeMockData;
    private generateMockSystemMetrics;
    private generateMockErrorMetrics;
    private generateMockPerformanceMetrics;
}
