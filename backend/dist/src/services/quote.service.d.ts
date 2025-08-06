import { PrismaService } from '../prisma.service';
import { PricingService } from './pricing.service';
import { SanitizationService } from '../utils/sanitization.service';
import { QuoteStatus } from '@prisma/client';
export interface QuoteItem {
    productId: string;
    quantity: number;
    notes?: string;
}
export interface CreateQuoteDto {
    userId: string;
    items: QuoteItem[];
    notes?: string;
    validUntil?: Date;
}
export interface QuoteResponse {
    id: string;
    quoteNumber: string;
    status: QuoteStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    validUntil: Date;
    items: Array<{
        product: {
            id: string;
            name: string;
            sku: string;
            image?: string;
        };
        quantity: number;
        price: number;
        total: number;
    }>;
}
export declare class QuoteService {
    private prisma;
    private pricingService;
    private sanitizationService;
    constructor(prisma: PrismaService, pricingService: PricingService, sanitizationService: SanitizationService);
    createQuote(createQuoteDto: CreateQuoteDto): Promise<QuoteResponse>;
    updateQuoteStatus(quoteId: string, status: QuoteStatus, notes?: string): Promise<void>;
    convertQuoteToOrder(quoteId: string): Promise<string>;
    private calculateTax;
    private calculateShipping;
    private generateQuoteNumber;
    private generateOrderNumber;
}
