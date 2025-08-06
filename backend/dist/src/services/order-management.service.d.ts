import { PrismaService } from '../prisma.service';
import { PricingService } from './pricing.service';
export declare class OrderManagementService {
    private prisma;
    private pricingService;
    constructor(prisma: PrismaService, pricingService: PricingService);
    createBulkOrder(customerId: string, items: any, orderTemplate: any): Promise<{
        message: string;
    }>;
    setupRecurringOrder(customerId: string, items: any, schedule: any): Promise<{
        message: string;
    }>;
    processOrderApproval(orderId: string, approverId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        notes: string | null;
        orderNumber: string;
        shippingAddressId: string;
        billingAddressId: string | null;
        paymentIntentId: string | null;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        trackingNumber: string | null;
    }>;
    generatePickingList(orderId: string): Promise<{
        pickingList: string;
    }>;
    manageOrderTemplates(customerId: string, template: any): Promise<{
        message: string;
    }>;
    private sanitizeLogInput;
}
