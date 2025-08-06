import { PrismaService } from '../prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        sku: string;
        price: number;
        category: string;
        description: string;
        inStock: boolean;
        minOrderQuantity: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        sku: string;
        price: number;
        category: string;
        description: string;
        inStock: boolean;
        minOrderQuantity: number;
    }>;
}
