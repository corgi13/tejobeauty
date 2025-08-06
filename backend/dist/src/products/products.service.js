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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return [
            {
                id: '1',
                name: 'Professional Nail Polish Set',
                sku: 'TNP001',
                price: 45.99,
                category: 'Polish',
                description: 'High-quality nail polish set with 12 vibrant colors',
                inStock: true,
                minOrderQuantity: 5,
            },
            {
                id: '2',
                name: 'UV Gel Base Coat',
                sku: 'TNP002',
                price: 28.50,
                category: 'Gel',
                description: 'Professional UV gel base coat for long-lasting manicures',
                inStock: true,
                minOrderQuantity: 10,
            },
            {
                id: '3',
                name: 'Cuticle Oil Premium',
                sku: 'TNP003',
                price: 15.99,
                category: 'Care',
                description: 'Nourishing cuticle oil with vitamin E',
                inStock: true,
                minOrderQuantity: 12,
            },
        ];
    }
    async findOne(id) {
        const products = await this.findAll();
        return products.find(p => p.id === id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map