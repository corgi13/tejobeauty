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
exports.ProfessionalService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let ProfessionalService = class ProfessionalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createProfessionalDto) {
        const existingProfile = await this.prisma.professional.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            throw new common_1.BadRequestException("Professional profile already exists");
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
    async findAll(page = 1, limit = 10, isVerified) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException("Professional profile not found");
        }
        return professional;
    }
    async findByUserId(userId) {
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
                    where: { status: client_1.CommissionStatus.PENDING },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
            },
        });
        if (!professional) {
            throw new common_1.NotFoundException("Professional profile not found");
        }
        return professional;
    }
    async update(id, updateProfessionalDto) {
        const professional = await this.prisma.professional.findUnique({
            where: { id },
        });
        if (!professional) {
            throw new common_1.NotFoundException("Professional profile not found");
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
    async verify(id, isVerified) {
        const professional = await this.prisma.professional.findUnique({
            where: { id },
        });
        if (!professional) {
            throw new common_1.NotFoundException("Professional profile not found");
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
    async createBulkOrder(professionalId, createBulkOrderDto) {
        const professional = await this.prisma.professional.findUnique({
            where: { id: professionalId },
        });
        if (!professional || !professional.isVerified) {
            throw new common_1.BadRequestException("Professional profile not found or not verified");
        }
        const total = createBulkOrderDto.items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
        return this.prisma.bulkOrder.create({
            data: {
                professionalId,
                name: createBulkOrderDto.name,
                items: createBulkOrderDto.items,
                total,
                status: client_1.BulkOrderStatus.DRAFT,
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
    async findBulkOrders(professionalId, page = 1, limit = 10) {
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
    async updateBulkOrderStatus(id, status) {
        const bulkOrder = await this.prisma.bulkOrder.findUnique({
            where: { id },
        });
        if (!bulkOrder) {
            throw new common_1.NotFoundException("Bulk order not found");
        }
        return this.prisma.bulkOrder.update({
            where: { id },
            data: { status },
        });
    }
    async findCommissions(professionalId, page = 1, limit = 10) {
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
    async calculateCommission(professionalId, orderAmount) {
        const professional = await this.prisma.professional.findUnique({
            where: { id: professionalId },
        });
        if (!professional) {
            throw new common_1.NotFoundException("Professional profile not found");
        }
        const commissionAmount = orderAmount * (professional.commissionRate / 100);
        return this.prisma.commission.create({
            data: {
                professionalId,
                amount: commissionAmount,
                rate: professional.commissionRate,
                status: client_1.CommissionStatus.PENDING,
            },
        });
    }
    async getStats(professionalId) {
        const [totalOrders, totalCommissions, pendingCommissions] = await Promise.all([
            this.prisma.bulkOrder.count({
                where: {
                    professionalId,
                    status: client_1.BulkOrderStatus.COMPLETED,
                },
            }),
            this.prisma.commission.aggregate({
                where: {
                    professionalId,
                    status: client_1.CommissionStatus.PAID,
                },
                _sum: { amount: true },
            }),
            this.prisma.commission.aggregate({
                where: {
                    professionalId,
                    status: client_1.CommissionStatus.PENDING,
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
};
exports.ProfessionalService = ProfessionalService;
exports.ProfessionalService = ProfessionalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfessionalService);
//# sourceMappingURL=professional.service.js.map