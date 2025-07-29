// searchApi.ts - API endpoints for search and recommendations
import * as dotenv from "dotenv";
import express from "express";

import { AlgoliaClient } from "../../AlgoliaClient";
import { isAuthenticated } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import Product from "../models/Product";
import User from "../models/User";

dotenv.config();

const router = express.Router();

// Initialize Algolia client if API keys are provided
let algoliaClient = null;
if (
  process.env.ALGOLIA_APP_ID &&
  process.env.ALGOLIA_API_KEY &&
  process.env.ALGOLIA_INDEX_NAME
) {
  algoliaClient = new AlgoliaClient(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
    process.env.ALGOLIA_INDEX_NAME,
  );
}

// Search products endpoint
router.get(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const {
      q,
      category,
      brand,
      priceMin,
      priceMax,
      page = "1",
      limit = "10",
      sort,
    } = req.query;

    // Build query
    const query: any = {};

    // Text search
    if (q) {
      query.$text = { $search: q as string };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price range filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // Professional products filtering
    if (
      !req.user ||
      (req.user.role !== "professional" && req.user.role !== "admin")
    ) {
      query.professionalOnly = { $ne: true };
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build database query
    let dbQuery = Product.find(query);

    // Sorting
    if (sort) {
      const sortField = sort as string;
      dbQuery = dbQuery.sort(sortField);
    } else {
      // Default sort by relevance (if text search) or by createdAt
      if (q) {
        dbQuery = dbQuery.sort({ score: { $meta: "textScore" } });
      } else {
        dbQuery = dbQuery.sort("-createdAt");
      }
    }

    // Execute query with pagination
    const products = await dbQuery.skip(skip).limit(limitNum);
    const total = await Product.countDocuments(query);

    // If Algolia is configured, use it for more advanced search
    if (algoliaClient && q) {
      try {
        const algoliaResults = await algoliaClient.search(q as string, {
          filters: buildAlgoliaFilters(category, brand, priceMin, priceMax),
          page: pageNum - 1, // Algolia uses 0-based pagination
          hitsPerPage: limitNum,
        });

        // Merge results if needed or use Algolia results directly
        // For now, we'll just log that Algolia was used
        console.log("Algolia search performed");
      } catch (error) {
        console.error("Algolia search error:", error);
        // Fall back to MongoDB results (already fetched)
      }
    }

    // Track search if user is authenticated
    if (req.user && q) {
      try {
        // Track search action
        await trackUserAction(req.user._id, "search", {
          query: q,
          results: products.length,
        });
      } catch (error) {
        console.error("Error tracking search:", error);
      }
    }

    res.status(200).json({
      status: "success",
      results: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { products },
    });
  }),
);

// Get personalized recommendations
router.get(
  "/recommendations",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required for personalized recommendations",
          401,
        ),
      );
    }

    const { limit = "6" } = req.query;
    const limitNum = parseInt(limit as string);

    // Get user's purchase history
    const purchaseHistory = await getUserPurchaseHistory(req.user._id);

    // Get user's viewed products
    const viewedProducts = await getUserViewedProducts(req.user._id);

    // Simple recommendation algorithm:
    // 1. Get products from the same categories as purchased products
    // 2. Exclude products already purchased or viewed
    // 3. Sort by rating and limit results

    let recommendedProducts = [];

    if (purchaseHistory.length > 0) {
      // Extract categories from purchase history
      const purchasedCategories = [
        ...new Set(purchaseHistory.map((p) => p.category)),
      ];
      const purchasedProductIds = purchaseHistory.map((p) => p._id);
      const viewedProductIds = viewedProducts.map((p) => p._id);

      // Find products in the same categories, excluding already purchased/viewed products
      recommendedProducts = await Product.find({
        category: { $in: purchasedCategories },
        _id: { $nin: [...purchasedProductIds, ...viewedProductIds] },
        professionalOnly:
          req.user.role === "professional" ? undefined : { $ne: true },
      })
        .sort("-rating -reviews")
        .limit(limitNum);
    }

    // If not enough recommendations, add top-rated products
    if (recommendedProducts.length < limitNum) {
      const additionalCount = limitNum - recommendedProducts.length;
      const existingIds = recommendedProducts.map((p) => p._id);

      const topRatedProducts = await Product.find({
        _id: { $nin: existingIds },
        professionalOnly:
          req.user.role === "professional" ? undefined : { $ne: true },
      })
        .sort("-rating -reviews")
        .limit(additionalCount);

      recommendedProducts = [...recommendedProducts, ...topRatedProducts];
    }

    res.status(200).json({
      status: "success",
      results: recommendedProducts.length,
      data: { products: recommendedProducts },
    });
  }),
);

// Track user action
router.post(
  "/track",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required for tracking", 401));
    }

    const { action, productId, data } = req.body;

    if (!action) {
      return next(new AppError("Action is required", 400));
    }

    // Track the action
    await trackUserAction(req.user._id, action, { productId, ...data });

    res.status(200).json({
      status: "success",
      message: "Action tracked successfully",
    });
  }),
);

// Helper function to build Algolia filters
function buildAlgoliaFilters(
  category?: any,
  brand?: any,
  priceMin?: any,
  priceMax?: any,
): string {
  const filters = [];

  if (category) filters.push(`category:"${category}"`);
  if (brand) filters.push(`brand:"${brand}"`);

  if (priceMin || priceMax) {
    const priceFilter = [];
    if (priceMin) priceFilter.push(`price >= ${priceMin}`);
    if (priceMax) priceFilter.push(`price <= ${priceMax}`);
    filters.push(`(${priceFilter.join(" AND ")})`);
  }

  return filters.join(" AND ");
}

// Helper function to track user actions
// In a real application, this would be stored in a database
async function trackUserAction(userId: string, action: string, data: any = {}) {
  // For now, just log the action
  console.log(`User ${userId} performed ${action}:`, data);

  // In a real application, you would store this in a database
  // Example:
  // await UserAction.create({
  //   user: userId,
  //   action,
  //   data,
  //   timestamp: new Date()
  // });
}

// Helper function to get user's purchase history
async function getUserPurchaseHistory(userId: string) {
  // This is a simplified version
  // In a real application, you would query the orders collection
  return [];
}

// Helper function to get user's viewed products
async function getUserViewedProducts(userId: string) {
  // This is a simplified version
  // In a real application, you would query the user actions collection
  return [];
}

export default router;
