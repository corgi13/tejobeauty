import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PricingService } from '../services/pricing.service';
import { QuoteService, CreateQuoteDto } from '../services/quote.service';
import { TierService, CreateTierDto, UpdateTierDto } from '../services/tier.service';

@Controller('b2b')
export class B2BController {
  constructor(
    private pricingService: PricingService,
    private quoteService: QuoteService,
    private tierService: TierService,
  ) {}

  // Pricing endpoints
  @Post('pricing/bulk-price')
  async calculateBulkPrice(@Body() body: { productId: string; quantity: number; customerId: string }) {
    const price = await this.pricingService.calculateBulkPrice(
      body.productId,
      body.quantity,
      body.customerId
    );
    return { price };
  }

  @Post('pricing/quote')
  async generateQuote(@Body() body: { items: { productId: string; quantity: number }[]; customerId: string }) {
    const quote = await this.pricingService.generateCustomQuote(body.items, body.customerId);
    return quote;
  }

  @Post('pricing/validate-minimum')
  async validateMinimumOrder(@Body() body: { total: number; customerId: string }) {
    const isValid = await this.pricingService.validateMinimumOrder({ total: body.total }, body.customerId);
    return { isValid };
  }

  // Quote endpoints
  @Post('quotes')
  async createQuote(@Body() createQuoteDto: { userId: string, items: { productId: string, quantity: number }[] }) {
    return this.quoteService.createQuote(createQuoteDto.userId, createQuoteDto.items);
  }

  @Get('quotes/:id')
  async getQuote(@Param('id') id: string) {
    return this.quoteService.getQuote(id);
  }

  @Get('users/:userId/quotes')
  async getUserQuotes(@Param('userId') userId: string) {
    return this.quoteService.getUserQuotes(userId);
  }

  @Put('quotes/:id/status')
  async updateQuoteStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.quoteService.updateQuoteStatus(id, body.status);
  }

  @Delete('quotes/:id')
  async deleteQuote(@Param('id') id: string) {
    return this.quoteService.deleteQuote(id);
  }

  @Post('quotes/:id/convert-to-order')
  async convertQuoteToOrder(@Param('id') id: string) {
    return this.quoteService.convertQuoteToOrder(id);
  }

  // Tier endpoints
  @Post('tiers')
  async createTier(@Body() createTierDto: CreateTierDto) {
    return this.tierService.createTier(createTierDto);
  }

  @Get('tiers')
  async getAllTiers() {
    return this.tierService.getAllTiers();
  }

  @Get('tiers/:id')
  async getTier(@Param('id') id: string) {
    return this.tierService.getTierById(id);
  }

  @Put('tiers/:id')
  async updateTier(@Param('id') id: string, @Body() updateTierDto: UpdateTierDto) {
    return this.tierService.updateTier(id, updateTierDto);
  }

  @Delete('tiers/:id')
  async deleteTier(@Param('id') id: string) {
    return this.tierService.deleteTier(id);
  }

  @Post('users/:userId/tier/:tierId')
  async assignUserToTier(@Param('userId') userId: string, @Param('tierId') tierId: string) {
    return this.tierService.assignUserToTier(userId, tierId);
  }

  @Delete('users/:userId/tier')
  async removeUserFromTier(@Param('userId') userId: string) {
    return this.tierService.removeUserFromTier(userId);
  }

  @Get('users/:userId/tier')
  async getUserTier(@Param('userId') userId: string) {
    return this.tierService.getUserTier(userId);
  }

  @Post('users/:userId/discount')
  async calculateUserDiscount(@Param('userId') userId: string, @Body() body: { orderTotal: number }) {
    const discount = await this.tierService.calculateUserDiscount(userId, body.orderTotal);
    return { discount };
  }

  @Post('tiers/qualify')
  async getQualifyingTier(@Body() body: { orderTotal: number }) {
    return this.tierService.getQualifyingTier(body.orderTotal);
  }

  @Post('users/:userId/tier-upgrade-suggestion')
  async suggestTierUpgrade(@Param('userId') userId: string, @Body() body: { currentOrderTotal: number }) {
    return this.tierService.suggestTierUpgrade(userId, body.currentOrderTotal);
  }
}
