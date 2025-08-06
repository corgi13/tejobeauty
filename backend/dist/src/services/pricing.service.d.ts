import { PrismaService } from '../prisma.service';
import { CacheService } from '../cache/cache.service';
import { SanitizationService } from '../utils/sanitization.service';
export interface PricingCalculation {
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    tierDiscount: number;
    bulkDiscount: number;
    totalSavings: number;
    total: number;
}
export interface BulkPricingTier {
    minQuantity: number;
    maxQuantity: number;
    price: number;
    discountPercentage: number;
}
export declare class PricingService {
    private prisma;
    private cacheService;
    private sanitizationService;
    constructor(prisma: PrismaService, cacheService: CacheService, sanitizationService: SanitizationService);
    calculateBulkPrice(productId: string, quantity: number, customerId?: string): Promise<PricingCalculation>;
    getTierDiscount(customerId: string): Promise<number>;
    generateCustomQuote(items: Array<{
        productId: string;
        quantity: number;
    }>, customerId: string, notes?: string): Promise<string>;
    validateMinimumOrder(items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>, customerId?: string): Promise<{
        isValid: boolean;
        minimumAmount: number;
        currentAmount: number;
    }>;
    getBulkPricingTiers(productId: string): Promise<BulkPricingTier[]>;
    private calculateTax;
    private calculateShipping;
    private generateQuoteNumber;
    updateCustomerTier(customerId: string): Promise<void>;
}
