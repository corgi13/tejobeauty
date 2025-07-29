import crypto from "crypto";

import express from "express";

import { protect, restrictTo, generateToken } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import User from "../models/User";

const router = express.Router();

// Register a new user
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    // Create new user
    const user = new User({
      email,
      firstName,
      lastName,
      phone,
    });

    // Set password (this uses the method defined in the User model)
    user.setPassword(password);

    // Generate verification token
    const verificationToken = user.generateVerificationToken();

    // Save user
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // TODO: Send verification email with token
    // 🚩 Requires email provider credentials/API key (e.g., SMTP/Nodemailer or SendGrid/Mailgun API)
    // 🚩 Please provide SMTP config or 3rd-party API if you want this step fully integrated!
    // sendVerificationEmail(email, verificationToken); // Uncomment when implemented

    // Remove logging in production!
    if (process.env.NODE_ENV !== "production") {
      console.log(`Verification token for ${email}: ${verificationToken}`);
    }

    // Return user data (without sensitive information)
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          loyaltyPoints: user.loyaltyPoints,
          loyaltyTier: user.loyaltyTier,
        },
      },
    });
  }),
);

// Login user
router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !user.validatePassword(password)) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Return user data
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          loyaltyPoints: user.loyaltyPoints,
          loyaltyTier: user.loyaltyTier,
        },
      },
    });
  }),
);

// Get current user profile
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          phone: req.user.phone,
          address: req.user.address,
          role: req.user.role,
          isVerified: req.user.isVerified,
          loyaltyPoints: req.user.loyaltyPoints,
          loyaltyTier: req.user.loyaltyTier,
          lastLogin: req.user.lastLogin,
        },
      },
    });
  }),
);

// Update current user profile
router.patch(
  "/me",
  protect,
  asyncHandler(async (req, res, next) => {
    const { firstName, lastName, phone, address } = req.body;

    // Create object with allowed fields
    type UserUpdateData = {
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
    };
    const updateData: UserUpdateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: updatedUser.role,
          isVerified: updatedUser.isVerified,
          loyaltyPoints: updatedUser.loyaltyPoints,
          loyaltyTier: updatedUser.loyaltyTier,
        },
      },
    });
  }),
);

// Change password
router.patch(
  "/change-password",
  protect,
  asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    // Check if current password and new password exist
    if (!currentPassword || !newPassword) {
      return next(
        new AppError("Please provide current password and new password", 400),
      );
    }

    // Get user from database
    const user = await User.findById(req.user._id);

    // Check if current password is correct
    if (!user.validatePassword(currentPassword)) {
      return next(new AppError("Current password is incorrect", 401));
    }

    // Set new password
    user.setPassword(newPassword);

    // Save user
    await user.save();

    // Generate new JWT token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      status: "success",
      token,
      message: "Password changed successfully",
    });
  }),
);

// Forgot password
router.post(
  "/forgot-password",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError("There is no user with that email address", 404),
      );
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send password reset email with token
    // 🚩 Requires email provider credentials/API key (e.g., SMTP/Nodemailer or SendGrid/Mailgun API)
    // 🚩 Please provide SMTP config or 3rd-party API if you want this step fully integrated!
    // sendPasswordResetEmail(email, resetToken); // Uncomment when implemented

    // Remove logging in production!
    if (process.env.NODE_ENV !== "production") {
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  }),
);

// Reset password
router.patch(
  "/reset-password/:token",
  asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    // Set new password
    user.setPassword(password);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save user
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user._id.toString());

    res.status(200).json({
      status: "success",
      token: jwtToken,
      message: "Password reset successfully",
    });
  }),
);

// Verify email
router.get(
  "/verify-email/:token",
  asyncHandler(async (req, res, next) => {
    const { token } = req.params;

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return next(new AppError("Invalid verification token", 400));
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;

    // Save user
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  }),
);

// Admin routes

// Get all users (admin only)
router.get(
  "/",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -salt");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  }),
);

// Get user by ID (admin only)
router.get(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("-password -salt");

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }),
);

// Update user (admin only)
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      role,
      isVerified,
      loyaltyPoints,
      loyaltyTier,
    } = req.body;

    // Create object with allowed fields
    type AdminUserUpdateData = {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      address?: string;
      role?: string;
      isVerified?: boolean;
      loyaltyPoints?: number;
      loyaltyTier?: string;
    };
    const updateData: AdminUserUpdateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (role) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (loyaltyPoints !== undefined) updateData.loyaltyPoints = loyaltyPoints;
    if (loyaltyTier) updateData.loyaltyTier = loyaltyTier;

    // Update user
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -salt");

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }),
);

// Delete user (admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
);

export default router;
