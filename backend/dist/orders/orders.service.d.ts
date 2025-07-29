import { OrderStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        shippingAddress: {
            postalCode: string;
            city: string;
            country: string;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.AddressType;
            company: string | null;
            address1: string;
            address2: string | null;
            state: string | null;
            phone: string | null;
            isDefault: boolean;
        };
        billingAddress: {
            postalCode: string;
            city: string;
            country: string;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.AddressType;
            company: string | null;
            address1: string;
            address2: string | null;
            state: string | null;
            phone: string | null;
            isDefault: boolean;
        } | null;
        items: ({
            product: {
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
            };
        } & {
            total: number;
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        total: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        id: string;
        orderNumber: string;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string | null;
        paymentIntentId: string | null;
        trackingNumber: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, status?: OrderStatus): Promise<{
        orders: ({
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            shippingAddress: {
                postalCode: string;
                city: string;
                country: string;
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                type: import(".prisma/client").$Enums.AddressType;
                company: string | null;
                address1: string;
                address2: string | null;
                state: string | null;
                phone: string | null;
                isDefault: boolean;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    images: {
                        id: string;
                        createdAt: Date;
                        productId: string;
                        sortOrder: number;
                        url: string;
                        altText: string | null;
                    }[];
                };
            } & {
                total: number;
                id: string;
                createdAt: Date;
                orderId: string;
                productId: string;
                quantity: number;
                price: number;
            })[];
        } & {
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            total: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            tax: number;
            shipping: number;
            discount: number;
            id: string;
            orderNumber: string;
            userId: string;
            shippingAddressId: string;
            billingAddressId: string | null;
            paymentIntentId: string | null;
            trackingNumber: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findByUser(userId: string, page?: number, limit?: number): Promise<{
        orders: ({
            shippingAddress: {
                postalCode: string;
                city: string;
                country: string;
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                type: import(".prisma/client").$Enums.AddressType;
                company: string | null;
                address1: string;
                address2: string | null;
                state: string | null;
                phone: string | null;
                isDefault: boolean;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    slug: string;
                    images: {
                        id: string;
                        createdAt: Date;
                        productId: string;
                        sortOrder: number;
                        url: string;
                        altText: string | null;
                    }[];
                };
            } & {
                total: number;
                id: string;
                createdAt: Date;
                orderId: string;
                productId: string;
                quantity: number;
                price: number;
            })[];
        } & {
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            total: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            tax: number;
            shipping: number;
            discount: number;
            id: string;
            orderNumber: string;
            userId: string;
            shippingAddressId: string;
            billingAddressId: string | null;
            paymentIntentId: string | null;
            trackingNumber: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string, userId?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        shippingAddress: {
            postalCode: string;
            city: string;
            country: string;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.AddressType;
            company: string | null;
            address1: string;
            address2: string | null;
            state: string | null;
            phone: string | null;
            isDefault: boolean;
        };
        billingAddress: {
            postalCode: string;
            city: string;
            country: string;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.AddressType;
            company: string | null;
            address1: string;
            address2: string | null;
            state: string | null;
            phone: string | null;
            isDefault: boolean;
        } | null;
        items: ({
            product: {
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
            };
        } & {
            total: number;
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        })[];
        transactions: {
            status: import(".prisma/client").$Enums.TransactionStatus;
            id: string;
            paymentIntentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            amount: number;
            type: import(".prisma/client").$Enums.TransactionType;
            currency: string;
            paymentMethod: string | null;
            refundId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        total: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        id: string;
        orderNumber: string;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string | null;
        paymentIntentId: string | null;
        trackingNumber: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
        shippingAddress: {
            postalCode: string;
            city: string;
            country: string;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.AddressType;
            company: string | null;
            address1: string;
            address2: string | null;
            state: string | null;
            phone: string | null;
            isDefault: boolean;
        };
        billingAddress: {
            postalCode: string;
            city: string;
            country: string;
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.AddressType;
            company: string | null;
            address1: string;
            address2: string | null;
            state: string | null;
            phone: string | null;
            isDefault: boolean;
        } | null;
        items: ({
            product: {
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
            };
        } & {
            total: number;
            id: string;
            createdAt: Date;
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        total: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        id: string;
        orderNumber: string;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string | null;
        paymentIntentId: string | null;
        trackingNumber: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancel(id: string, userId?: string): Promise<{
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        total: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        id: string;
        orderNumber: string;
        userId: string;
        shippingAddressId: string;
        billingAddressId: string | null;
        paymentIntentId: string | null;
        trackingNumber: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateOrderNumber;
}
