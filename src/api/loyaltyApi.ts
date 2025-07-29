import express from "express";

import { protect, restrictTo } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import LoyaltyTier from "../models/LoyaltyTier";
import User from "../models/User";

const router = express.Router();

// Get all loyalty tiers
router.get(
  "/tiers",
  asyncHandler(async (req, res) => {
    const includeInactive = req.query.includeInactive === "true";

    // Build query
    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    const tiers = await LoyaltyTier.find(query).sort("minSpent");

    res.status(200).json({
      status: "success",
      results: tiers.length,
      data: { tiers },
    });
  }),
);

// Get a specific loyalty tier
router.get(
  "/tiers/:id",
  asyncHandler(async (req, res, next) => {
    const tier = await LoyaltyTier.findById(req.params.id);

    if (!tier) {
      return next(new AppError("No loyalty tier found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { tier },
    });
  }),
);

// Get user's loyalty status
router.get(
  "/my-status",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const currentTier = await LoyaltyTier.findOne({ name: user.loyaltyTier });

    // Find next tier
    const nextTier = await LoyaltyTier.findOne({
      minSpent: { $gt: currentTier.minSpent },
      isActive: true,
    }).sort("minSpent");

    // Calculate progress to next tier
    let progress = 100; // Default to 100% if there's no next tier
    let pointsToNextTier = 0;

    if (nextTier) {
      pointsToNextTier = nextTier.minSpent - user.loyaltyPoints;
      if (pointsToNextTier < 0) pointsToNextTier = 0;
      progress = Math.min(
        100,
        Math.floor((user.loyaltyPoints / nextTier.minSpent) * 100),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        points: user.loyaltyPoints,
        currentTier,
        nextTier: nextTier || null,
        progress,
        pointsToNextTier,
      },
    });
  }),
);

// Get loyalty point history for current user
router.get(
  "/my-history",
  protect,
  asyncHandler(async (req, res) => {
    // This would typically come from a separate LoyaltyTransaction model
    // For now, we'll return a mock history
    const mockHistory = [
      {
        id: "1",
        type: "earned",
        points: 120,
        reason: "Purchase",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        id: "2",
        type: "redeemed",
        points: 50,
        reason: "Discount",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: "3",
        type: "earned",
        points: 20,
        reason: "Review",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    res.status(200).json({
      status: "success",
      results: mockHistory.length,
      data: { history: mockHistory },
    });
  }),
);

// Redeem loyalty points for a reward
router.post(
  "/redeem",
  protect,
  asyncHandler(async (req, res, next) => {
    const { points, rewardType } = req.body;

    if (!points || !rewardType) {
      return next(new AppError("Points and reward type are required", 400));
    }

    const user = await User.findById(req.user._id);

    // Check if user has enough points
    if (user.loyaltyPoints < points) {
      return next(new AppError("Not enough loyalty points", 400));
    }

    // Process different reward types
    let rewardValue = 0;
    let rewardDescription = "";

    switch (rewardType) {
      case "discount":
        // 100 points = €1 discount
        rewardValue = points / 100;
        rewardDescription = `€${rewardValue.toFixed(2)} discount`;
        break;
      case "free_shipping":
        rewardValue = 0;
        rewardDescription = "Free shipping";
        break;
      case "gift":
        rewardValue = 0;
        rewardDescription = "Free gift with next purchase";
        break;
      default:
        return next(new AppError("Invalid reward type", 400));
    }

    // Deduct points from user
    user.loyaltyPoints -= points;
    await user.save();

    // In a real application, we would store the reward in a database
    // and apply it to the user's next order

    res.status(200).json({
      status: "success",
      data: {
        pointsRedeemed: points,
        rewardType,
        rewardValue,
        rewardDescription,
        remainingPoints: user.loyaltyPoints,
      },
    });
  }),
);

// Admin routes

// Create a new loyalty tier (admin only)
router.post(
  "/tiers",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const newTier = await LoyaltyTier.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tier: newTier },
    });
  }),
);

// Update a loyalty tier (admin only)
router.patch(
  "/tiers/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const tier = await LoyaltyTier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tier) {
      return next(new AppError("No loyalty tier found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { tier },
    });
  }),
);

// Delete a loyalty tier (admin only)
router.delete(
  "/tiers/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    // Check if any users are currently in this tier
    const tierName = (await LoyaltyTier.findById(req.params.id))?.name;
    if (!tierName) {
      return next(new AppError("No loyalty tier found with that ID", 404));
    }

    const usersInTier = await User.countDocuments({ loyaltyTier: tierName });
    if (usersInTier > 0) {
      return next(
        new AppError(
          `Cannot delete tier with ${usersInTier} users. Please reassign users first.`,
          400,
        ),
      );
    }

    const tier = await LoyaltyTier.findByIdAndDelete(req.params.id);

    if (!tier) {
      return next(new AppError("No loyalty tier found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
);

// Get loyalty program statistics (admin only)
router.get(
  "/stats",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    // Total users in loyalty program
    const totalUsers = await User.countDocuments({ loyaltyPoints: { $gt: 0 } });

    // Users by tier
    const usersByTier = await User.aggregate([
      { $group: { _id: "$loyaltyTier", count: { $sum: 1 } } },
    ]);

    // Average points per user
    const avgPointsResult = await User.aggregate([
      { $group: { _id: null, avgPoints: { $avg: "$loyaltyPoints" } } },
    ]);
    const avgPoints =
      avgPointsResult.length > 0 ? Math.floor(avgPointsResult[0].avgPoints) : 0;

    // Total points in system
    const totalPointsResult = await User.aggregate([
      { $group: { _id: null, totalPoints: { $sum: "$loyaltyPoints" } } },
    ]);
    const totalPoints =
      totalPointsResult.length > 0 ? totalPointsResult[0].totalPoints : 0;

    res.status(200).json({
      status: "success",
      data: {
        totalUsers,
        usersByTier: usersByTier.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        avgPoints,
        totalPoints,
      },
    });
  }),
);

// Manually adjust user loyalty points (admin only)
router.patch(
  "/users/:userId/points",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const { points, reason } = req.body;

    if (points === undefined) {
      return next(new AppError("Points value is required", 400));
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // Add or subtract points
    user.loyaltyPoints += points;

    // Ensure points don't go negative
    if (user.loyaltyPoints < 0) {
      user.loyaltyPoints = 0;
    }

    // Update user's tier based on points
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

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          loyaltyPoints: user.loyaltyPoints,
          loyaltyTier: user.loyaltyTier,
        },
        pointsAdjusted: points,
        reason: reason || "Manual adjustment",
      },
    });
  }),
);

export default router;
