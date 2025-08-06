import { PrismaService } from '../prisma.service';
export interface CreateTierDto {
    name: string;
    minSpend: number;
    discountPercentage: number;
}
export interface UpdateTierDto {
    name?: string;
    minSpend?: number;
    discountPercentage?: number;
}
export declare class TierService {
    private prisma;
    constructor(prisma: PrismaService);
    createTier(createTierDto: CreateTierDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    }>;
    getAllTiers(): Promise<({
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    })[]>;
    getTierById(id: string): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    }>;
    updateTier(id: string, updateTierDto: UpdateTierDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    }>;
    deleteTier(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    }>;
    assignUserToTier(userId: string, customerTierId: string): Promise<{
        customerTier: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            discountPercentage: number;
            minSpend: number;
        };
    } & {
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
    }>;
    removeUserFromTier(userId: string): Promise<{
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
    }>;
    getUserTier(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    }>;
    calculateUserDiscount(userId: string, orderTotal: number): Promise<number>;
    getQualifyingTier(orderTotal: number): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        discountPercentage: number;
        minSpend: number;
    }>;
    suggestTierUpgrade(userId: string, currentOrderTotal: number): Promise<{
        nextTier: {
            users: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            discountPercentage: number;
            minSpend: number;
        };
        amountNeeded: number;
        potentialDiscount: number;
    }>;
}
