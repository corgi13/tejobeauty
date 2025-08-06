import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PricingService } from '../services/pricing.service';
import { QuoteService } from '../services/quote.service';
import { SanitizationService } from '../utils/sanitization.service';
import { CacheService } from '../cache/cache.service';

@Module({
  providers: [
    PrismaService,
    PricingService,
    QuoteService,
    SanitizationService,
    CacheService,
  ],
  exports: [PricingService, QuoteService],
})
export class B2BModule {}