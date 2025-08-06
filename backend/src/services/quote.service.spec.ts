import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockPrismaService } from '../test/setup';

describe('QuoteService', () => {
  let service: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
  });

  it('should create quote successfully', async () => {
    const mockQuote = { id: '1', status: 'PENDING' };
    mockPrismaService.quote.create.mockResolvedValue(mockQuote);

    const quoteData = {
      userId: '1',
      businessId: '1',
      items: [{ productId: '1', quantity: 10 }],
    };

    const result = await service.createQuote(quoteData);
    expect(result.id).toBe('1');
  });

  it('should approve quote successfully', async () => {
    const mockQuote = { id: '1', status: 'APPROVED' };
    mockPrismaService.quote.update.mockResolvedValue(mockQuote);

    const result = await service.approveQuote('1');
    expect(result.status).toBe('APPROVED');
  });
});