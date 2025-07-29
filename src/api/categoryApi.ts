import express from "express";

import { protect, restrictTo, isAuthenticated } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import Category from "../models/Category";
import Product from "../models/Product";

const router = express.Router();

// Get all categories
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Query parameters
    const includeInactive = req.query.includeInactive === "true";
    const parentId = req.query.parent || null;

    // Build query
    const query: any = {};

    // Filter by active status if not explicitly including inactive
    if (!includeInactive) {
      query.isActive = true;
    }

    // Filter by parent
    if (parentId === "null") {
      // Root categories (no parent)
      query.parent = { $exists: false };
    } else if (parentId) {
      // Categories with specific parent
      query.parent = parentId;
    }

    // Execute query
    const categories = await Category.find(query).sort("order name");

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: { categories },
    });
  }),
);

// Get category by ID
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  }),
);

// Get category by slug
router.get(
  "/slug/:slug",
  asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return next(new AppError("No category found with that slug", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  }),
);

// Create new category (admin only)
router.post(
  "/",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    // Check if parent exists if provided
    if (req.body.parent) {
      const parentExists = await Category.findById(req.body.parent);
      if (!parentExists) {
        return next(new AppError("Parent category not found", 404));
      }
    }

    const newCategory = await Category.create(req.body);

    res.status(201).json({
      status: "success",
      data: { category: newCategory },
    });
  }),
);

// Update category (admin only)
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    // Check if parent exists if provided
    if (req.body.parent) {
      const parentExists = await Category.findById(req.body.parent);
      if (!parentExists) {
        return next(new AppError("Parent category not found", 404));
      }

      // Prevent setting parent to itself
      if (req.body.parent === req.params.id) {
        return next(new AppError("Category cannot be its own parent", 400));
      }

      // Prevent circular references
      let currentParent = parentExists.parent;
      while (currentParent) {
        if (currentParent.toString() === req.params.id) {
          return next(
            new AppError(
              "Circular reference detected in category hierarchy",
              400,
            ),
          );
        }
        const parent = await Category.findById(currentParent);
        currentParent = parent?.parent;
      }
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  }),
);

// Delete category (admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    // Check if category has children
    const hasChildren = await Category.findOne({ parent: req.params.id });
    if (hasChildren) {
      return next(
        new AppError(
          "Cannot delete category with subcategories. Please delete or reassign subcategories first.",
          400,
        ),
      );
    }

    // Check if category has products
    const hasProducts = await Product.findOne({ category: req.params.id });
    if (hasProducts) {
      return next(
        new AppError(
          "Cannot delete category with products. Please delete or reassign products first.",
          400,
        ),
      );
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
);

// Get category tree (hierarchical structure)
router.get(
  "/tree/all",
  asyncHandler(async (req, res) => {
    // Get all categories
    const allCategories = await Category.find({ isActive: true }).sort(
      "order name",
    );

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    allCategories.forEach((category) => {
      categoryMap.set(category._id.toString(), {
        ...category.toObject(),
        children: [],
      });
    });

    // Second pass: build tree structure
    allCategories.forEach((category) => {
      const categoryObj = categoryMap.get(category._id.toString());

      if (category.parent) {
        // This is a child category
        const parentId = category.parent.toString();
        if (categoryMap.has(parentId)) {
          categoryMap.get(parentId).children.push(categoryObj);
        }
      } else {
        // This is a root category
        rootCategories.push(categoryObj);
      }
    });

    res.status(200).json({
      status: "success",
      data: { categories: rootCategories },
    });
  }),
);

// Get subcategories of a category
router.get(
  "/:id/subcategories",
  asyncHandler(async (req, res, next) => {
    // Check if category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }

    // Get subcategories
    const subcategories = await Category.find({
      parent: req.params.id,
      isActive: true,
    }).sort("order name");

    res.status(200).json({
      status: "success",
      results: subcategories.length,
      data: {
        category,
        subcategories,
      },
    });
  }),
);

// Reorder categories (admin only)
router.patch(
  "/reorder",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return next(new AppError("Categories array is required", 400));
    }

    // Update order for each category
    const updatePromises = categories.map((item) => {
      return Category.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true },
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      status: "success",
      message: "Categories reordered successfully",
    });
  }),
);

export default router;
