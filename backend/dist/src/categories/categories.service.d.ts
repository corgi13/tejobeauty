import { PrismaService } from "../prisma.service";
import { SearchService } from "../search/search.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoriesService {
    private readonly prisma;
    private readonly searchService;
    constructor(prisma: PrismaService, searchService: SearchService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        parent: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    findAll(params: {
        includeInactive?: boolean;
        parentId?: string | null;
    }): Promise<({
        _count: {
            products: number;
            children: number;
        };
        parent: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            products: number;
        };
        products: ({
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                url: string;
                altText: string | null;
                sortOrder: number;
            }[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            slug: string;
            price: number;
            compareAtPrice: number | null;
            sku: string;
            barcode: string | null;
            weight: number | null;
            inventory: number;
            categoryId: string;
            supplierId: string | null;
        })[];
        parent: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        children: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        _count: {
            products: number;
        };
        products: ({
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                url: string;
                altText: string | null;
                sortOrder: number;
            }[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string;
            slug: string;
            price: number;
            compareAtPrice: number | null;
            sku: string;
            barcode: string | null;
            weight: number | null;
            inventory: number;
            categoryId: string;
            supplierId: string | null;
        })[];
        parent: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        children: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        parent: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        children: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    getCategoryTree(): Promise<{
        children: any[];
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }[]>;
    private getChildCategories;
}
