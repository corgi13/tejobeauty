import { BulkOrderStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreateBulkOrderDto } from "./dto/create-bulk-order.dto";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";
export declare class ProfessionalService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createProfessionalDto: CreateProfessionalDto): Promise<{
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
    findAll(page?: number, limit?: number, isVerified?: boolean): Promise<{
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
    findByUserId(userId: string): Promise<{
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
    update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<{
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
    createBulkOrder(professionalId: string, createBulkOrderDto: CreateBulkOrderDto): Promise<{
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
    findBulkOrders(professionalId: string, page?: number, limit?: number): Promise<{
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
    findCommissions(professionalId: string, page?: number, limit?: number): Promise<{
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
    calculateCommission(professionalId: string, orderAmount: number): Promise<{
        status: import(".prisma/client").$Enums.CommissionStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string | null;
        amount: number;
        rate: number;
        professionalId: string;
        paidAt: Date | null;
    }>;
    getStats(professionalId: string): Promise<{
        totalOrders: number;
        totalCommissions: number;
        pendingCommissions: number;
    }>;
}
