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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const algoliasearch_1 = require("algoliasearch");
const prisma_service_1 = require("../prisma.service");
let SearchService = class SearchService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.isAlgoliaConfigured = false;
        const appId = this.configService.get("ALGOLIA_APP_ID");
        const apiKey = this.configService.get("ALGOLIA_API_KEY");
        if (!appId ||
            !apiKey ||
            appId === "test_app_id" ||
            apiKey === "test_api_key") {
            console.warn("Algolia credentials not found or using test values. Search functionality will be limited.");
            this.isAlgoliaConfigured = false;
            return;
        }
        try {
            this.client = (0, algoliasearch_1.algoliasearch)(appId, apiKey);
            this.isAlgoliaConfigured = true;
            console.log("Algolia client initialized successfully");
        }
        catch (error) {
            console.error("Failed to initialize Algolia client:", error);
            this.isAlgoliaConfigured = false;
        }
    }
    async onModuleInit() {
        await this.configureIndices();
    }
    async configureIndices() {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            await this.client.setSettings({
                indexName: "products",
                indexSettings: {
                    searchableAttributes: [
                        "name",
                        "description",
                        "category.name",
                        "variants.name",
                    ],
                    attributesForFaceting: [
                        "filterOnly(categoryId)",
                        "searchable(category.name)",
                        "price",
                        "isActive",
                    ],
                    customRanking: ["desc(popularity)", "desc(createdAt)"],
                },
            });
            await this.client.setSettings({
                indexName: "categories",
                indexSettings: {
                    searchableAttributes: ["name", "description"],
                    attributesForFaceting: ["parentId", "isActive"],
                    customRanking: ["asc(sortOrder)"],
                },
            });
            console.log("Algolia indices configured successfully");
        }
        catch (error) {
            console.error("Error configuring Algolia indices:", error);
        }
    }
    async indexProduct(product) {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            const indexedProduct = {
                objectID: product.id,
                ...product,
            };
            await this.client.saveObject({
                indexName: "products",
                body: indexedProduct,
            });
        }
        catch (error) {
            console.error("Error indexing product:", error);
        }
    }
    async indexProducts(products) {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            const indexedProducts = products.map((product) => ({
                objectID: product.id,
                ...product,
            }));
            await this.client.saveObjects({
                indexName: "products",
                objects: indexedProducts,
            });
        }
        catch (error) {
            console.error("Error indexing products:", error);
        }
    }
    async indexCategory(category) {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            const indexedCategory = {
                objectID: category.id,
                ...category,
            };
            await this.client.saveObject({
                indexName: "categories",
                body: indexedCategory,
            });
        }
        catch (error) {
            console.error("Error indexing category:", error);
        }
    }
    async indexCategories(categories) {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            const indexedCategories = categories.map((category) => ({
                objectID: category.id,
                ...category,
            }));
            await this.client.saveObjects({
                indexName: "categories",
                objects: indexedCategories,
            });
        }
        catch (error) {
            console.error("Error indexing categories:", error);
        }
    }
    async removeProductFromIndex(productId) {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            await this.client.deleteObject({
                indexName: "products",
                objectID: productId,
            });
        }
        catch (error) {
            console.error("Error removing product from index:", error);
        }
    }
    async removeCategoryFromIndex(categoryId) {
        if (!this.isAlgoliaConfigured)
            return;
        try {
            await this.client.deleteObject({
                indexName: "categories",
                objectID: categoryId,
            });
        }
        catch (error) {
            console.error("Error removing category from index:", error);
        }
    }
    async search(query, options = {}) {
        if (!this.isAlgoliaConfigured) {
            return this.searchInDatabase(query, options);
        }
        try {
            const { filters, page = 0, hitsPerPage = 20 } = options;
            const searchOptions = {
                page,
                hitsPerPage,
            };
            if (filters) {
                searchOptions.filters = filters;
            }
            const result = await this.client.search({
                requests: [
                    {
                        indexName: "products",
                        query,
                        params: searchOptions,
                    },
                ],
            });
            return result.results[0];
        }
        catch (error) {
            console.error("Error searching in Algolia:", error);
            return this.searchInDatabase(query, options);
        }
    }
    async searchCategories(query, options = {}) {
        if (!this.isAlgoliaConfigured) {
            return this.searchCategoriesInDatabase(query, options);
        }
        try {
            const { filters, page = 0, hitsPerPage = 20 } = options;
            const searchOptions = {
                page,
                hitsPerPage,
            };
            if (filters) {
                searchOptions.filters = filters;
            }
            const result = await this.client.search({
                requests: [
                    {
                        indexName: "categories",
                        query,
                        params: searchOptions,
                    },
                ],
            });
            return result.results[0];
        }
        catch (error) {
            console.error("Error searching categories in Algolia:", error);
            return this.searchCategoriesInDatabase(query, options);
        }
    }
    async searchInDatabase(query, options = {}) {
        const { categoryId, page = 0, hitsPerPage = 20 } = options;
        const where = {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
            isActive: true,
        };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const [hits, nbHits] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    images: {
                        take: 1,
                    },
                    category: true,
                },
                skip: page * hitsPerPage,
                take: hitsPerPage,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            hits,
            nbHits,
            page,
            nbPages: Math.ceil(nbHits / hitsPerPage),
            hitsPerPage,
        };
    }
    async searchCategoriesInDatabase(query, options = {}) {
        const { parentId, page = 0, hitsPerPage = 20 } = options;
        const where = {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
            isActive: true,
        };
        if (parentId !== undefined) {
            where.parentId = parentId;
        }
        const [hits, nbHits] = await Promise.all([
            this.prisma.category.findMany({
                where,
                include: {
                    parent: true,
                    _count: {
                        select: {
                            products: true,
                            children: true,
                        },
                    },
                },
                skip: page * hitsPerPage,
                take: hitsPerPage,
            }),
            this.prisma.category.count({ where }),
        ]);
        return {
            hits,
            nbHits,
            page,
            nbPages: Math.ceil(nbHits / hitsPerPage),
            hitsPerPage,
        };
    }
    async reindexAll() {
        try {
            const products = await this.prisma.product.findMany({
                include: {
                    images: true,
                    category: true,
                    variants: true,
                },
            });
            await this.indexProducts(products);
            const categories = await this.prisma.category.findMany({
                include: {
                    parent: true,
                },
            });
            await this.indexCategories(categories);
            return { message: "Reindexing completed successfully" };
        }
        catch (error) {
            console.error("Error reindexing data:", error);
            throw new Error("Failed to reindex data");
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map