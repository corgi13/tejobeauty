"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createOrderDto) {
        const { items, shippingAddressId, billingAddressId, notes, discount = 0, } = createOrderDto;
        const shippingAddress = await this.prisma.address.findFirst({
            where: { id: shippingAddressId, userId },
        });
        if (!shippingAddress) {
            throw new common_1.BadRequestException("Invalid shipping address");
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product || !product.isActive) {
                throw new common_1.BadRequestException(`Product ${item.productId} not found or inactive`);
            }
            if (product.inventory < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient inventory for product ${product.name}`);
            }
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                total: itemTotal,
            });
        }
        const tax = subtotal * 0.25;
        const shipping = subtotal > 100 ? 0 : 15;
        const total = subtotal + tax + shipping - discount;
        const orderNumber = await this.generateOrderNumber();
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId,
                status: client_1.OrderStatus.PENDING,
                subtotal,
                tax,
                shipping,
                discount,
                total,
                shippingAddressId,
                billingAddressId: billingAddressId || shippingAddressId,
                paymentStatus: client_1.PaymentStatus.PENDING,
                notes,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shippingAddress: true,
                billingAddress: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        for (const item of items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    inventory: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        return order;
    }
    async findAll(page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    images: {
                                        take: 1,
                                        orderBy: { sortOrder: "asc" },
                                    },
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    shippingAddress: true,
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    images: {
                                        take: 1,
                                        orderBy: { sortOrder: "asc" },
                                    },
                                },
                            },
                        },
                    },
                    shippingAddress: true,
                },
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId) {
        const where = userId ? { id, userId } : { id };
        const order = await this.prisma.order.findUnique({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                images: {
                                    take: 1,
                                    orderBy: { sortOrder: "asc" },
                                },
                            },
                        },
                    },
                },
                shippingAddress: true,
                billingAddress: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                transactions: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException("Order not found");
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException("Order not found");
        }
        return this.prisma.order.update({
            where: { id },
            data: updateOrderDto,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shippingAddress: true,
                billingAddress: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    async cancel(id, userId) {
        const where = userId ? { id, userId } : { id };
        const order = await this.prisma.order.findUnique({
            where,
            include: {
                items: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException("Order not found");
        }
        if (order.status !== client_1.OrderStatus.PENDING &&
            order.status !== client_1.OrderStatus.PROCESSING) {
            throw new common_1.BadRequestException("Order cannot be cancelled");
        }
        for (const item of order.items) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    inventory: {
                        increment: item.quantity,
                    },
                },
            });
        }
        return this.prisma.order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.CANCELLED,
            },
        });
    }
    async generateOrderNumber() {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        const prefix = `TN${year}${month}${day}`;
        const lastOrder = await this.prisma.order.findFirst({
            where: {
                orderNumber: {
                    startsWith: prefix,
                },
            },
            orderBy: {
                orderNumber: "desc",
            },
        });
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
            sequence = lastSequence + 1;
        }
        return `${prefix}${sequence.toString().padStart(4, "0")}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map