import express from "express";

import { protect, restrictTo, isAuthenticated } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import Category from "../models/Category";
import Product from "../models/Product";

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    // Build query
    const queryObj = { ...req.query };

    // Fields to exclude from filtering
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "q",
      "sustainable",
      "certType",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Base query
    let query = Product.find(JSON.parse(queryStr));

    // Sustainability filtering
    if (req.query.sustainable === "true") {
      query = query.find({ isSustainable: true });
    }

    // Certification type filtering
    if (req.query.certType) {
      const certType = req.query.certType as string;
      // Find certifications of the specified type
      const certifications = await Certification.find({
        type: certType,
        isActive: true,
      }).distinct("_id");
      // Find products with any of these certifications
      query = query.find({ certifications: { $in: certifications } });
    }

    // Search functionality
    if (req.query.q) {
      const searchTerm = req.query.q as string;
      query = query.find({ $text: { $search: searchTerm } });
    }

    // Professional products filtering
    if (
      !req.user ||
      (req.user.role !== "professional" && req.user.role !== "admin")
    ) {
      query = query.find({ professionalOnly: { $ne: true } });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field limiting
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    // Response
    res.status(200).json({
      status: "success",
      results: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { products },
    });
  }),
);

// Get product by ID
router.get(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    // Check if product is professional only
    if (
      product.professionalOnly &&
      (!req.user ||
        (req.user.role !== "professional" && req.user.role !== "admin"))
    ) {
      return next(
        new AppError(
          "This product is only available to professional users",
          403,
        ),
      );
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  }),
);

// Create new product (admin only)
router.post(
  "/",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: { product: newProduct },
    });
  }),
);

// Update product (admin only)
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  }),
);

// Delete product (admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
);

// Get products by category
router.get(
  "/category/:categoryId",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }

    // Build query
    let query = Product.find({ category: category.name });

    // Professional products filtering
    if (
      !req.user ||
      (req.user.role !== "professional" && req.user.role !== "admin")
    ) {
      query = query.find({ professionalOnly: { $ne: true } });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;
    const total = await Product.countDocuments({ category: category.name });

    // Response
    res.status(200).json({
      status: "success",
      results: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        category,
        products,
      },
    });
  }),
);

// Get featured products
router.get(
  "/featured/list",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 6;

    // Build query for featured products (e.g., products with highest rating)
    let query = Product.find({ inStock: true })
      .sort("-rating -reviews")
      .limit(limit);

    // Professional products filtering
    if (
      !req.user ||
      (req.user.role !== "professional" && req.user.role !== "admin")
    ) {
      query = query.find({ professionalOnly: { $ne: true } });
    }

    // Execute query
    const products = await query;

    // Response
    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  }),
);

// Get products on sale
router.get(
  "/sale/list",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;

    // Build query for products on sale (products with originalPrice > price)
    let query = Product.find({
      originalPrice: { $exists: true, $gt: 0 },
      price: { $lt: { $ref: "originalPrice" } },
      inStock: true,
    })
      .sort("-createdAt")
      .limit(limit);

    // Professional products filtering
    if (
      !req.user ||
      (req.user.role !== "professional" && req.user.role !== "admin")
    ) {
      query = query.find({ professionalOnly: { $ne: true } });
    }

    // Execute query
    const products = await query;

    // Response
    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  }),
);

// Get products with low stock (admin only)
router.get(
  "/inventory/low-stock",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const threshold = parseInt(req.query.threshold as string) || 10;

    const products = await Product.find({
      stock: { $lte: threshold },
      stock: { $gt: 0 },
    })
      .sort("stock")
      .select("name stock category brand price");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  }),
);

// Get out of stock products (admin only)
router.get(
  "/inventory/out-of-stock",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const products = await Product.find({
      $or: [{ stock: 0 }, { inStock: false }],
    })
      .sort("name")
      .select("name stock category brand price");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: { products },
    });
  }),
);

// Update product stock (admin only)
router.patch(
  "/:id/stock",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const { stock } = req.body;

    if (stock === undefined) {
      return next(new AppError("Stock value is required", 400));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stock,
        inStock: stock > 0,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  }),
);

export default router;
