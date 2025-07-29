// AnalyticsService.ts - Real-time Analytics
import { UserRepository } from "./UserRepository";
import { Product, PurchaseHistory } from "../models/SearchTypes";

export interface AnalyticsDashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  conversionRate: number;
  topProducts: Product[];
  salesByCategory: { category: string; sales: number; percentage: number }[];
  lastUpdated: Date;
}

export interface RealtimeMetrics {
  onlineUsers: number;
  activeOrders: number;
  todayRevenue: number;
  conversionRate: number;
}

export class AnalyticsService {
  private db: any;
  private userRepository: UserRepository;
  private redis: any; // Mock Redis za real-time podatke

  constructor(db: any, userRepository: UserRepository) {
    this.db = db;
    this.userRepository = userRepository;
    this.redis = {
      hgetall: async (key: string) => ({
        online_users: Math.floor(Math.random() * 100 + 50).toString(),
        active_orders: Math.floor(Math.random() * 15 + 5).toString(),
        today_revenue: (Math.random() * 5000 + 1000).toFixed(2),
        conversion_rate: (Math.random() * 10 + 2).toFixed(2),
      }),
    };
  }

  async getDashboardMetrics(): Promise<AnalyticsDashboardMetrics> {
    const [
      totalRevenue,
      totalOrders,
      activeUsers,
      conversionRate,
      topProducts,
      salesByCategory,
    ] = await Promise.all([
      this.getTotalRevenue(),
      this.getTotalOrders(),
      this.getActiveUsers(),
      this.getConversionRate(),
      this.getTopProducts(),
      this.getSalesByCategory(),
    ]);

    return {
      totalRevenue,
      totalOrders,
      activeUsers,
      conversionRate,
      topProducts,
      salesByCategory,
      lastUpdated: new Date(),
    };
  }

  async getRealtimeMetrics(): Promise<RealtimeMetrics> {
    // WebSocket connection for real-time data
    const metrics = await this.redis.hgetall("realtime_metrics");

    return {
      onlineUsers: parseInt(metrics.online_users || "0"),
      activeOrders: parseInt(metrics.active_orders || "0"),
      todayRevenue: parseFloat(metrics.today_revenue || "0"),
      conversionRate: parseFloat(metrics.conversion_rate || "0"),
    };
  }

  private async getTotalRevenue(): Promise<number> {
    // Implementacija za stvarni DB bi koristila agregaciju
    const orders = await this.db.orders.find({
      status: "completed",
      orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // zadnjih 30 dana
    });

    return orders.reduce(
      (acc: number, order: PurchaseHistory) => acc + order.totalAmount,
      0,
    );
  }

  private async getTotalOrders(): Promise<number> {
    return await this.db.orders.countDocuments({
      status: "completed",
      orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
  }

  private async getActiveUsers(): Promise<number> {
    return await this.db.userActions.distinct("userId", {
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // zadnjih 7 dana
    }).length;
  }

  private async getConversionRate(): Promise<number> {
    const totalVisitors = await this.db.userActions.distinct("userId", {
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).length;

    const purchasers = await this.db.orders.distinct("userId", {
      status: "completed",
      orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).length;

    return totalVisitors > 0 ? (purchasers / totalVisitors) * 100 : 0;
  }

  private async getTopProducts(): Promise<Product[]> {
    // U stvarnoj implementaciji, ovo bi bila MongoDB agregacija
    const productSales: Record<number, { count: number; product: Product }> =
      {};
    const orders = await this.db.orders.find({
      status: "completed",
      orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // Zbrajanje prodaja po proizvodu
    orders.forEach((order: PurchaseHistory) => {
      order.products.forEach((item) => {
        if (!productSales[item.id]) {
          // Ovdje bi obično dohvatili potpune podatke o proizvodu iz baze
          productSales[item.id] = {
            count: 0,
            product: {
              id: item.id,
              name: `Proizvod ${item.id}`,
              price: item.price,
              image: `/images/products/${item.id}.jpg`,
              category: "Kategorija",
              brand: "Brend",
              rating: 4.5,
              reviews: 10,
              stock: 100,
              description: "Opis proizvoda",
            },
          };
        }
        productSales[item.id].count += item.quantity;
      });
    });

    // Sortiranje i pretvaranje u polje
    return Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((entry) => entry.product);
  }

  private async getSalesByCategory(): Promise<
    { category: string; sales: number; percentage: number }[]
  > {
    // U stvarnoj implementaciji, ovo bi bila MongoDB agregacija
    const categoryMap: Record<string, number> = {};
    let totalSales = 0;

    const orders = await this.db.orders.find({
      status: "completed",
      orderDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    // Simulirani podaci - u stvarnoj implementaciji, povezali bismo sa stvarnim kategorijama proizvoda
    orders.forEach((order: PurchaseHistory) => {
      order.products.forEach((item) => {
        // Simuliramo kategoriju prema ID-u proizvoda
        const category = [
          "Lakovi za nokte",
          "Maske za lice",
          "Šminka",
          "Njega kože",
          "Pribor",
        ][item.id % 5];
        categoryMap[category] =
          (categoryMap[category] || 0) + item.quantity * item.price;
        totalSales += item.quantity * item.price;
      });
    });

    // Sortiranje kategorija prema prodaji
    return Object.entries(categoryMap)
      .map(([category, sales]) => ({
        category,
        sales,
        percentage: (sales / totalSales) * 100,
      }))
      .sort((a, b) => b.sales - a.sales);
  }

  async getRevenueOverTime(
    timeframe: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<{ date: string; revenue: number }[]> {
    const today = new Date();
    const result: { date: string; revenue: number }[] = [];
    let dateFormat: Intl.DateTimeFormatOptions;
    let daysToLookBack: number;

    // Određivanje vremenskog okvira
    switch (timeframe) {
      case "weekly":
        dateFormat = { weekday: "short", month: "short", day: "numeric" };
        daysToLookBack = 7 * 8; // 8 tjedana
        break;
      case "monthly":
        dateFormat = { month: "short", year: "numeric" };
        daysToLookBack = 30 * 12; // 12 mjeseci
        break;
      case "daily":
      default:
        dateFormat = { month: "short", day: "numeric" };
        daysToLookBack = 30; // 30 dana
    }

    // Simulacija podataka za graf
    for (let i = 0; i < daysToLookBack; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("hr-HR", dateFormat);

      // Generiranje nasumičnog prihoda (u stvarnoj implementaciji, ovo bi bio agregacijski upit na stvarnim podacima)
      const revenue = Math.random() * 1000 + 500;

      result.unshift({ date: dateStr, revenue });
    }

    return result;
  }

  async getUserAnalytics(): Promise<{
    retention: number;
    acquisitionSources: { source: string; users: number; percentage: number }[];
    demographics: { age: string; percentage: number }[];
  }> {
    // Simulirani podaci - u stvarnoj implementaciji, ovo bi bile stvarne analize iz baze podataka

    return {
      retention: 68.5, // Stopa zadržavanja korisnika

      acquisitionSources: [
        { source: "Direktno", users: 235, percentage: 35.2 },
        { source: "Društvene mreže", users: 189, percentage: 28.3 },
        { source: "Google", users: 156, percentage: 23.4 },
        { source: "Email", users: 87, percentage: 13.1 },
      ],

      demographics: [
        { age: "18-24", percentage: 21 },
        { age: "25-34", percentage: 38 },
        { age: "35-44", percentage: 24 },
        { age: "45-54", percentage: 12 },
        { age: "55+", percentage: 5 },
      ],
    };
  }
}
