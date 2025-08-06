import { PricingService } from '../services/pricing.service';
import { QuoteService } from '../services/quote.service';
import { TierService, CreateTierDto, UpdateTierDto } from '../services/tier.service';
export declare class B2BController {
    private pricingService;
    private quoteService;
    private tierService;
    constructor(pricingService: PricingService, quoteService: QuoteService, tierService: TierService);
    calculateBulkPrice(body: {
        productId: string;
        quantity: number;
        customerId: string;
    }): Promise<{
        price: import("../services/pricing.service").PricingCalculation;
    }>;
    generateQuote(body: {
        items: {
            productId: string;
            quantity: number;
        }[];
        customerId: string;
    }): Promise<string>;
    validateMinimumOrder(body: {
        total: number;
        customerId: string;
    }): Promise<{
        isValid: {
            isValid: boolean;
            minimumAmount: number;
            currentAmount: number;
        };
    }>;
    createQuote(createQuoteDto: {
        userId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
    }): Promise<import("../services/quote.service").QuoteResponse>;
    getQuote(id: string): Promise<any>;
    getUserQuotes(userId: string): Promise<any>;
    updateQuoteStatus(id: string, body: {
        status: string;
    }): Promise<void>;
    deleteQuote(id: string): Promise<any>;
    convertQuoteToOrder(id: string): Promise<string>;
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
    getTier(id: string): Promise<{
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
    assignUserToTier(userId: string, tierId: string): Promise<{
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
    calculateUserDiscount(userId: string, body: {
        orderTotal: number;
    }): Promise<{
        discount: number;
    }>;
    getQualifyingTier(body: {
        orderTotal: number;
    }): Promise<{
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
    suggestTierUpgrade(userId: string, body: {
        currentOrderTotal: number;
    }): Promise<{
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
