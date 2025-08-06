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
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const pricing_service_1 = require("./pricing.service");
const sanitization_service_1 = require("../utils/sanitization.service");
const client_1 = require("@prisma/client");
let QuoteService = class QuoteService {
    constructor(prisma, pricingService, sanitizationService) {
        this.prisma = prisma;
        this.pricingService = pricingService;
        this.sanitizationService = sanitizationService;
    }
    async createQuote(createQuoteDto) {
        const { userId, items, notes, validUntil } = createQuoteDto;
        const sanitizedUserId = this.sanitizationService.sanitizeId(userId);
        const sanitizedNotes = notes ? this.sanitizationService.sanitizeText(notes, 500) : undefined;
        const user = await this.prisma.user.findUnique({
            where: { id: sanitizedUserId },
            include: { customerTier: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let subtotal = 0;
        const quoteItems = [];
        for (const item of items) {
            const pricing = await this.pricingService.calculateBulkPrice(item.productId, item.quantity, sanitizedUserId);
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                include: { images: { take: 1 } },
            });
            if (!product) {
                throw new common_1.BadRequestException(`Product with ID ${item.productId} not found`);
            }
            const itemTotal = pricing.discountedPrice * item.quantity;
            subtotal += itemTotal;
            quoteItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: pricing.discountedPrice,
                product: {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    image: product.images[0]?.url,
                },
                total: itemTotal,
            });
        }
        const tax = await this.calculateTax(subtotal, sanitizedUserId);
        const shipping = await this.calculateShipping(items, sanitizedUserId);
        const total = subtotal + tax + shipping;
        const quoteNumber = await this.generateQuoteNumber();
        const quoteValidUntil = validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const quote = await this.prisma.quote.create({
            data: {
                quoteNumber,
                userId: sanitizedUserId,
                subtotal,
                tax,
                shipping,
                total,
                notes: sanitizedNotes,
                validUntil: quoteValidUntil,
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: quoteItems.find(qi => qi.productId === item.productId)?.price || 0,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: { take: 1 },
                            },
                        },
                    },
                },
            },
        });
        return {
            id: quote.id,
            quoteNumber: quote.quoteNumber,
            status: quote.status,
            subtotal: quote.subtotal,
            tax: quote.tax,
            shipping: quote.shipping,
            total: quote.total,
            validUntil: quote.validUntil,
            items: quote.items.map(item => ({
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    sku: item.product.sku,
                    image: item.product.images[0]?.url,
                },
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
            })),
        };
    }
    async updateQuoteStatus(quoteId, status, notes) {
        const sanitizedQuoteId = this.sanitizationService.sanitizeId(quoteId);
        const sanitizedNotes = notes ? this.sanitizationService.sanitizeText(notes, 500) : undefined;
        const updateData = { status };
        if (status === client_1.QuoteStatus.SENT) {
            updateData.sentAt = new Date();
        }
        else if (status === client_1.QuoteStatus.ACCEPTED) {
            updateData.acceptedAt = new Date();
        }
        else if (status === client_1.QuoteStatus.REJECTED) {
            updateData.rejectedAt = new Date();
        }
        if (sanitizedNotes) {
            updateData.internalNotes = sanitizedNotes;
        }
        await this.prisma.quote.update({
            where: { id: sanitizedQuoteId },
            data: updateData,
        });
    }
    async convertQuoteToOrder(quoteId) {
        const sanitizedQuoteId = this.sanitizationService.sanitizeId(quoteId);
        const quote = await this.prisma.quote.findUnique({
            where: { id: sanitizedQuoteId },
            include: {
                items: {
                    include: { product: true },
                },
                user: {
                    include: {
                        addresses: {
                            where: { isDefault: true },
                            take: 1,
                        },
                    },
                },
            },
        });
        if (!quote) {
            throw new common_1.NotFoundException('Quote not found');
        }
        if (quote.status !== client_1.QuoteStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Quote must be accepted before converting to order');
        }
        if (quote.validUntil && quote.validUntil < new Date()) {
            throw new common_1.BadRequestException('Quote has expired');
        }
        const defaultAddress = quote.user.addresses[0];
        if (!defaultAddress) {
            throw new common_1.BadRequestException('User must have a default address');
        }
        const orderNumber = await this.generateOrderNumber();
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId: quote.userId,
                subtotal: quote.subtotal,
                tax: quote.tax,
                shipping: quote.shipping,
                total: quote.total,
                shippingAddressId: defaultAddress.id,
                billingAddressId: defaultAddress.id,
                items: {
                    create: quote.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                    })),
                },
            },
        });
        await this.prisma.quote.update({
            where: { id: sanitizedQuoteId },
            data: {
                status: client_1.QuoteStatus.CONVERTED,
                convertedOrderId: order.id,
            },
        });
        return order.id;
    }
    async calculateTax(subtotal, userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId },
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
    async calculateShipping(items, userId) {
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
    async generateOrderNumber() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const lastOrder = await this.prisma.order.findFirst({
            where: {
                orderNumber: {
                    startsWith: `TB${year}${month}`,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        return `TB${year}${month}${String(sequence).padStart(4, '0')}`;
    }
};
exports.QuoteService = QuoteService;
exports.QuoteService = QuoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pricing_service_1.PricingService,
        sanitization_service_1.SanitizationService])
], QuoteService);
//# sourceMappingURL=quote.service.js.map