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
exports.CacheWarmingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_service_1 = require("./cache.service");
const prisma_service_1 = require("../prisma.service");
let CacheWarmingService = class CacheWarmingService {
    constructor(cacheService, prisma, configService) {
        this.cacheService = cacheService;
        this.prisma = prisma;
        this.configService = configService;
    }
    async onModuleInit() {
        const shouldWarmCache = this.configService.get("CACHE_WARM_ON_START", false);
        if (shouldWarmCache) {
            await this.warmCache();
        }
    }
    async warmCache() {
        console.log("Starting cache warm-up...");
        try {
            await Promise.all([
                this.warmProductCache(),
                this.warmCategoryCache(),
                this.warmSettingsCache(),
            ]);
            console.log("Cache warm-up completed successfully");
        }
        catch (error) {
            console.error("Error during cache warm-up:", error);
        }
    }
    async warmProductCache() {
        try {
            const popularProducts = await this.prisma.product.findMany({
                take: 20,
                where: { isActive: true },
                include: {
                    images: {
                        orderBy: { sortOrder: "asc" },
                    },
                    category: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            const cacheKey = this.cacheService.generateKey("products", "list", 0, 20, "all", "true");
            await this.cacheService.set(cacheKey, popularProducts, 300);
            for (const product of popularProducts) {
                const productCacheKey = this.cacheService.generateKey("product", product.id);
                await this.cacheService.set(productCacheKey, product, 300);
                const slugCacheKey = this.cacheService.generateKey("product", "slug", product.slug);
                await this.cacheService.set(slugCacheKey, product, 300);
            }
            console.log(`Warmed cache for ${popularProducts.length} products`);
        }
        catch (error) {
            console.error("Error warming product cache:", error);
        }
    }
    async warmCategoryCache() {
        try {
            const categories = await this.prisma.category.findMany({
                where: { isActive: true },
                include: {
                    children: true,
                    parent: true,
                },
                orderBy: { sortOrder: "asc" },
            });
            const cacheKey = this.cacheService.generateKey("categories", "list", "all");
            await this.cacheService.set(cacheKey, categories, 600);
            const categoryTree = this.buildCategoryTree(categories);
            const treeCacheKey = this.cacheService.generateKey("categories", "tree");
            await this.cacheService.set(treeCacheKey, categoryTree, 600);
            console.log(`Warmed cache for ${categories.length} categories`);
        }
        catch (error) {
            console.error("Error warming category cache:", error);
        }
    }
    async warmSettingsCache() {
        try {
            const commonSettings = {
                siteName: "Tejo Nails",
                defaultCurrency: "EUR",
                defaultLanguage: "en",
            };
            const cacheKey = this.cacheService.generateKey("settings", "common");
            await this.cacheService.set(cacheKey, commonSettings, 1800);
            console.log("Warmed cache for common settings");
        }
        catch (error) {
            console.error("Error warming settings cache:", error);
        }
    }
    buildCategoryTree(categories) {
        const categoryMap = new Map();
        const rootCategories = [];
        categories.forEach((category) => {
            categoryMap.set(category.id, { ...category, children: [] });
        });
        categories.forEach((category) => {
            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(categoryMap.get(category.id));
                }
            }
            else {
                rootCategories.push(categoryMap.get(category.id));
            }
        });
        return rootCategories;
    }
    async clearAllCache() {
        await this.cacheService.reset();
        console.log("All cache cleared");
    }
    async refreshCache(type) {
        switch (type) {
            case "products":
                await this.warmProductCache();
                break;
            case "categories":
                await this.warmCategoryCache();
                break;
            case "settings":
                await this.warmSettingsCache();
                break;
            case "all":
                await this.warmCache();
                break;
        }
    }
};
exports.CacheWarmingService = CacheWarmingService;
exports.CacheWarmingService = CacheWarmingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        prisma_service_1.PrismaService,
        config_1.ConfigService])
], CacheWarmingService);
//# sourceMappingURL=cache-warming.service.js.map