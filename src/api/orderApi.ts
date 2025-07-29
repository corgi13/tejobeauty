import express from "express";

import { protect, restrictTo } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import LoyaltyTier from "../models/LoyaltyTier";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";

const router = express.Router();

// Get all orders for the current user
router.get(
  "/my-orders",
  protect,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      status: "success",
      results: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { orders },
    });
  }),
);

// Get a specific order
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("No order found with that ID", 404));
    }

    // Check if the order belongs to the current user or user is admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        new AppError("You do not have permission to access this order", 403),
      );
    }

    res.status(200).json({
      status: "success",
      data: { order },
    });
  }),
);

// Create a new order
router.post(
  "/",
  protect,
  asyncHandler(async (req, res, next) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      loyaltyPointsUsed,
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return next(new AppError("No order items", 400));
    }

    // Check if all products exist and are in stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }

      if (
        product.professionalOnly &&
        req.user.role !== "professional" &&
        req.user.role !== "admin"
      ) {
        return next(
          new AppError(
            `Product ${product.name} is only available to professional users`,
            403,
          ),
        );
      }

      if (!product.inStock || product.stock < item.quantity) {
        return next(
          new AppError(
            `Product ${product.name} is out of stock or has insufficient quantity`,
            400,
          ),
        );
      }
    }

    // Calculate loyalty points to be earned (10 points per euro spent)
    const loyaltyPointsEarned = Math.floor(totalPrice * 10);

    // Calculate discount from loyalty points used
    let discountAmount = 0;
    if (loyaltyPointsUsed && loyaltyPointsUsed > 0) {
      // Check if user has enough loyalty points
      if (loyaltyPointsUsed > req.user.loyaltyPoints) {
        return next(new AppError("You do not have enough loyalty points", 400));
      }

      // Convert loyalty points to discount (1 point = 0.01 euro)
      discountAmount = loyaltyPointsUsed * 0.01;

      // Ensure discount doesn't exceed total price
      if (discountAmount > totalPrice) {
        discountAmount = totalPrice;
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice: totalPrice - discountAmount,
      loyaltyPointsEarned,
      loyaltyPointsUsed: loyaltyPointsUsed || 0,
      discountAmount,
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });

      // Update inStock status if stock reaches 0
      const product = await Product.findById(item.product);
      if (product.stock <= 0) {
        product.inStock = false;
        await product.save();
      }
    }

    // If loyalty points were used, deduct them from user
    if (loyaltyPointsUsed && loyaltyPointsUsed > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { loyaltyPoints: -loyaltyPointsUsed },
      });
    }

    res.status(201).json({
      status: "success",
      data: { order },
    });
  }),
);

// Update order to paid
router.patch(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res, next) => {
    const { paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("No order found with that ID", 404));
    }

    // Check if the order belongs to the current user or user is admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        new AppError("You do not have permission to update this order", 403),
      );
    }

    // Check if order is already paid
    if (order.isPaid) {
      return next(new AppError("Order is already paid", 400));
    }

    // Update order
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = paymentResult;
    order.status = "processing";

    const updatedOrder = await order.save();

    // Add loyalty points to user
    if (order.loyaltyPointsEarned > 0) {
      const user = await User.findById(order.user);
      user.loyaltyPoints += order.loyaltyPointsEarned;

      // Check if user qualifies for a higher loyalty tier
      const currentTier = await LoyaltyTier.findOne({ name: user.loyaltyTier });
      const eligibleTiers = await LoyaltyTier.find({
        minSpent: { $lte: user.loyaltyPoints },
        isActive: true,
      }).sort("-minSpent");

      if (eligibleTiers.length > 0) {
        const highestEligibleTier = eligibleTiers[0];
        if (
          !currentTier ||
          highestEligibleTier.minSpent > currentTier.minSpent
        ) {
          user.loyaltyTier = highestEligibleTier.name;
        }
      }

      await user.save();
    }

    res.status(200).json({
      status: "success",
      data: { order: updatedOrder },
    });
  }),
);

// Update order to delivered (admin only)
router.patch(
  "/:id/deliver",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("No order found with that ID", 404));
    }

    // Check if order is already delivered
    if (order.isDelivered) {
      return next(new AppError("Order is already delivered", 400));
    }

    // Check if order is paid
    if (!order.isPaid) {
      return next(new AppError("Order is not paid yet", 400));
    }

    // Update order
    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = "delivered";

    const updatedOrder = await order.save();

    res.status(200).json({
      status: "success",
      data: { order: updatedOrder },
    });
  }),
);

// Cancel order
router.patch(
  "/:id/cancel",
  protect,
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("No order found with that ID", 404));
    }

    // Check if the order belongs to the current user or user is admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        new AppError("You do not have permission to cancel this order", 403),
      );
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return next(
        new AppError(
          `Order cannot be cancelled in ${order.status} status`,
          400,
        ),
      );
    }

    // Update order
    order.status = "cancelled";

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });

      // Update inStock status
      const product = await Product.findById(item.product);
      if (product.stock > 0) {
        product.inStock = true;
        await product.save();
      }
    }

    // Restore loyalty points if they were used
    if (order.loyaltyPointsUsed > 0) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { loyaltyPoints: order.loyaltyPointsUsed },
      });
    }

    // Remove earned loyalty points if order was paid
    if (order.isPaid && order.loyaltyPointsEarned > 0) {
      const user = await User.findById(order.user);
      user.loyaltyPoints -= order.loyaltyPointsEarned;

      // Ensure loyalty points don't go negative
      if (user.loyaltyPoints < 0) {
        user.loyaltyPoints = 0;
      }

      // Recalculate loyalty tier
      const eligibleTiers = await LoyaltyTier.find({
        minSpent: { $lte: user.loyaltyPoints },
        isActive: true,
      }).sort("-minSpent");

      if (eligibleTiers.length > 0) {
        user.loyaltyTier = eligibleTiers[0].name;
      } else {
        // Default to lowest tier
        const lowestTier = await LoyaltyTier.findOne({ isActive: true }).sort(
          "minSpent",
        );
        if (lowestTier) {
          user.loyaltyTier = lowestTier.name;
        }
      }

      await user.save();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      status: "success",
      data: { order: updatedOrder },
    });
  }),
);

// Admin routes

// Get all orders (admin only)
router.get(
  "/",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filter options
    const filter: any = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.isPaid === "true") filter.isPaid = true;
    if (req.query.isPaid === "false") filter.isPaid = false;
    if (req.query.isDelivered === "true") filter.isDelivered = true;
    if (req.query.isDelivered === "false") filter.isDelivered = false;

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Execute query
    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: { orders },
    });
  }),
);

// Get order statistics (admin only)
router.get(
  "/stats/summary",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get start of current year
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total paid orders
    const totalPaidOrders = await Order.countDocuments({ isPaid: true });

    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Orders today
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Revenue today
    const revenueTodayResult = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const revenueToday =
      revenueTodayResult.length > 0 ? revenueTodayResult[0].total : 0;

    // Orders this month
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Revenue this month
    const revenueThisMonthResult = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const revenueThisMonth =
      revenueThisMonthResult.length > 0 ? revenueThisMonthResult[0].total : 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalOrders,
        totalPaidOrders,
        totalRevenue,
        ordersToday,
        revenueToday,
        ordersThisMonth,
        revenueThisMonth,
        ordersByStatus: ordersByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      },
    });
  }),
);

export default router;
