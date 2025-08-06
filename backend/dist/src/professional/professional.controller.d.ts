import { BulkOrderStatus } from "@prisma/client";
import { CreateBulkOrderDto } from "./dto/create-bulk-order.dto";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { ProfessionalService } from "./professional.service";
export declare class ProfessionalController {
    private readonly professionalService;
    constructor(professionalService: ProfessionalService);
    register(req: any, createProfessionalDto: CreateProfessionalDto): Promise<any>;
    findAll(page?: string, limit?: string, verified?: string): Promise<{
        professionals: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getProfile(req: any): Promise<any>;
    getStats(req: any): Promise<{
        totalOrders: number;
        totalCommissions: number;
        pendingCommissions: number;
    }>;
    findOne(id: string): Promise<any>;
    updateProfile(req: any, updateProfessionalDto: UpdateProfessionalDto): Promise<any>;
    verify(id: string, isVerified: boolean): Promise<any>;
    createBulkOrder(req: any, createBulkOrderDto: CreateBulkOrderDto): Promise<{
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
    getMyBulkOrders(req: any, page?: string, limit?: string): Promise<{
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
    getMyCommissions(req: any, page?: string, limit?: string): Promise<{
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
}
