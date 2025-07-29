import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AppError, asyncHandler } from "./errorHandler";
import User from "../models/User";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Protect routes - verify token and set req.user
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in. Please log in to get access.",
          401,
        ),
      );
    }

    // 2) Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401),
      );
    }

    // 4) Set user on request
    req.user = user;
    next();
  },
);

// Restrict to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(
          "You are not logged in. Please log in to get access.",
          401,
        ),
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403),
      );
    }

    next();
  };
};

// Check if user is authenticated (optional)
export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      // No token, but that's ok - just continue without setting req.user
      return next();
    }

    try {
      // 2) Verify token
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // 3) Check if user still exists
      const user = await User.findById(decoded.id);
      if (user) {
        // 4) Set user on request
        req.user = user;
      }
    } catch (error) {
      // Invalid token, but that's ok for this middleware
    }

    next();
  },
);
