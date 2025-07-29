import { BulkOrderStatus } from "@prisma/client";
import { CreateBulkOrderDto } from "./dto/create-bulk-order.dto";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
import { ProfessionalService } from "./professional.service";
export declare class ProfessionalController {
    private readonly professionalService;
    constructor(professionalService: ProfessionalService);
    register(req: any, createProfessionalDto: CreateProfessionalDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        isVerified: boolean;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        taxId: string;
        commissionRate: number;
    }>;
    findAll(page?: string, limit?: string, verified?: string): Promise<{
        professionals: ({
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            _count: {
                commissions: number;
                bulkOrders: number;
            };
        } & {
            isVerified: boolean;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            businessName: string;
            taxId: string;
            commissionRate: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getProfile(req: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        commissions: {
            status: import(".prisma/client").$Enums.CommissionStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string | null;
            amount: number;
            rate: number;
            professionalId: string;
            paidAt: Date | null;
        }[];
        bulkOrders: {
            total: number;
            status: import(".prisma/client").$Enums.BulkOrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            items: import("@prisma/client/runtime/library").JsonValue;
            name: string;
            professionalId: string;
        }[];
    } & {
        isVerified: boolean;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        taxId: string;
        commissionRate: number;
    }>;
    getStats(req: any): Promise<{
        totalOrders: number;
        totalCommissions: number;
        pendingCommissions: number;
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        commissions: {
            status: import(".prisma/client").$Enums.CommissionStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string | null;
            amount: number;
            rate: number;
            professionalId: string;
            paidAt: Date | null;
        }[];
        bulkOrders: {
            total: number;
            status: import(".prisma/client").$Enums.BulkOrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            items: import("@prisma/client/runtime/library").JsonValue;
            name: string;
            professionalId: string;
        }[];
    } & {
        isVerified: boolean;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        taxId: string;
        commissionRate: number;
    }>;
    updateProfile(req: any, updateProfessionalDto: UpdateProfessionalDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        isVerified: boolean;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        taxId: string;
        commissionRate: number;
    }>;
    verify(id: string, isVerified: boolean): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        isVerified: boolean;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        businessName: string;
        taxId: string;
        commissionRate: number;
    }>;
    createBulkOrder(req: any, createBulkOrderDto: CreateBulkOrderDto): Promise<{
        professional: {
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            isVerified: boolean;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            businessName: string;
            taxId: string;
            commissionRate: number;
        };
    } & {
        total: number;
        status: import(".prisma/client").$Enums.BulkOrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        items: import("@prisma/client/runtime/library").JsonValue;
        name: string;
        professionalId: string;
    }>;
    getMyBulkOrders(req: any, page?: string, limit?: string): Promise<{
        bulkOrders: ({
            professional: {
                user: {
                    id: string;
                    email: string;
                    firstName: string | null;
                    lastName: string | null;
                };
            } & {
                isVerified: boolean;
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                businessName: string;
                taxId: string;
                commissionRate: number;
            };
        } & {
            total: number;
            status: import(".prisma/client").$Enums.BulkOrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            items: import("@prisma/client/runtime/library").JsonValue;
            name: string;
            professionalId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateBulkOrderStatus(id: string, status: BulkOrderStatus): Promise<{
        total: number;
        status: import(".prisma/client").$Enums.BulkOrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        items: import("@prisma/client/runtime/library").JsonValue;
        name: string;
        professionalId: string;
    }>;
    getMyCommissions(req: any, page?: string, limit?: string): Promise<{
        commissions: {
            status: import(".prisma/client").$Enums.CommissionStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string | null;
            amount: number;
            rate: number;
            professionalId: string;
            paidAt: Date | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
}
