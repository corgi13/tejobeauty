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
exports.TierService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TierService = class TierService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTier(createTierDto) {
        const tier = await this.prisma.customerTier.create({
            data: createTierDto,
        });
        return tier;
    }
    async getAllTiers() {
        const tiers = await this.prisma.customerTier.findMany({
            orderBy: { minSpend: 'asc' },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return tiers;
    }
    async getTierById(id) {
        return this.prisma.customerTier.findUnique({
            where: { id },
            include: {
                users: {
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
    async updateTier(id, updateTierDto) {
        const tier = await this.prisma.customerTier.update({
            where: { id },
            data: updateTierDto,
        });
        return tier;
    }
    async deleteTier(id) {
        await this.prisma.user.updateMany({
            where: { customerTierId: id },
            data: { customerTierId: null },
        });
        const tier = await this.prisma.customerTier.delete({
            where: { id },
        });
        return tier;
    }
    async assignUserToTier(userId, customerTierId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { customerTierId },
            include: {
                customerTier: true,
            },
        });
        return user;
    }
    async removeUserFromTier(userId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { customerTierId: null },
        });
        return user;
    }
    async getUserTier(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                customerTier: true,
            },
        });
        return user?.customerTier || null;
    }
    async calculateUserDiscount(userId, orderTotal) {
        const tier = await this.getUserTier(userId);
        if (!tier) {
            return 0;
        }
        if (orderTotal >= tier.minSpend) {
            return (orderTotal * tier.discountPercentage) / 100;
        }
        return 0;
    }
    async getQualifyingTier(orderTotal) {
        const tiers = await this.getAllTiers();
        const qualifyingTiers = tiers.filter((tier) => orderTotal >= tier.minSpend);
        if (qualifyingTiers.length === 0) {
            return null;
        }
        return qualifyingTiers.reduce((highest, current) => current.discountPercentage > highest.discountPercentage ? current : highest);
    }
    async suggestTierUpgrade(userId, currentOrderTotal) {
        const currentTier = await this.getUserTier(userId);
        const allTiers = await this.getAllTiers();
        const higherTiers = allTiers.filter((tier) => !currentTier || tier.minSpend > currentTier.minSpend);
        if (higherTiers.length === 0) {
            return null;
        }
        const nextTier = higherTiers.reduce((lowest, current) => current.minSpend < lowest.minSpend ? current : lowest);
        const amountNeeded = nextTier.minSpend - currentOrderTotal;
        return {
            nextTier,
            amountNeeded: amountNeeded > 0 ? amountNeeded : 0,
            potentialDiscount: nextTier.discountPercentage,
        };
    }
};
exports.TierService = TierService;
exports.TierService = TierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TierService);
//# sourceMappingURL=tier.service.js.map