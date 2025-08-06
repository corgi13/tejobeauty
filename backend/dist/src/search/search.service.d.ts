import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
export declare class SearchService implements OnModuleInit {
    private readonly configService;
    private readonly prisma;
    private client;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    createIndices(): Promise<void>;
    indexProduct(product: any): Promise<void>;
    indexProducts(products: any[]): Promise<void>;
    indexCategory(category: any): Promise<void>;
    indexCategories(categories: any[]): Promise<void>;
    removeProductFromIndex(productId: string): Promise<void>;
    removeCategoryFromIndex(categoryId: string): Promise<void>;
    search(query: string, options?: any): Promise<{
        hits: any;
        nbHits: any;
        page: any;
        nbPages: number;
        hitsPerPage: any;
    }>;
    searchCategories(query: string, options?: any): Promise<{
        hits: any;
        nbHits: any;
        page: any;
        nbPages: number;
        hitsPerPage: any;
    }>;
    reindexAll(): Promise<void>;
}
