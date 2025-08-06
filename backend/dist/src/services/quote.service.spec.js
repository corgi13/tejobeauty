"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const quote_service_1 = require("./quote.service");
const prisma_service_1 = require("../prisma/prisma.service");
const setup_1 = require("../test/setup");
describe('QuoteService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                quote_service_1.QuoteService,
                { provide: prisma_service_1.PrismaService, useValue: setup_1.mockPrismaService },
            ],
        }).compile();
        service = module.get(quote_service_1.QuoteService);
    });
    it('should create quote successfully', async () => {
        const mockQuote = { id: '1', status: 'PENDING' };
        setup_1.mockPrismaService.quote.create.mockResolvedValue(mockQuote);
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
        setup_1.mockPrismaService.quote.update.mockResolvedValue(mockQuote);
        const result = await service.approveQuote('1');
        expect(result.status).toBe('APPROVED');
    });
});
//# sourceMappingURL=quote.service.spec.js.map