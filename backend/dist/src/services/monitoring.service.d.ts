export declare class MonitoringService {
    constructor();
    trackApiResponse(endpoint: string, responseTime: number): Promise<void>;
    monitorDatabaseQuery(query: string, executionTime: number): Promise<void>;
    recordUserActivity(userId: string, activity: string): Promise<void>;
    logError(error: any, context: any): Promise<void>;
    generateHealthReport(): Promise<{
        status: string;
    }>;
}
