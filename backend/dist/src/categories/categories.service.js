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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const search_service_1 = require("../search/search.service");
let CategoriesService = class CategoriesService {
    constructor(prisma, searchService) {
        this.prisma = prisma;
        this.searchService = searchService;
    }
    async create(createCategoryDto) {
        const { name, slug, parentId } = createCategoryDto;
        const existingCategory = await this.prisma.category.findUnique({
            where: { slug },
        });
        if (existingCategory) {
            throw new common_1.ConflictException(`Category with slug '${slug}' already exists`);
        }
        if (parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException(`Parent category with ID '${parentId}' not found`);
            }
        }
        const createdCategory = await this.prisma.category.create({
            data: createCategoryDto,
            include: {
                parent: true,
            },
        });
        await this.searchService.indexCategory(createdCategory);
        return createdCategory;
    }
    async findAll(params) {
        const { includeInactive = false, parentId } = params;
        return this.prisma.category.findMany({
            where: {
                isActive: includeInactive ? undefined : true,
                parentId: parentId === null ? null : parentId,
            },
            include: {
                parent: true,
                _count: {
                    select: {
                        products: true,
                        children: true,
                    },
                },
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                products: {
                    where: {
                        isActive: true,
                    },
                    take: 10,
                    include: {
                        images: {
                            take: 1,
                        },
                    },
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                products: {
                    where: {
                        isActive: true,
                    },
                    take: 10,
                    include: {
                        images: {
                            take: 1,
                        },
                    },
                },
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug '${slug}' not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const { slug, parentId } = updateCategoryDto;
        const existingCategory = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found`);
        }
        if (slug && slug !== existingCategory.slug) {
            const slugExists = await this.prisma.category.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });
            if (slugExists) {
                throw new common_1.ConflictException(`Category with slug '${slug}' already exists`);
            }
        }
        if (parentId) {
            if (parentId === id) {
                throw new common_1.ConflictException("Category cannot be its own parent");
            }
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException(`Parent category with ID '${parentId}' not found`);
            }
            let currentParent = parentCategory;
            while (currentParent.parentId) {
                if (currentParent.parentId === id) {
                    throw new common_1.ConflictException("Circular reference detected in category hierarchy");
                }
                const parent = await this.prisma.category.findUnique({
                    where: { id: currentParent.parentId },
                });
                if (!parent)
                    break;
                currentParent = parent;
            }
        }
        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                parent: true,
                children: true,
            },
        });
        await this.searchService.indexCategory(updatedCategory);
        return updatedCategory;
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        children: true,
                        products: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found`);
        }
        if (category._count.children > 0) {
            throw new common_1.ConflictException("Cannot delete category with subcategories");
        }
        if (category._count.products > 0) {
            throw new common_1.ConflictException("Cannot delete category with products");
        }
        const deletedCategory = await this.prisma.category.delete({
            where: { id },
        });
        await this.searchService.removeCategoryFromIndex(id);
        return deletedCategory;
    }
    async getCategoryTree() {
        const rootCategories = await this.prisma.category.findMany({
            where: {
                parentId: null,
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        const categoryTree = await Promise.all(rootCategories.map(async (rootCategory) => {
            const children = await this.getChildCategories(rootCategory.id);
            return {
                ...rootCategory,
                children,
            };
        }));
        return categoryTree;
    }
    async getChildCategories(parentId) {
        const children = await this.prisma.category.findMany({
            where: {
                parentId,
                isActive: true,
            },
            orderBy: {
                sortOrder: "asc",
            },
        });
        if (children.length === 0) {
            return [];
        }
        return Promise.all(children.map(async (child) => {
            const grandchildren = await this.getChildCategories(child.id);
            return {
                ...child,
                children: grandchildren,
            };
        }));
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        search_service_1.SearchService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map