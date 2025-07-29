export declare class BulkOrderItemDto {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}
export declare class CreateBulkOrderDto {
    name: string;
    items: BulkOrderItemDto[];
}
