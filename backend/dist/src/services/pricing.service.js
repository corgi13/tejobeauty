"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const cache_service_1 = require("../cache/cache.service");
const sanitization_service_1 = require("../utils/sanitization.service");
let PricingService = class PricingService {
    constructor(prisma, cacheService, sanitizationService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
        this.sanitizationService = sanitizationService;
    }
    async calculateBulkPrice(productId, quantity, customerId) {
        const sanitizedProductId = this.sanitizationService.sanitizeId(productId);
        const sanitizedQuantity = this.sanitizationService.sanitizeNumber(quantity, 1, 10000);
        const cacheKey = `bulk_price:${sanitizedProductId}:${sanitizedQuantity}:${customerId || 'guest'}`;
        return this.cacheService.getOrSet(cacheKey, async () => {
            const product = await this.prisma.product.findUnique({
                where: { id: sanitizedProductId },
                include: { bulkPricings: true },
            });
            if (!product) {
                throw new common_1.BadRequestException('Product not found');
            }
            const originalPrice = product.price;
            let discountedPrice = originalPrice;
            let tierDiscount = 0;
            let bulkDiscount = 0;
            if (customerId) {
                const user = await this.prisma.user.findUnique({
                    where: { id: customerId },
                    include: { customerTier: true },
                });
                if (user?.customerTier) {
                    tierDiscount = user.customerTier.discountPercentage;
                    discountedPrice = originalPrice * (1 - tierDiscount / 100);
                }
            }
            const bulkPricing = product.bulkPricings.find(bp => sanitizedQuantity >= bp.minQuantity && sanitizedQuantity <= bp.maxQuantity);
            if (bulkPricing) {
                const bulkPrice = bulkPricing.price;
                if (bulkPrice < discountedPrice) {
                    bulkDiscount = ((discountedPrice - bulkPrice) / discountedPrice) * 100;
                    discountedPrice = bulkPrice;
                }
            }
            const totalSavings = (originalPrice - discountedPrice) * sanitizedQuantity;
            const discountPercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
            return {
                originalPrice,
                discountedPrice,
                discountPercentage,
                tierDiscount,
                bulkDiscount,
                totalSavings,
                total: discountedPrice * sanitizedQuantity,
            };
        }, 300);
    }
    async getTierDiscount(customerId) {
        const sanitizedCustomerId = this.sanitizationService.sanitizeId(customerId);
        const user = await this.prisma.user.findUnique({
            where: { id: sanitizedCustomerId },
            include: { customerTier: true },
        });
        return user?.customerTier?.discountPercentage || 0;
    }
    async generateCustomQuote(items, customerId, notes) {
        const sanitizedCustomerId = this.sanitizationService.sanitizeId(customerId);
        const sanitizedNotes = notes ? this.sanitizationService.sanitizeText(notes, 500) : undefined;
        let subtotal = 0;
        const quoteItems = [];
        for (const item of items) {
            const pricing = await this.calculateBulkPrice(item.productId, item.quantity, sanitizedCustomerId);
            const itemTotal = pricing.discountedPrice * item.quantity;
            subtotal += itemTotal;
            quoteItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: pricing.discountedPrice,
            });
        }
        const tax = await this.calculateTax(subtotal, sanitizedCustomerId);
        const shipping = await this.calculateShipping(items, sanitizedCustomerId);
        const total = subtotal + tax + shipping;
        const quoteNumber = await this.generateQuoteNumber();
        const quote = await this.prisma.quote.create({
            data: {
                quoteNumber,
                userId: sanitizedCustomerId,
                subtotal,
                tax,
                shipping,
                total,
                notes: sanitizedNotes,
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                items: {
                    create: quoteItems,
                },
            },
        });
        return quote.id;
    }
    async validateMinimumOrder(items, customerId) {
        const currentAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let minimumAmount = parseFloat(process.env.MIN_ORDER_AMOUNT || '100');
        if (customerId) {
            const user = await this.prisma.user.findUnique({
                where: { id: customerId },
                include: { customerTier: true },
            });
            if (user?.customerTier) {
                minimumAmount = user.customerTier.minSpend;
            }
        }
        return {
            isValid: currentAmount >= minimumAmount,
            minimumAmount,
            currentAmount,
        };
    }
    async getBulkPricingTiers(productId) {
        const sanitizedProductId = this.sanitizationService.sanitizeId(productId);
        const bulkPricings = await this.prisma.bulkPricing.findMany({
            where: { productId: sanitizedProductId },
            orderBy: { minQuantity: 'asc' },
        });
        const product = await this.prisma.product.findUnique({
            where: { id: sanitizedProductId },
        });
        if (!product) {
            throw new common_1.BadRequestException('Product not found');
        }
        return bulkPricings.map(bp => ({
            minQuantity: bp.minQuantity,
            maxQuantity: bp.maxQuantity,
            price: bp.price,
            discountPercentage: ((product.price - bp.price) / product.price) * 100,
        }));
    }
    async calculateTax(subtotal, customerId) {
        const user = await this.prisma.user.findFirst({
            where: { id: customerId },
            include: {
                addresses: {
                    where: { isDefault: true },
                    take: 1,
                },
            },
        });
        const country = user?.addresses[0]?.country || 'HR';
        const taxRate = await this.prisma.taxRate.findFirst({
            where: {
                country,
                isActive: true,
            },
        });
        return taxRate ? (subtotal * taxRate.rate / 100) : 0;
    }
    async calculateShipping(items, customerId) {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems >= 50) {
            return 0;
        }
        return 25.00;
    }
    async generateQuoteNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const lastQuote = await this.prisma.quote.findFirst({
            where: {
                quoteNumber: {
                    startsWith: `Q${year}${month}`,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let sequence = 1;
        if (lastQuote) {
            const lastSequence = parseInt(lastQuote.quoteNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        return `Q${year}${month}${String(sequence).padStart(4, '0')}`;
    }
    async updateCustomerTier(customerId) {
        const sanitizedCustomerId = this.sanitizationService.sanitizeId(customerId);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const totalSpend = await this.prisma.order.aggregate({
            where: {
                userId: sanitizedCustomerId,
                status: 'DELIVERED',
                createdAt: {
                    gte: oneYearAgo,
                },
            },
            _sum: {
                total: true,
            },
        });
        const spendAmount = totalSpend._sum.total || 0;
        const tier = await this.prisma.customerTier.findFirst({
            where: {
                minSpend: {
                    lte: spendAmount,
                },
            },
            orderBy: {
                minSpend: 'desc',
            },
        });
        if (tier) {
            await this.prisma.user.update({
                where: { id: sanitizedCustomerId },
                data: { customerTierId: tier.id },
            });
        }
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService,
        sanitization_service_1.SanitizationService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map