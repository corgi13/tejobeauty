import { BulkOrderStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreateBulkOrderDto } from "./dto/create-bulk-order.dto";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
export declare class ProfessionalService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createProfessionalDto: CreateProfessionalDto): Promise<any>;
    findAll(page?: number, limit?: number, isVerified?: boolean): Promise<{
        professionals: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    findByUserId(userId: string): Promise<any>;
    update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<any>;
    verify(id: string, isVerified: boolean): Promise<any>;
    createBulkOrder(professionalId: string, createBulkOrderDto: CreateBulkOrderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        total: number;
        status: import(".prisma/client").$Enums.BulkOrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        notes: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        orderNumber: string;
        businessProfileId: string;
        approvedBy: string | null;
        approvedAt: Date | null;
    }>;
    findBulkOrders(professionalId: string, page?: number, limit?: number): Promise<{
        bulkOrders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            total: number;
            status: import(".prisma/client").$Enums.BulkOrderStatus;
            subtotal: number;
            tax: number;
            shipping: number;
            discount: number;
            notes: string | null;
            items: import("@prisma/client/runtime/library").JsonValue;
            orderNumber: string;
            businessProfileId: string;
            approvedBy: string | null;
            approvedAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateBulkOrderStatus(id: string, status: BulkOrderStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        total: number;
        status: import(".prisma/client").$Enums.BulkOrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        notes: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        orderNumber: string;
        businessProfileId: string;
        approvedBy: string | null;
        approvedAt: Date | null;
    }>;
    findCommissions(professionalId: string, page?: number, limit?: number): Promise<{
        commissions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CommissionStatus;
            notes: string | null;
            rate: number;
            orderNumber: string | null;
            orderId: string | null;
            amount: number;
            businessProfileId: string;
            baseAmount: number;
            paidAt: Date | null;
            paymentReference: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    calculateCommission(professionalId: string, orderAmount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CommissionStatus;
        notes: string | null;
        rate: number;
        orderNumber: string | null;
        orderId: string | null;
        amount: number;
        businessProfileId: string;
        baseAmount: number;
        paidAt: Date | null;
        paymentReference: string | null;
    }>;
    getStats(professionalId: string): Promise<{
        totalOrders: number;
        totalCommissions: number;
        pendingCommissions: number;
    }>;
}
