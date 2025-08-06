import { PrismaService } from '../prisma.service';
import { SearchService } from '../search/search.service';
export declare class ProductCatalogService {
    private prisma;
    private searchService;
    constructor(prisma: PrismaService, searchService: SearchService);
    createProductWithSpecs(productData: any, specifications: any): Promise<{
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
    }>;
    updateProductAvailability(productId: string, quantity: number, leadTime: number): Promise<{
        message: string;
    }>;
    addProductCertification(productId: string, certificationData: any): Promise<{
        message: string;
    }>;
    linkProductToSupplier(productId: string, supplierId: string): Promise<{
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
    }>;
    manageProductCategories(productId: string, categoryIds: string[]): Promise<{
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
    }>;
}
