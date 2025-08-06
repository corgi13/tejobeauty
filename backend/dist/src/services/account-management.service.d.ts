import { PrismaService } from '../prisma.service';
export declare class AccountManagementService {
    private prisma;
    constructor(prisma: PrismaService);
    assignAccountManager(customerId: string, managerId: string): Promise<{
        message: string;
    }>;
    getCustomerHistory(customerId: string): Promise<{
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
    }[]>;
    scheduleFollowUp(customerId: string, date: Date): Promise<{
        message: string;
    }>;
    generateCustomerReport(customerId: string): Promise<{
        customer: {
            id: string;
            email: string;
            password: string | null;
            firstName: string | null;
            lastName: string | null;
            role: import(".prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            mfaEnabled: boolean;
            mfaSecret: string | null;
            language: string;
            currency: string;
            timezone: string;
            emailMarketingConsent: boolean;
            emailOrderUpdates: boolean;
            emailProductUpdates: boolean;
            lastLoginAt: Date | null;
            isActive: boolean;
            accountManagerId: string | null;
            creditLimit: number;
            paymentTerms: number;
            createdAt: Date;
            updatedAt: Date;
            customerTierId: string | null;
        };
        orders: {
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
        }[];
    }>;
    trackCustomerInteraction(customerId: string, type: string, notes: string): Promise<{
        message: string;
    }>;
}
