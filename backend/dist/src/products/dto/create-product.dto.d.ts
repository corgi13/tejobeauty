export declare class CreateProductImageDto {
    url: string;
    altText?: string;
    sortOrder?: number;
}
export declare class CreateProductVariantDto {
    name: string;
    sku: string;
    price?: number;
    inventory: number;
    attributes: Record<string, any>;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    barcode?: string;
    weight?: number;
    inventory: number;
    isActive?: boolean;
    categoryId: string;
    images?: CreateProductImageDto[];
    variants?: CreateProductVariantDto[];
}
