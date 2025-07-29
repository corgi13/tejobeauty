import { Injectable } from "@nestjs/common";
import { OrderStatus, PaymentStatus } from "@prisma/client";

import { PrismaService } from "../prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      pendingOrders,
      completedOrders,
      professionals,
      verifiedProfessionals,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { total: true },
      }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.professional.count(),
      this.prisma.professional.count({ where: { isVerified: true } }),
    ]);

    return {
      users: {
        total: totalUsers,
        professionals: professionals,
        verifiedProfessionals: verifiedProfessionals,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
      },
      revenue: {
        total: totalRevenue._sum.total || 0,
      },
      products: {
        total: totalProducts,
      },
    };
  }

  async getSalesData(period: "week" | "month" | "year" = "month") {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: PaymentStatus.PAID,
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const salesByDate = orders.reduce(
      (acc, order) => {
        const date = order.createdAt.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, sales: 0, orders: 0 };
        }
        acc[date].sales += order.total;
        acc[date].orders += 1;
        return acc;
      },
      {} as Record<string, { date: string; sales: number; orders: number }>,
    );

    return Object.values(salesByDate);
  }

  async getTopProducts(limit = 10) {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, total: true },
      _count: { productId: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
            },
          },
        });

        return {
          product,
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: item._sum.total || 0,
          orderCount: item._count.productId,
        };
      }),
    );

    return productsWithDetails;
  }

  async getTopCategories(limit = 10) {
    const topCategories = await this.prisma.orderItem.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const categoryStats = topCategories.reduce(
      (acc, item) => {
        const categoryId = item.product.categoryId;
        const categoryName = item.product.category.name;

        if (!acc[categoryId]) {
          acc[categoryId] = {
            id: categoryId,
            name: categoryName,
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0,
          };
        }

        acc[categoryId].totalQuantity += item.quantity;
        acc[categoryId].totalRevenue += item.total;
        acc[categoryId].orderCount += 1;

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(categoryStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  async getUserGrowth(period: "week" | "month" | "year" = "month") {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const users = await this.prisma.user.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        role: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const usersByDate = users.reduce(
      (acc, user) => {
        const date = user.createdAt.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, customers: 0, professionals: 0, total: 0 };
        }

        if (user.role === "PROFESSIONAL") {
          acc[date].professionals += 1;
        } else {
          acc[date].customers += 1;
        }
        acc[date].total += 1;

        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(usersByDate);
  }

  async getOrderStatusDistribution() {
    const statusCounts = await this.prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    return statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  async getRevenueByMonth(year?: number) {
    const targetYear = year || new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear + 1, 0, 1);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lt: endDate },
        paymentStatus: PaymentStatus.PAID,
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: 0,
      orders: 0,
    }));

    orders.forEach((order) => {
      const month = order.createdAt.getMonth();
      revenueByMonth[month].revenue += order.total;
      revenueByMonth[month].orders += 1;
    });

    return revenueByMonth;
  }

  async getProfessionalStats() {
    const [
      totalProfessionals,
      verifiedProfessionals,
      totalCommissions,
      paidCommissions,
      totalBulkOrders,
      completedBulkOrders,
    ] = await Promise.all([
      this.prisma.professional.count(),
      this.prisma.professional.count({ where: { isVerified: true } }),
      this.prisma.commission.aggregate({ _sum: { amount: true } }),
      this.prisma.commission.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      this.prisma.bulkOrder.count(),
      this.prisma.bulkOrder.count({ where: { status: "COMPLETED" } }),
    ]);

    return {
      professionals: {
        total: totalProfessionals,
        verified: verifiedProfessionals,
        verificationRate:
          totalProfessionals > 0
            ? (verifiedProfessionals / totalProfessionals) * 100
            : 0,
      },
      commissions: {
        total: totalCommissions._sum.amount || 0,
        paid: paidCommissions._sum.amount || 0,
        pending:
          (totalCommissions._sum.amount || 0) -
          (paidCommissions._sum.amount || 0),
      },
      bulkOrders: {
        total: totalBulkOrders,
        completed: completedBulkOrders,
        completionRate:
          totalBulkOrders > 0
            ? (completedBulkOrders / totalBulkOrders) * 100
            : 0,
      },
    };
  }
}
