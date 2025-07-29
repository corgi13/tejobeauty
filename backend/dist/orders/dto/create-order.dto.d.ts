export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    shippingAddressId: string;
    billingAddressId?: string;
    items: CreateOrderItemDto[];
    notes?: string;
    discount?: number;
}
