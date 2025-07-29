// analyticsApi.ts - API rute za analitiku
import express from "express";

import { AnalyticsService } from "../services/AnalyticsService";
import { UserRepository } from "../services/UserRepository";

const router = express.Router();

// Mock baze podataka za demo
const db = {
  orders: {
    find: async (query: any) => {
      // Simulacija dohvaćanja narudžbi iz baze
      return Array.from({ length: 35 }, (_, i) => ({
        id: `order${i}`,
        userId: `user${i % 10}`,
        products: Array.from(
          { length: Math.floor(Math.random() * 4) + 1 },
          (_, j) => ({
            id: Math.floor(Math.random() * 20) + 1,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: (Math.random() * 30 + 10).toFixed(2),
          }),
        ),
        totalAmount: (Math.random() * 200 + 50).toFixed(2),
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: "completed",
      }));
    },
    countDocuments: async () => Math.floor(Math.random() * 100) + 50,
    distinct: async () =>
      Array.from(
        { length: Math.floor(Math.random() * 50) + 20 },
        (_, i) => `user${i}`,
      ),
  },
  userActions: {
    find: async () => {
      return Array.from({ length: 25 }, (_, i) => ({
        userId: `user${i % 10}`,
        action: i % 3 === 0 ? "view" : i % 3 === 1 ? "addToCart" : "purchase",
        productId: Math.floor(Math.random() * 20) + 1,
        timestamp: new Date(
          Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000,
        ),
      }));
    },
    distinct: async () =>
      Array.from(
        { length: Math.floor(Math.random() * 100) + 50 },
        (_, i) => `user${i}`,
      ),
  },
  users: {
    findOne: async (query: any) => ({
      id: query.id,
      preferences: {
        categories: ["Lakovi za nokte", "Maske za lice"],
        brands: ["OPI", "The Ordinary"],
        priceRange: { min: 0, max: 50 },
        colors: ["#DC143C", "#FFB6C1"],
      },
    }),
  },
};

// Inicijalizacija servisa
const userRepository = new UserRepository(db);
const analyticsService = new AnalyticsService(db, userRepository);

// API endpoint za dohvaćanje općih metrika za dashboard
router.get("/dashboard-metrics", async (req, res) => {
  try {
    const metrics = await analyticsService.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Greška pri dohvaćanju metrika:", error);
    res.status(500).json({ error: "Greška pri dohvaćanju metrika" });
  }
});

// API endpoint za dohvaćanje realtime metrika
router.get("/realtime-metrics", async (req, res) => {
  try {
    const metrics = await analyticsService.getRealtimeMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Greška pri dohvaćanju realtime metrika:", error);
    res.status(500).json({ error: "Greška pri dohvaćanju realtime metrika" });
  }
});

// API endpoint za dohvaćanje podataka o prihodima kroz vrijeme
router.get("/revenue-over-time", async (req, res) => {
  try {
    const timeframe =
      (req.query.timeframe as "daily" | "weekly" | "monthly") || "daily";
    const data = await analyticsService.getRevenueOverTime(timeframe);
    res.json(data);
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka o prihodima:", error);
    res
      .status(500)
      .json({ error: "Greška pri dohvaćanju podataka o prihodima" });
  }
});

// API endpoint za dohvaćanje korisničke analitike
router.get("/user-analytics", async (req, res) => {
  try {
    const data = await analyticsService.getUserAnalytics();
    res.json(data);
  } catch (error) {
    console.error("Greška pri dohvaćanju korisničke analitike:", error);
    res
      .status(500)
      .json({ error: "Greška pri dohvaćanju korisničke analitike" });
  }
});

export default router;
