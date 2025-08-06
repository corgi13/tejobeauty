import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockPrismaService } from '../test/setup';

describe('PricingService', () => {
  let service: PricingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should calculate bulk pricing correctly', async () => {
    const mockProduct = { id: '1', basePrice: 100, bulkTiers: [] };
    mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

    const result = await service.calculateBulkPrice('1', 10);
    expect(result.total).toBe(1000);
  });

  it('should apply tier discounts', async () => {
    const mockProduct = { 
      id: '1', 
      basePrice: 100, 
      bulkTiers: [{ minQuantity: 10, discount: 0.1 }] 
    };
    mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

    const result = await service.calculateBulkPrice('1', 10);
    expect(result.total).toBe(900);
  });
});