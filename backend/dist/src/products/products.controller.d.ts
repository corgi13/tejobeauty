import { ProductsService } from './products.service';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
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
