import { PrismaService } from "../prisma.service";
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        users: {
            total: any;
            professionals: any;
            verifiedProfessionals: any;
        };
        orders: {
            total: any;
            pending: any;
            completed: any;
        };
        revenue: {
            total: any;
        };
        products: {
            total: any;
        };
    }>;
    getSalesData(period?: "week" | "month" | "year"): Promise<{
        date: string;
        sales: number;
        orders: number;
    }[]>;
    getTopProducts(limit?: number): Promise<{
        product: {
            id: string;
            name: string;
            price: number;
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                url: string;
                altText: string | null;
                sortOrder: number;
            }[];
        };
        totalQuantity: number;
        totalRevenue: number;
        orderCount: number;
    }[]>;
    getTopCategories(limit?: number): Promise<any[]>;
    getUserGrowth(period?: "week" | "month" | "year"): Promise<any[]>;
    getOrderStatusDistribution(): Promise<{
        status: import(".prisma/client").$Enums.OrderStatus;
        count: number;
    }[]>;
    getRevenueByMonth(year?: number): Promise<{
        month: number;
        revenue: number;
        orders: number;
    }[]>;
    getProfessionalStats(): Promise<{
        professionals: {
            total: any;
            verified: any;
            verificationRate: number;
        };
        commissions: {
            total: any;
            paid: any;
            pending: number;
        };
        bulkOrders: {
            total: any;
            completed: any;
            completionRate: number;
        };
    }>;
}
