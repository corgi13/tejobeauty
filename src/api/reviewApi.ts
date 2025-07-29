import express from "express";

import { protect, restrictTo, isAuthenticated } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import Order from "../models/Order";
import Product from "../models/Product";
import Review from "../models/Review";

const router = express.Router();

// Get all reviews for a product
router.get(
  "/product/:productId",
  asyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }

    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get approved reviews only for regular users
    const query: any = { product: productId };
    if (!req.user || req.user.role !== "admin") {
      query.isApproved = true;
    }

    // Execute query
    const reviews = await Review.find(query)
      .populate("user", "firstName lastName")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { reviews },
    });
  }),
);

// Get a single review
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate(
      "user",
      "firstName lastName",
    );

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    // Only allow admin or the review author to see unapproved reviews
    if (
      !review.isApproved &&
      (!req.user ||
        (req.user.role !== "admin" &&
          req.user._id.toString() !== review.user._id.toString()))
    ) {
      return next(new AppError("This review is pending approval", 403));
    }

    res.status(200).json({
      status: "success",
      data: { review },
    });
  }),
);

// Create a review
router.post(
  "/",
  protect,
  asyncHandler(async (req, res, next) => {
    const { product, rating, title, comment, images } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return next(new AppError("No product found with that ID", 404));
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product,
    });
    if (existingReview) {
      return next(new AppError("You have already reviewed this product", 400));
    }

    // Check if user has purchased the product (for verified purchase badge)
    const hasOrdered = await Order.findOne({
      user: req.user._id,
      "orderItems.product": product,
      isPaid: true,
    });

    // Create review
    const newReview = await Review.create({
      user: req.user._id,
      product,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: !!hasOrdered,
      // Auto-approve reviews from admin users
      isApproved: req.user.role === "admin",
    });

    res.status(201).json({
      status: "success",
      data: { review: newReview },
    });
  }),
);

// Update a review (only by the author or admin)
router.patch(
  "/:id",
  protect,
  asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    // Check if user is the author or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("You can only update your own reviews", 403));
    }

    // Fields that can be updated
    const { rating, title, comment, images } = req.body;

    // Create update object
    const updateData: any = {};
    if (rating !== undefined) updateData.rating = rating;
    if (title) updateData.title = title;
    if (comment) updateData.comment = comment;
    if (images) updateData.images = images;

    // If regular user is updating, set isApproved to false for re-moderation
    if (req.user.role !== "admin") {
      updateData.isApproved = false;
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      status: "success",
      data: { review: updatedReview },
    });
  }),
);

// Delete a review (only by the author or admin)
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    // Check if user is the author or admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("You can only delete your own reviews", 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
);

// Report a review
router.post(
  "/:id/report",
  protect,
  asyncHandler(async (req, res, next) => {
    const { reason } = req.body;

    if (!reason) {
      return next(new AppError("Report reason is required", 400));
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    // Update review
    review.isReported = true;
    review.reportReason = reason;
    await review.save();

    res.status(200).json({
      status: "success",
      message: "Review reported successfully",
    });
  }),
);

// Admin routes

// Get all reviews (admin only)
router.get(
  "/",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    // Query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filter options
    const filter: any = {};

    if (req.query.isApproved === "true") filter.isApproved = true;
    if (req.query.isApproved === "false") filter.isApproved = false;
    if (req.query.isReported === "true") filter.isReported = true;

    // Execute query
    const reviews = await Review.find(filter)
      .populate("user", "firstName lastName email")
      .populate("product", "name")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { reviews },
    });
  }),
);

// Approve or reject a review (admin only)
router.patch(
  "/:id/moderate",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const { isApproved, adminResponse } = req.body;

    if (isApproved === undefined) {
      return next(new AppError("isApproved field is required", 400));
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError("No review found with that ID", 404));
    }

    // Update review
    review.isApproved = isApproved;
    if (adminResponse) review.adminResponse = adminResponse;

    // If approving, clear reported status
    if (isApproved) {
      review.isReported = false;
      review.reportReason = undefined;
    }

    await review.save();

    res.status(200).json({
      status: "success",
      data: { review },
    });
  }),
);

// Get pending reviews count (admin only)
router.get(
  "/stats/pending",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const pendingCount = await Review.countDocuments({ isApproved: false });
    const reportedCount = await Review.countDocuments({ isReported: true });

    res.status(200).json({
      status: "success",
      data: {
        pendingCount,
        reportedCount,
      },
    });
  }),
);

export default router;
