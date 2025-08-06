import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PricingService } from './pricing.service';
import { SanitizationService } from '../utils/sanitization.service';
import { QuoteStatus } from '@prisma/client';
import * as puppeteer from 'puppeteer';

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

@Injectable()
export class QuoteService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
    private sanitizationService: SanitizationService,
  ) {}

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<QuoteResponse> {
    const { userId, items, notes, validUntil } = createQuoteDto;
    const sanitizedUserId = this.sanitizationService.sanitizeId(userId);
    const sanitizedNotes = notes ? this.sanitizationService.sanitizeText(notes, 500) : undefined;
    
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: sanitizedUserId },
      include: { customerTier: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let subtotal = 0;
    const quoteItems = [];

    // Calculate pricing for each item
    for (const item of items) {
      const pricing = await this.pricingService.calculateBulkPrice(
        item.productId,
        item.quantity,
        sanitizedUserId,
      );

      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { take: 1 } },
      });

      if (!product) {
        throw new BadRequestException(`Product with ID ${item.productId} not found`);
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

    // Calculate tax and shipping
    const tax = await this.calculateTax(subtotal, sanitizedUserId);
    const shipping = await this.calculateShipping(items, sanitizedUserId);
    const total = subtotal + tax + shipping;

    // Generate quote number
    const quoteNumber = await this.generateQuoteNumber();

    // Set validity period (default 30 days)
    const quoteValidUntil = validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create quote
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
      validUntil: quote.validUntil!,
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

  async updateQuoteStatus(
    quoteId: string,
    status: QuoteStatus,
    notes?: string,
  ): Promise<void> {
    const sanitizedQuoteId = this.sanitizationService.sanitizeId(quoteId);
    const sanitizedNotes = notes ? this.sanitizationService.sanitizeText(notes, 500) : undefined;

    const updateData: any = { status };
    
    if (status === QuoteStatus.SENT) {
      updateData.sentAt = new Date();
    } else if (status === QuoteStatus.ACCEPTED) {
      updateData.acceptedAt = new Date();
    } else if (status === QuoteStatus.REJECTED) {
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

  async convertQuoteToOrder(quoteId: string): Promise<string> {
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
      throw new NotFoundException('Quote not found');
    }

    if (quote.status !== QuoteStatus.ACCEPTED) {
      throw new BadRequestException('Quote must be accepted before converting to order');
    }

    if (quote.validUntil && quote.validUntil < new Date()) {
      throw new BadRequestException('Quote has expired');
    }

    const defaultAddress = quote.user.addresses[0];
    if (!defaultAddress) {
      throw new BadRequestException('User must have a default address');
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order
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

    // Update quote status
    await this.prisma.quote.update({
      where: { id: sanitizedQuoteId },
      data: {
        status: QuoteStatus.CONVERTED,
        convertedOrderId: order.id,
      },
    });

    return order.id;
  }

  private async calculateTax(subtotal: number, userId: string): Promise<number> {
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

  private async calculateShipping(
    items: Array<{ productId: string; quantity: number }>,
    userId: string,
  ): Promise<number> {
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

  private async generateOrderNumber(): Promise<string> {
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
}
