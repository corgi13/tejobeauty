// recommendations.ts - API ruta za preporuke proizvoda
import express from "express";

import { ProductRecommendation } from "../models/SearchTypes";

const router = express.Router();

/**
 * GET /api/recommendations
 * Dohvaća preporuke proizvoda za određenog korisnika
 */
router.get("/", async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Potreban je userId parametar" });
    }

    // Ovdje bi u stvarnoj implementaciji trebali dohvatiti preporuke iz baze ili nekog servisa
    // Za potrebe demonstracije, vraćamo simulirane podatke
    const recommendations: ProductRecommendation[] = [
      { productId: 101, source: "collaborative", relevanceScore: 0.95 },
      { productId: 203, source: "history", relevanceScore: 0.87 },
      { productId: 154, source: "trending", relevanceScore: 0.82 },
      { productId: 389, source: "collaborative", relevanceScore: 0.78 },
    ];

    // Ako je naveden productId, filtriraj preporuke da ne uključuju taj proizvod
    const filteredRecommendations = productId
      ? recommendations.filter((rec) => rec.productId !== Number(productId))
      : recommendations;

    res.json(filteredRecommendations);
  } catch (error) {
    console.error("Greška pri dohvaćanju preporuka:", error);
    res.status(500).json({ error: "Interna greška servera" });
  }
});

export default router;
