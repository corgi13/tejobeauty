import { SystemHealthService } from "./system-health.service";
export declare class SystemHealthController {
    private readonly systemHealthService;
    constructor(systemHealthService: SystemHealthService);
    getSystemHealth(): Promise<import("./system-health.service").SystemHealthStatus>;
    getMetrics(hours?: number): Promise<import("./system-health.service").SystemMetrics[]>;
    getErrors(hours?: number): Promise<import("./system-health.service").ErrorMetrics[]>;
    getPerformance(hours?: number): Promise<import("./system-health.service").PerformanceMetrics[]>;
    acknowledgeAlert(alertId: string): Promise<{
        success: boolean;
    }>;
    clearAcknowledgedAlerts(): Promise<{
        success: boolean;
    }>;
}
