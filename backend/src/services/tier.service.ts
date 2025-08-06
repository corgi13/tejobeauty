import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateTierDto {
  name: string;
  minSpend: number;
  discountPercentage: number;
}

export interface UpdateTierDto {
  name?: string;
  minSpend?: number;
  discountPercentage?: number;
}

@Injectable()
export class TierService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createTier(createTierDto: CreateTierDto) {
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

  async getTierById(id: string) {
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

  async updateTier(id: string, updateTierDto: UpdateTierDto) {
    const tier = await this.prisma.customerTier.update({
      where: { id },
      data: updateTierDto,
    });
    
    return tier;
  }

  async deleteTier(id: string) {
    // First, remove tier from all users
    await this.prisma.user.updateMany({
      where: { customerTierId: id },
      data: { customerTierId: null },
    });

    const tier = await this.prisma.customerTier.delete({
      where: { id },
    });
    
    return tier;
  }

  async assignUserToTier(userId: string, customerTierId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { customerTierId },
      include: {
        customerTier: true,
      },
    });
    
    return user;
  }

  async removeUserFromTier(userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { customerTierId: null },
    });
    
    return user;
  }

  async getUserTier(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerTier: true,
      },
    });
    
    return user?.customerTier || null;
  }

  async calculateUserDiscount(userId: string, orderTotal: number): Promise<number> {
    const tier = await this.getUserTier(userId);
    
    if (!tier) {
      return 0;
    }

    // Check if user meets minimum spend requirement
    if (orderTotal >= tier.minSpend) {
      return (orderTotal * tier.discountPercentage) / 100;
    }

    return 0;
  }

  async getQualifyingTier(orderTotal: number) {
    const tiers = await this.getAllTiers();
    
    // Find the highest tier the order qualifies for
    const qualifyingTiers = tiers.filter((tier: any) => orderTotal >= tier.minSpend);
    
    if (qualifyingTiers.length === 0) {
      return null;
    }

    // Return the tier with highest discount percentage
    return qualifyingTiers.reduce((highest: any, current: any) => 
      current.discountPercentage > highest.discountPercentage ? current : highest
    );
  }

  async suggestTierUpgrade(userId: string, currentOrderTotal: number) {
    const currentTier = await this.getUserTier(userId);
    const allTiers = await this.getAllTiers();
    
    // Find next tier up
    const higherTiers = allTiers.filter((tier: any) => 
      !currentTier || tier.minSpend > currentTier.minSpend
    );

    if (higherTiers.length === 0) {
      return null;
    }

    const nextTier = higherTiers.reduce((lowest: any, current: any) => 
      current.minSpend < lowest.minSpend ? current : lowest
    );

    const amountNeeded = nextTier.minSpend - currentOrderTotal;

    return {
      nextTier,
      amountNeeded: amountNeeded > 0 ? amountNeeded : 0,
      potentialDiscount: nextTier.discountPercentage,
    };
  }
}
