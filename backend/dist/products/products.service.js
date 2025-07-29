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
const cache_service_1 = require("../cache/cache.service");
const prisma_service_1 = require("../prisma.service");
const search_service_1 = require("../search/search.service");
let ProductsService = class ProductsService {
    constructor(prisma, searchService, cacheService) {
        this.prisma = prisma;
        this.searchService = searchService;
        this.cacheService = cacheService;
    }
    async create(createProductDto) {
        const { images, variants, ...productData } = createProductDto;
        const existingProduct = await this.prisma.product.findFirst({
            where: {
                OR: [{ slug: productData.slug }, { sku: productData.sku }],
            },
        });
        if (existingProduct) {
            throw new common_1.ConflictException(`Product with slug '${productData.slug}' or SKU '${productData.sku}' already exists`);
        }
        const createdProduct = await this.prisma.product.create({
            data: {
                ...productData,
                images: images
                    ? {
                        create: images,
                    }
                    : undefined,
                variants: variants
                    ? {
                        create: variants,
                    }
                    : undefined,
            },
            include: {
                images: true,
                variants: true,
                category: true,
            },
        });
        await this.searchService.indexProduct(createdProduct);
        await this.invalidateProductCaches();
        return createdProduct;
    }
    async findAll(params) {
        const { skip, take, categoryId, isActive } = params;
        const cacheKey = this.cacheService.generateKey("products", "list", skip || 0, take || 10, categoryId || "all", isActive !== undefined ? isActive.toString() : "all");
        return this.cacheService.getOrSet(cacheKey, async () => {
            return this.prisma.product.findMany({
                skip,
                take,
                where: {
                    categoryId: categoryId ? categoryId : undefined,
                    isActive: isActive !== undefined ? isActive : undefined,
                },
                include: {
                    images: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                    category: true,
                    _count: {
                        select: {
                            variants: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }, 180);
    }
    async findOne(id) {
        const cacheKey = this.cacheService.generateKey("product", id);
        return this.cacheService.getOrSet(cacheKey, async () => {
            const product = await this.prisma.product.findUnique({
                where: { id },
                include: {
                    images: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                    variants: true,
                    category: true,
                },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
            }
            return product;
        }, 300);
    }
    async findBySlug(slug) {
        const cacheKey = this.cacheService.generateKey("product", "slug", slug);
        return this.cacheService.getOrSet(cacheKey, async () => {
            const product = await this.prisma.product.findUnique({
                where: { slug },
                include: {
                    images: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                    variants: true,
                    category: true,
                },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with slug '${slug}' not found`);
            }
            return product;
        }, 300);
    }
    async update(id, updateProductDto) {
        const { images, variants, ...productData } = updateProductDto;
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        if (productData.slug || productData.sku) {
            const conflictingProduct = await this.prisma.product.findFirst({
                where: {
                    OR: [
                        productData.slug
                            ? {
                                slug: productData.slug,
                                id: { not: id },
                            }
                            : {},
                        productData.sku
                            ? {
                                sku: productData.sku,
                                id: { not: id },
                            }
                            : {},
                    ],
                },
            });
            if (conflictingProduct) {
                throw new common_1.ConflictException("Another product with the same slug or SKU already exists");
            }
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                ...(images && {
                    images: {
                        deleteMany: {},
                        create: images,
                    },
                }),
                ...(variants && {
                    variants: {
                        deleteMany: {},
                        create: variants,
                    },
                }),
            },
            include: {
                images: true,
                variants: true,
                category: true,
            },
        });
        await this.searchService.indexProduct(updatedProduct);
        await this.invalidateProductCaches(id);
        return updatedProduct;
    }
    async remove(id) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        const deletedProduct = await this.prisma.product.delete({
            where: { id },
        });
        await this.searchService.removeProductFromIndex(id);
        await this.invalidateProductCaches(id);
        return deletedProduct;
    }
    async updateInventory(id, quantity) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID '${id}' not found`);
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                inventory: quantity,
            },
        });
        await this.invalidateProductCaches(id);
        return updatedProduct;
    }
    async invalidateProductCaches(productId) {
        try {
            if (productId) {
                await this.cacheService.del(this.cacheService.generateKey("product", productId));
            }
            const cacheKeys = [
                "products:list:*",
            ];
            await this.cacheService.del("products:list:0:10:all:all");
            await this.cacheService.del("products:list:0:20:all:all");
            await this.cacheService.del("products:list:0:10:all:true");
        }
        catch (error) {
            console.error("Error invalidating product caches:", error);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        search_service_1.SearchService,
        cache_service_1.CacheService])
], ProductsService);
//# sourceMappingURL=products.service.js.map