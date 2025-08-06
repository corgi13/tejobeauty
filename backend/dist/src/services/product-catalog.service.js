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
exports.ProductCatalogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const search_service_1 = require("../search/search.service");
let ProductCatalogService = class ProductCatalogService {
    constructor(prisma, searchService) {
        this.prisma = prisma;
        this.searchService = searchService;
    }
    async createProductWithSpecs(productData, specifications) {
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                specifications: {
                    create: specifications,
                },
            },
        });
        await this.searchService.indexProduct(product);
        return product;
    }
    async updateProductAvailability(productId, quantity, leadTime) {
        console.log(`Updating availability for product ${productId}: quantity=${quantity}, leadTime=${leadTime}`);
        return { message: 'Product availability updated successfully' };
    }
    async addProductCertification(productId, certificationData) {
        console.log(`Adding certification to product ${productId}:`, certificationData);
        return { message: 'Product certification added successfully' };
    }
    async linkProductToSupplier(productId, supplierId) {
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: { supplierId },
        });
        await this.searchService.indexProduct(product);
        return product;
    }
    async manageProductCategories(productId, categoryIds) {
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: { categoryId: categoryIds[0] },
        });
        await this.searchService.indexProduct(product);
        return product;
    }
};
exports.ProductCatalogService = ProductCatalogService;
exports.ProductCatalogService = ProductCatalogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        search_service_1.SearchService])
], ProductCatalogService);
//# sourceMappingURL=product-catalog.service.js.map