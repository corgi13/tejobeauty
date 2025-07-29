import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { OrderStatus, PaymentStatus } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const {
      items,
      shippingAddressId,
      billingAddressId,
      notes,
      discount = 0,
    } = createOrderDto;

    // Validate address belongs to user
    const shippingAddress = await this.prisma.address.findFirst({
      where: { id: shippingAddressId, userId },
    });

    if (!shippingAddress) {
      throw new BadRequestException("Invalid shipping address");
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new BadRequestException(
          `Product ${item.productId} not found or inactive`,
        );
      }

      if (product.inventory < item.quantity) {
        throw new BadRequestException(
          `Insufficient inventory for product ${product.name}`,
        );
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

    const tax = subtotal * 0.25; // 25% VAT for Croatia
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over 100 EUR
    const total = subtotal + tax + shipping - discount;

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: OrderStatus.PENDING,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        shippingAddressId,
        billingAddressId: billingAddressId || shippingAddressId,
        paymentStatus: PaymentStatus.PENDING,
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

    // Update product inventory
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

  async findAll(page = 1, limit = 10, status?: OrderStatus) {
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

  async findByUser(userId: string, page = 1, limit = 10) {
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

  async findOne(id: string, userId?: string) {
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
      throw new NotFoundException("Order not found");
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
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

  async cancel(id: string, userId?: string) {
    const where = userId ? { id, userId } : { id };

    const order = await this.prisma.order.findUnique({
      where,
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PROCESSING
    ) {
      throw new BadRequestException("Order cannot be cancelled");
    }

    // Restore inventory
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
        status: OrderStatus.CANCELLED,
      },
    });
  }

  private async generateOrderNumber(): Promise<string> {
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
}
