import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma.service";
export declare class SearchService implements OnModuleInit {
    private readonly configService;
    private readonly prisma;
    private client;
    private isAlgoliaConfigured;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private configureIndices;
    indexProduct(product: any): Promise<void>;
    indexProducts(products: any[]): Promise<void>;
    indexCategory(category: any): Promise<void>;
    indexCategories(categories: any[]): Promise<void>;
    removeProductFromIndex(productId: string): Promise<void>;
    removeCategoryFromIndex(categoryId: string): Promise<void>;
    search(query: string, options?: any): Promise<any>;
    searchCategories(query: string, options?: any): Promise<any>;
    private searchInDatabase;
    private searchCategoriesInDatabase;
    reindexAll(): Promise<{
        message: string;
    }>;
}
