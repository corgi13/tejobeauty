// SystemHealthMonitoringService.ts - Service for monitoring system health and performance
import { EventEmitter } from "events";

export interface SystemMetrics {
  cpu: {
    usage: number; // percentage
    cores: number;
    temperature?: number; // celsius
  };
  memory: {
    total: number; // bytes
    used: number; // bytes
    free: number; // bytes
    usage: number; // percentage
  };
  disk: {
    total: number; // bytes
    used: number; // bytes
    free: number; // bytes
    usage: number; // percentage
  };
  network: {
    bytesIn: number; // bytes per second
    bytesOut: number; // bytes per second
    connections: number;
  };
  uptime: number; // seconds
  timestamp: Date;
}

export interface ErrorMetrics {
  total: number;
  byStatusCode: Record<string, number>; // e.g. { "500": 120, "404": 45 }
  byEndpoint: Record<string, number>; // e.g. { "/api/products": 25, "/api/orders": 15 }
  byBrowser: Record<string, number>; // e.g. { "Chrome": 80, "Firefox": 30 }
  byOs: Record<string, number>; // e.g. { "Windows": 70, "macOS": 40 }
  recentErrors: Array<{
    timestamp: Date;
    statusCode: number;
    endpoint: string;
    message: string;
    stack?: string;
  }>;
  errorRate: number; // errors per minute
}

export interface PerformanceMetrics {
  responseTime: {
    average: number; // milliseconds
    p50: number; // milliseconds
    p90: number; // milliseconds
    p95: number; // milliseconds
    p99: number; // milliseconds
    byEndpoint: Record<string, number>; // e.g. { "/api/products": 120, "/api/orders": 85 }
  };
  throughput: {
    requestsPerMinute: number;
    byEndpoint: Record<string, number>; // e.g. { "/api/products": 350, "/api/orders": 120 }
  };
  databasePerformance: {
    queryTime: {
      average: number; // milliseconds
      p95: number; // milliseconds
    };
    connectionPoolSize: number;
    activeConnections: number;
    queryCount: number;
  };
}

export interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  lastChecked: Date;
  responseTime?: number; // milliseconds
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

export class SystemHealthMonitoringService extends EventEmitter {
  private metricsHistory: SystemMetrics[] = [];
  private errorHistory: ErrorMetrics[] = [];
  private performanceHistory: PerformanceMetrics[] = [];
  private serviceStatuses: ServiceStatus[] = [];
  private alerts: Array<{
    id: string;
    severity: "info" | "warning" | "critical";
    message: string;
    timestamp: Date;
    acknowledged: boolean;
  }> = [];

  private metricsInterval: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();

    // Initialize with mock data for demonstration
    this.initializeMockData();
  }

  /**
   * Start monitoring system health
   */
  public startMonitoring(
    metricsIntervalMs: number = 60000,
    healthCheckIntervalMs: number = 30000,
  ): void {
    // Clear any existing intervals
    this.stopMonitoring();

    // Start collecting metrics at regular intervals
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, metricsIntervalMs);

    // Start health checks at regular intervals
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, healthCheckIntervalMs);

    console.log("System health monitoring started");
  }

  /**
   * Stop monitoring system health
   */
  public stopMonitoring(): void {
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

  /**
   * Get current system health status
   */
  public getSystemHealthStatus(): SystemHealthStatus {
    const latestMetrics =
      this.metricsHistory[this.metricsHistory.length - 1] ||
      this.generateMockSystemMetrics();
    const latestErrors =
      this.errorHistory[this.errorHistory.length - 1] ||
      this.generateMockErrorMetrics();
    const latestPerformance =
      this.performanceHistory[this.performanceHistory.length - 1] ||
      this.generateMockPerformanceMetrics();

    // Determine overall system health
    let overall: "healthy" | "degraded" | "critical" = "healthy";

    // Check for critical service issues
    const criticalServices = this.serviceStatuses.filter(
      (s) => s.status === "down",
    );
    const degradedServices = this.serviceStatuses.filter(
      (s) => s.status === "degraded",
    );

    if (criticalServices.length > 0) {
      overall = "critical";
    } else if (
      degradedServices.length > 0 ||
      latestMetrics.cpu.usage > 90 ||
      latestMetrics.memory.usage > 90
    ) {
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

  /**
   * Get historical system metrics
   */
  public getHistoricalMetrics(hours: number = 24): SystemMetrics[] {
    // In a real implementation, this would filter metrics by timestamp
    // For now, return all metrics or generate mock data if none exists
    if (this.metricsHistory.length === 0) {
      return Array.from({ length: 24 }, (_, i) => {
        const metrics = this.generateMockSystemMetrics();
        const timestamp = new Date();
        timestamp.setHours(timestamp.getHours() - (24 - i));
        metrics.timestamp = timestamp;
        return metrics;
      });
    }

    return this.metricsHistory;
  }

  /**
   * Get historical error metrics
   */
  public getHistoricalErrors(hours: number = 24): ErrorMetrics[] {
    // In a real implementation, this would filter errors by timestamp
    // For now, return all errors or generate mock data if none exists
    if (this.errorHistory.length === 0) {
      return Array.from({ length: 24 }, (_, i) => {
        const errors = this.generateMockErrorMetrics();
        return errors;
      });
    }

    return this.errorHistory;
  }

  /**
   * Get historical performance metrics
   */
  public getHistoricalPerformance(hours: number = 24): PerformanceMetrics[] {
    // In a real implementation, this would filter performance metrics by timestamp
    // For now, return all performance metrics or generate mock data if none exists
    if (this.performanceHistory.length === 0) {
      return Array.from({ length: 24 }, () => {
        return this.generateMockPerformanceMetrics();
      });
    }

    return this.performanceHistory;
  }

  /**
   * Acknowledge an alert
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alertIndex = this.alerts.findIndex((a) => a.id === alertId);

    if (alertIndex !== -1) {
      this.alerts[alertIndex].acknowledged = true;
      return true;
    }

    return false;
  }

  /**
   * Clear all acknowledged alerts
   */
  public clearAcknowledgedAlerts(): void {
    this.alerts = this.alerts.filter((a) => !a.acknowledged);
  }

  /**
   * Collect system metrics
   * In a real implementation, this would collect actual system metrics
   * For now, we'll generate mock data
   */
  private collectMetrics(): void {
    const systemMetrics = this.generateMockSystemMetrics();
    const errorMetrics = this.generateMockErrorMetrics();
    const performanceMetrics = this.generateMockPerformanceMetrics();

    this.metricsHistory.push(systemMetrics);
    this.errorHistory.push(errorMetrics);
    this.performanceHistory.push(performanceMetrics);

    // Limit history size
    if (this.metricsHistory.length > 1000) {
      this.metricsHistory.shift();
    }

    if (this.errorHistory.length > 1000) {
      this.errorHistory.shift();
    }

    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }

    // Check for alert conditions
    this.checkAlertConditions(systemMetrics, errorMetrics, performanceMetrics);

    // Emit metrics event
    this.emit("metrics", {
      systemMetrics,
      errorMetrics,
      performanceMetrics,
    });
  }

  /**
   * Perform health checks on services
   * In a real implementation, this would check actual services
   * For now, we'll generate mock data
   */
  private performHealthChecks(): void {
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

    this.serviceStatuses = services.map((name) => {
      // Randomly generate status for demonstration
      const random = Math.random();
      let status: "healthy" | "degraded" | "down" = "healthy";
      let message = "Service is operating normally";

      if (random < 0.05) {
        status = "down";
        message = "Service is not responding";
      } else if (random < 0.15) {
        status = "degraded";
        message = "Service is experiencing high latency";
      }

      return {
        name,
        status,
        lastChecked: new Date(),
        responseTime: Math.floor(Math.random() * 500) + 50, // 50-550ms
        message,
      };
    });

    // Emit health check event
    this.emit("healthCheck", {
      services: this.serviceStatuses,
    });
  }

  /**
   * Check for alert conditions
   */
  private checkAlertConditions(
    systemMetrics: SystemMetrics,
    errorMetrics: ErrorMetrics,
    performanceMetrics: PerformanceMetrics,
  ): void {
    // Check CPU usage
    if (systemMetrics.cpu.usage > 90) {
      this.addAlert(
        "critical",
        `High CPU usage: ${systemMetrics.cpu.usage.toFixed(1)}%`,
      );
    } else if (systemMetrics.cpu.usage > 80) {
      this.addAlert(
        "warning",
        `Elevated CPU usage: ${systemMetrics.cpu.usage.toFixed(1)}%`,
      );
    }

    // Check memory usage
    if (systemMetrics.memory.usage > 90) {
      this.addAlert(
        "critical",
        `High memory usage: ${systemMetrics.memory.usage.toFixed(1)}%`,
      );
    } else if (systemMetrics.memory.usage > 80) {
      this.addAlert(
        "warning",
        `Elevated memory usage: ${systemMetrics.memory.usage.toFixed(1)}%`,
      );
    }

    // Check disk usage
    if (systemMetrics.disk.usage > 90) {
      this.addAlert(
        "critical",
        `High disk usage: ${systemMetrics.disk.usage.toFixed(1)}%`,
      );
    } else if (systemMetrics.disk.usage > 80) {
      this.addAlert(
        "warning",
        `Elevated disk usage: ${systemMetrics.disk.usage.toFixed(1)}%`,
      );
    }

    // Check error rate
    if (errorMetrics.errorRate > 10) {
      this.addAlert(
        "critical",
        `High error rate: ${errorMetrics.errorRate.toFixed(1)} errors/minute`,
      );
    } else if (errorMetrics.errorRate > 5) {
      this.addAlert(
        "warning",
        `Elevated error rate: ${errorMetrics.errorRate.toFixed(1)} errors/minute`,
      );
    }

    // Check response time
    if (performanceMetrics.responseTime.average > 500) {
      this.addAlert(
        "critical",
        `High average response time: ${performanceMetrics.responseTime.average.toFixed(1)}ms`,
      );
    } else if (performanceMetrics.responseTime.average > 300) {
      this.addAlert(
        "warning",
        `Elevated average response time: ${performanceMetrics.responseTime.average.toFixed(1)}ms`,
      );
    }
  }

  /**
   * Add an alert
   */
  private addAlert(
    severity: "info" | "warning" | "critical",
    message: string,
  ): void {
    // Check if a similar alert already exists
    const existingAlert = this.alerts.find(
      (a) =>
        a.message === message && a.severity === severity && !a.acknowledged,
    );

    if (!existingAlert) {
      const alertId = `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      this.alerts.push({
        id: alertId,
        severity,
        message,
        timestamp: new Date(),
        acknowledged: false,
      });

      // Emit alert event
      this.emit("alert", {
        id: alertId,
        severity,
        message,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Initialize with mock data
   */
  private initializeMockData(): void {
    // Generate initial service statuses
    this.performHealthChecks();

    // Generate initial metrics
    this.collectMetrics();

    // Generate some historical data
    for (let i = 0; i < 24; i++) {
      const systemMetrics = this.generateMockSystemMetrics();
      const errorMetrics = this.generateMockErrorMetrics();
      const performanceMetrics = this.generateMockPerformanceMetrics();

      // Set timestamp to past hours
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - (24 - i));
      systemMetrics.timestamp = timestamp;

      this.metricsHistory.push(systemMetrics);
      this.errorHistory.push(errorMetrics);
      this.performanceHistory.push(performanceMetrics);
    }
  }

  /**
   * Generate mock system metrics
   */
  private generateMockSystemMetrics(): SystemMetrics {
    const cpuUsage = Math.random() * 30 + 50; // 50-80%
    const memoryUsage = Math.random() * 20 + 60; // 60-80%
    const diskUsage = Math.random() * 15 + 70; // 70-85%

    return {
      cpu: {
        usage: cpuUsage,
        cores: 8,
        temperature: Math.random() * 20 + 50, // 50-70°C
      },
      memory: {
        total: 16 * 1024 * 1024 * 1024, // 16GB
        used: 16 * 1024 * 1024 * 1024 * (memoryUsage / 100),
        free: 16 * 1024 * 1024 * 1024 * (1 - memoryUsage / 100),
        usage: memoryUsage,
      },
      disk: {
        total: 500 * 1024 * 1024 * 1024, // 500GB
        used: 500 * 1024 * 1024 * 1024 * (diskUsage / 100),
        free: 500 * 1024 * 1024 * 1024 * (1 - diskUsage / 100),
        usage: diskUsage,
      },
      network: {
        bytesIn: Math.random() * 5 * 1024 * 1024, // 0-5MB/s
        bytesOut: Math.random() * 2 * 1024 * 1024, // 0-2MB/s
        connections: Math.floor(Math.random() * 500) + 100, // 100-600 connections
      },
      uptime: Math.floor(Math.random() * 30 * 24 * 60 * 60) + 24 * 60 * 60, // 1-30 days
      timestamp: new Date(),
    };
  }

  /**
   * Generate mock error metrics
   */
  private generateMockErrorMetrics(): ErrorMetrics {
    const errorRate = Math.random() * 5; // 0-5 errors per minute

    return {
      total: Math.floor(Math.random() * 1000) + 100, // 100-1100 errors
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
        endpoint: ["/api/products", "/api/orders", "/api/auth", "/api/search"][
          Math.floor(Math.random() * 4)
        ],
        message: "Error processing request",
        stack:
          "Error: Error processing request\n    at processRequest (/app/src/controllers/productController.ts:45:7)",
      })),
      errorRate,
    };
  }

  /**
   * Generate mock performance metrics
   */
  private generateMockPerformanceMetrics(): PerformanceMetrics {
    const avgResponseTime = Math.random() * 200 + 100; // 100-300ms

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
        requestsPerMinute: Math.floor(Math.random() * 1000) + 500, // 500-1500 requests per minute
        byEndpoint: {
          "/api/products": Math.floor(Math.random() * 400) + 200,
          "/api/orders": Math.floor(Math.random() * 200) + 100,
          "/api/auth": Math.floor(Math.random() * 150) + 50,
          "/api/search": Math.floor(Math.random() * 300) + 150,
        },
      },
      databasePerformance: {
        queryTime: {
          average: Math.random() * 50 + 20, // 20-70ms
          p95: Math.random() * 100 + 50, // 50-150ms
        },
        connectionPoolSize: 20,
        activeConnections: Math.floor(Math.random() * 15) + 5, // 5-20 connections
        queryCount: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 queries
      },
    };
  }
}
