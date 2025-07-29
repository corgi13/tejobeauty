import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        parent: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        } | null;
    } & {
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    findAll(includeInactive?: boolean, parentId?: string): Promise<({
        _count: {
            children: number;
            products: number;
        };
        parent: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        } | null;
    } & {
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    })[]>;
    getCategoryTree(): Promise<{
        children: any[];
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        _count: {
            products: number;
        };
        parent: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        } | null;
        children: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        }[];
        products: ({
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
        })[];
    } & {
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    findBySlug(slug: string): Promise<{
        _count: {
            products: number;
        };
        parent: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        } | null;
        children: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        }[];
        products: ({
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
        })[];
    } & {
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        parent: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        } | null;
        children: {
            isActive: boolean;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            parentId: string | null;
        }[];
    } & {
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
    remove(id: string): Promise<{
        isActive: boolean;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        sortOrder: number;
        parentId: string | null;
    }>;
}
