import { Injectable, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class PricingService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private sanitizationService: SanitizationService,
  ) {}

  async calculateBulkPrice(
    productId: string,
    quantity: number,
    customerId?: string,
  ): Promise<PricingCalculation> {
    const sanitizedProductId = this.sanitizationService.sanitizeId(productId);
    const sanitizedQuantity = this.sanitizationService.sanitizeNumber(quantity, 1, 10000);
    
    const cacheKey = `bulk_price:${sanitizedProductId}:${sanitizedQuantity}:${customerId || 'guest'}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { id: sanitizedProductId },
          include: { bulkPricings: true },
        });

        if (!product) {
          throw new BadRequestException('Product not found');
        }

        const originalPrice = product.price;
        let discountedPrice = originalPrice;
        let tierDiscount = 0;
        let bulkDiscount = 0;

        // Apply customer tier discount
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

        // Apply bulk pricing
        const bulkPricing = product.bulkPricings.find(
          bp => sanitizedQuantity >= bp.minQuantity && sanitizedQuantity <= bp.maxQuantity
        );

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
      },
      300, // Cache for 5 minutes
    );
  }

  async getTierDiscount(customerId: string): Promise<number> {
    const sanitizedCustomerId = this.sanitizationService.sanitizeId(customerId);
    
    const user = await this.prisma.user.findUnique({
      where: { id: sanitizedCustomerId },
      include: { customerTier: true },
    });

    return user?.customerTier?.discountPercentage || 0;
  }

  async generateCustomQuote(
    items: Array<{ productId: string; quantity: number }>,
    customerId: string,
    notes?: string,
  ): Promise<string> {
    const sanitizedCustomerId = this.sanitizationService.sanitizeId(customerId);
    const sanitizedNotes = notes ? this.sanitizationService.sanitizeText(notes, 500) : undefined;

    let subtotal = 0;
    const quoteItems = [];

    for (const item of items) {
      const pricing = await this.calculateBulkPrice(
        item.productId,
        item.quantity,
        sanitizedCustomerId,
      );

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
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        items: {
          create: quoteItems,
        },
      },
    });

    return quote.id;
  }

  async validateMinimumOrder(
    items: Array<{ productId: string; quantity: number; price: number }>,
    customerId?: string,
  ): Promise<{ isValid: boolean; minimumAmount: number; currentAmount: number }> {
    const currentAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let minimumAmount = parseFloat(process.env.MIN_ORDER_AMOUNT || '100');

    if (customerId) {
      const user = await this.prisma.user.findUnique({
        where: { id: customerId },
        include: { customerTier: true },
      });

      // Different minimum amounts for different tiers
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

  async getBulkPricingTiers(productId: string): Promise<BulkPricingTier[]> {
    const sanitizedProductId = this.sanitizationService.sanitizeId(productId);
    
    const bulkPricings = await this.prisma.bulkPricing.findMany({
      where: { productId: sanitizedProductId },
      orderBy: { minQuantity: 'asc' },
    });

    const product = await this.prisma.product.findUnique({
      where: { id: sanitizedProductId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return bulkPricings.map(bp => ({
      minQuantity: bp.minQuantity,
      maxQuantity: bp.maxQuantity,
      price: bp.price,
      discountPercentage: ((product.price - bp.price) / product.price) * 100,
    }));
  }

  private async calculateTax(subtotal: number, customerId: string): Promise<number> {
    // Get user's country for tax calculation
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
    
    // Get tax rate for country
    const taxRate = await this.prisma.taxRate.findFirst({
      where: { 
        country,
        isActive: true,
      },
    });

    return taxRate ? (subtotal * taxRate.rate / 100) : 0;
  }

  private async calculateShipping(
    items: Array<{ productId: string; quantity: number }>,
    customerId: string,
  ): Promise<number> {
    // Simplified shipping calculation
    // In a real implementation, this would consider weight, dimensions, destination, etc.
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems >= 50) {
      return 0; // Free shipping for large orders
    }

    return 25.00; // Standard shipping rate
  }

  private async generateQuoteNumber(): Promise<string> {
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

  async updateCustomerTier(customerId: string): Promise<void> {
    const sanitizedCustomerId = this.sanitizationService.sanitizeId(customerId);
    
    // Calculate total spend in the last 12 months
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

    // Find appropriate tier
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
}