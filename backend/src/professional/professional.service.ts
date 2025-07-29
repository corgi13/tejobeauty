import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { BulkOrderStatus, CommissionStatus } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { CreateBulkOrderDto } from "./dto/create-bulk-order.dto";
import { CreateProfessionalDto } from "./dto/create-professional.dto";
import { UpdateProfessionalDto } from "./dto/update-professional.dto";

@Injectable()
export class ProfessionalService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProfessionalDto: CreateProfessionalDto) {
    // Check if user already has a professional profile
    const existingProfile = await this.prisma.professional.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException("Professional profile already exists");
    }

    return this.prisma.professional.create({
      data: {
        userId,
        ...createProfessionalDto,
      },
      include: {
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

  async findAll(page = 1, limit = 10, isVerified?: boolean) {
    const skip = (page - 1) * limit;
    const where = isVerified !== undefined ? { isVerified } : {};

    const [professionals, total] = await Promise.all([
      this.prisma.professional.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              bulkOrders: true,
              commissions: true,
            },
          },
        },
      }),
      this.prisma.professional.count({ where }),
    ]);

    return {
      professionals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        bulkOrders: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        commissions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!professional) {
      throw new NotFoundException("Professional profile not found");
    }

    return professional;
  }

  async findByUserId(userId: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        bulkOrders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        commissions: {
          where: { status: CommissionStatus.PENDING },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!professional) {
      throw new NotFoundException("Professional profile not found");
    }

    return professional;
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
    });

    if (!professional) {
      throw new NotFoundException("Professional profile not found");
    }

    return this.prisma.professional.update({
      where: { id },
      data: updateProfessionalDto,
      include: {
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

  async verify(id: string, isVerified: boolean) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
    });

    if (!professional) {
      throw new NotFoundException("Professional profile not found");
    }

    return this.prisma.professional.update({
      where: { id },
      data: { isVerified },
      include: {
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

  // Bulk Orders
  async createBulkOrder(
    professionalId: string,
    createBulkOrderDto: CreateBulkOrderDto,
  ) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId },
    });

    if (!professional || !professional.isVerified) {
      throw new BadRequestException(
        "Professional profile not found or not verified",
      );
    }

    // Calculate total from items
    const total = createBulkOrderDto.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return this.prisma.bulkOrder.create({
      data: {
        professionalId,
        name: createBulkOrderDto.name,
        items: createBulkOrderDto.items as any,
        total,
        status: BulkOrderStatus.DRAFT,
      },
      include: {
        professional: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  async findBulkOrders(professionalId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [bulkOrders, total] = await Promise.all([
      this.prisma.bulkOrder.findMany({
        where: { professionalId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          professional: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.bulkOrder.count({ where: { professionalId } }),
    ]);

    return {
      bulkOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateBulkOrderStatus(id: string, status: BulkOrderStatus) {
    const bulkOrder = await this.prisma.bulkOrder.findUnique({
      where: { id },
    });

    if (!bulkOrder) {
      throw new NotFoundException("Bulk order not found");
    }

    return this.prisma.bulkOrder.update({
      where: { id },
      data: { status },
    });
  }

  // Commissions
  async findCommissions(professionalId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [commissions, total] = await Promise.all([
      this.prisma.commission.findMany({
        where: { professionalId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.commission.count({ where: { professionalId } }),
    ]);

    return {
      commissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async calculateCommission(professionalId: string, orderAmount: number) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId },
    });

    if (!professional) {
      throw new NotFoundException("Professional profile not found");
    }

    const commissionAmount = orderAmount * (professional.commissionRate / 100);

    return this.prisma.commission.create({
      data: {
        professionalId,
        amount: commissionAmount,
        rate: professional.commissionRate,
        status: CommissionStatus.PENDING,
      },
    });
  }

  async getStats(professionalId: string) {
    const [totalOrders, totalCommissions, pendingCommissions] =
      await Promise.all([
        this.prisma.bulkOrder.count({
          where: {
            professionalId,
            status: BulkOrderStatus.COMPLETED,
          },
        }),
        this.prisma.commission.aggregate({
          where: {
            professionalId,
            status: CommissionStatus.PAID,
          },
          _sum: { amount: true },
        }),
        this.prisma.commission.aggregate({
          where: {
            professionalId,
            status: CommissionStatus.PENDING,
          },
          _sum: { amount: true },
        }),
      ]);

    return {
      totalOrders,
      totalCommissions: totalCommissions._sum.amount || 0,
      pendingCommissions: pendingCommissions._sum.amount || 0,
    };
  }
}
