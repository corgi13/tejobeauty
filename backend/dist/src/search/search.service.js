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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const elasticsearch_1 = require("@elastic/elasticsearch");
const prisma_service_1 = require("../prisma.service");
let SearchService = class SearchService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.client = new elasticsearch_1.Client({
            node: this.configService.get('ELASTICSEARCH_NODE'),
        });
    }
    async onModuleInit() {
        await this.createIndices();
    }
    async createIndices() {
        const indices = ['products', 'categories'];
        for (const index of indices) {
            const indexExists = await this.client.indices.exists({ index });
            if (!indexExists) {
                await this.client.indices.create({ index });
            }
        }
    }
    async indexProduct(product) {
        await this.client.index({
            index: 'products',
            id: product.id,
            document: product,
        });
    }
    async indexProducts(products) {
        const operations = products.flatMap((doc) => [{ index: { _index: 'products', _id: doc.id } }, doc]);
        await this.client.bulk({ refresh: true, operations });
    }
    async indexCategory(category) {
        await this.client.index({
            index: 'categories',
            id: category.id,
            document: category,
        });
    }
    async indexCategories(categories) {
        const operations = categories.flatMap((doc) => [{ index: { _index: 'categories', _id: doc.id } }, doc]);
        await this.client.bulk({ refresh: true, operations });
    }
    async removeProductFromIndex(productId) {
        await this.client.delete({ index: 'products', id: productId });
    }
    async removeCategoryFromIndex(categoryId) {
        await this.client.delete({ index: 'categories', id: categoryId });
    }
    async search(query, options = {}) {
        const { categoryId, page = 0, hitsPerPage = 20 } = options;
        const from = page * hitsPerPage;
        const searchConfig = {
            index: 'products',
            from,
            size: hitsPerPage,
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query,
                                fields: ['name', 'description'],
                            },
                        },
                    ],
                    filter: [],
                },
            },
        };
        if (categoryId) {
            searchConfig.query.bool.filter.push({
                term: {
                    categoryId,
                },
            });
        }
        const response = await this.client.search(searchConfig);
        const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value ?? 0;
        return {
            hits: response.hits.hits.map((hit) => hit._source),
            nbHits: total,
            page,
            nbPages: Math.ceil(total / hitsPerPage),
            hitsPerPage,
        };
    }
    async searchCategories(query, options = {}) {
        const { parentId, page = 0, hitsPerPage = 20 } = options;
        const from = page * hitsPerPage;
        const searchConfig = {
            index: 'categories',
            from,
            size: hitsPerPage,
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query,
                                fields: ['name', 'description'],
                            },
                        },
                    ],
                    filter: [],
                },
            },
        };
        if (parentId && searchConfig.query && searchConfig.query.bool) {
            searchConfig.query.bool.filter.push({
                term: {
                    parentId,
                },
            });
        }
        const response = await this.client.search(searchConfig);
        const total = typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value ?? 0;
        return {
            hits: response.hits.hits.map((hit) => hit._source),
            nbHits: total,
            page,
            nbPages: Math.ceil(total / hitsPerPage),
            hitsPerPage,
        };
    }
    async reindexAll() {
        const products = await this.prisma.product.findMany();
        await this.indexProducts(products);
        const categories = await this.prisma.category.findMany();
        await this.indexCategories(categories);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map