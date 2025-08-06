"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const pricing_service_1 = require("./pricing.service");
const prisma_service_1 = require("../prisma/prisma.service");
const setup_1 = require("../test/setup");
describe('PricingService', () => {
    let service;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                pricing_service_1.PricingService,
                { provide: prisma_service_1.PrismaService, useValue: setup_1.mockPrismaService },
            ],
        }).compile();
        service = module.get(pricing_service_1.PricingService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it('should calculate bulk pricing correctly', async () => {
        const mockProduct = { id: '1', basePrice: 100, bulkTiers: [] };
        setup_1.mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
        const result = await service.calculateBulkPrice('1', 10);
        expect(result.total).toBe(1000);
    });
    it('should apply tier discounts', async () => {
        const mockProduct = {
            id: '1',
            basePrice: 100,
            bulkTiers: [{ minQuantity: 10, discount: 0.1 }]
        };
        setup_1.mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
        const result = await service.calculateBulkPrice('1', 10);
        expect(result.total).toBe(900);
    });
});
//# sourceMappingURL=pricing.service.spec.js.map