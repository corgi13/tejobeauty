import { AnalyticsService } from "./analytics.service";
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            professionals: number;
            verifiedProfessionals: number;
        };
        orders: {
            total: number;
            pending: number;
            completed: number;
        };
        revenue: {
            total: number;
        };
        products: {
            total: number;
        };
    }>;
    getSalesData(period?: "week" | "month" | "year"): Promise<{
        date: string;
        sales: number;
        orders: number;
    }[]>;
    getTopProducts(limit?: string): Promise<{
        product: {
            id: string;
            name: string;
            price: number;
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                sortOrder: number;
                url: string;
                altText: string | null;
            }[];
        } | null;
        totalQuantity: number;
        totalRevenue: number;
        orderCount: number;
    }[]>;
    getTopCategories(limit?: string): Promise<any[]>;
    getUserGrowth(period?: "week" | "month" | "year"): Promise<any[]>;
    getOrderStatusDistribution(): Promise<{
        status: import(".prisma/client").$Enums.OrderStatus;
        count: number;
    }[]>;
    getRevenueByMonth(year?: string): Promise<{
        month: number;
        revenue: number;
        orders: number;
    }[]>;
    getProfessionalStats(): Promise<{
        professionals: {
            total: number;
            verified: number;
            verificationRate: number;
        };
        commissions: {
            total: number;
            paid: number;
            pending: number;
        };
        bulkOrders: {
            total: number;
            completed: number;
            completionRate: number;
        };
    }>;
}
