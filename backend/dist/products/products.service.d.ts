import { CacheService } from "../cache/cache.service";
import { PrismaService } from "../prisma.service";
import { SearchService } from "../search/search.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsService {
    private readonly prisma;
    private readonly searchService;
    private readonly cacheService;
    constructor(prisma: PrismaService, searchService: SearchService, cacheService: CacheService);
    create(createProductDto: CreateProductDto): Promise<{
        category: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            price: number | null;
            sku: string;
            inventory: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        }[];
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            sortOrder: number;
            url: string;
            altText: string | null;
        }[];
    } & {
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    }>;
    findAll(params: {
        skip?: number;
        take?: number;
        categoryId?: string;
        isActive?: boolean;
    }): Promise<({
        category: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        _count: {
            variants: number;
        };
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            sortOrder: number;
            url: string;
            altText: string | null;
        }[];
    } & {
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            price: number | null;
            sku: string;
            inventory: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        }[];
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            sortOrder: number;
            url: string;
            altText: string | null;
        }[];
    } & {
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            price: number | null;
            sku: string;
            inventory: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        }[];
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            sortOrder: number;
            url: string;
            altText: string | null;
        }[];
    } & {
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        category: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        };
        variants: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            productId: string;
            price: number | null;
            sku: string;
            inventory: number;
            attributes: import("@prisma/client/runtime/library").JsonValue;
        }[];
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            sortOrder: number;
            url: string;
            altText: string | null;
        }[];
    } & {
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    }>;
    updateInventory(id: string, quantity: number): Promise<{
        isActive: boolean;
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: number;
        slug: string;
        compareAtPrice: number | null;
        sku: string;
        barcode: string | null;
        weight: number | null;
        inventory: number;
        categoryId: string;
    }>;
    private invalidateProductCaches;
}
