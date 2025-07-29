import * as dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

import { protect, restrictTo, isAuthenticated } from "../middleware/auth";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import Certification from "../models/Certification";
import Product from "../models/Product";

dotenv.config();

const router = express.Router();

// Get all certifications
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const includeInactive = req.query.includeInactive === "true";
    const type = req.query.type as string;

    // Build query
    const query: any = {};

    // Filter by active status if not explicitly including inactive
    if (!includeInactive) {
      query.isActive = true;
    }

    // Filter by type if specified
    if (type) {
      query.type = type;
    }

    // Execute query
    const certifications = await Certification.find(query).sort("name");

    res.status(200).json({
      status: "success",
      results: certifications.length,
      data: { certifications },
    });
  }),
);

// Get certification by ID
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return next(new AppError("No certification found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { certification },
    });
  }),
);

// Create new certification (admin only)
router.post(
  "/",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res) => {
    const newCertification = await Certification.create(req.body);

    res.status(201).json({
      status: "success",
      data: { certification: newCertification },
    });
  }),
);

// Update certification (admin only)
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!certification) {
      return next(new AppError("No certification found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { certification },
    });
  }),
);

// Delete certification (admin only)
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    // Check if certification is used by any products
    const productsWithCertification = await Product.countDocuments({
      certifications: req.params.id,
    });

    if (productsWithCertification > 0) {
      return next(
        new AppError(
          `Cannot delete certification that is used by ${productsWithCertification} products. Please remove the certification from products first.`,
          400,
        ),
      );
    }

    const certification = await Certification.findByIdAndDelete(req.params.id);

    if (!certification) {
      return next(new AppError("No certification found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),
);

// Sync with EU ECAT API (admin only)
router.post(
  "/sync/ecat",
  protect,
  restrictTo("admin"),
  asyncHandler(async (req, res, next) => {
    // EU ECAT API endpoint
    const EU_ECAT_API_URL =
      process.env.EU_ECAT_API_URL || "https://webgate.ec.europa.eu/ecat/api/v1";

    try {
      // Fetch product groups from EU ECAT API
      const response = await fetch(`${EU_ECAT_API_URL}/productGroups`);

      if (!response.ok) {
        throw new Error(`EU ECAT API error: ${response.statusText}`);
      }

      const productGroups = await response.json();

      // Process each product group
      let syncedCount = 0;

      for (const group of productGroups) {
        // Check if certification already exists
        const existingCert = await Certification.findOne({
          euEcatId: group.id,
        });

        if (existingCert) {
          // Update existing certification
          existingCert.name = `EU Ecolabel - ${group.name}`;
          existingCert.nameEN = `EU Ecolabel - ${group.name}`;
          existingCert.description = group.description || "";
          existingCert.descriptionEN = group.description || "";
          existingCert.verificationUrl = `${EU_ECAT_API_URL}/productGroups/${group.id}`;
          await existingCert.save();
        } else {
          // Create new certification
          await Certification.create({
            name: `EU Ecolabel - ${group.name}`,
            nameEN: `EU Ecolabel - ${group.name}`,
            code: `EUECOLABEL-${group.id}`,
            type: "eco",
            description: group.description || "",
            descriptionEN: group.description || "",
            color: "#0F8A5F", // EU Ecolabel green
            euEcatId: group.id,
            verificationUrl: `${EU_ECAT_API_URL}/productGroups/${group.id}`,
          });
        }

        syncedCount++;
      }

      res.status(200).json({
        status: "success",
        message: `Successfully synced ${syncedCount} certifications from EU ECAT API`,
        data: {
          syncedCount,
          totalGroups: productGroups.length,
        },
      });
    } catch (error) {
      console.error("EU ECAT API sync error:", error);
      return next(
        new AppError(`Failed to sync with EU ECAT API: ${error.message}`, 500),
      );
    }
  }),
);

// Get products by certification
router.get(
  "/:id/products",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return next(new AppError("No certification found with that ID", 404));
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = Product.find({ certifications: req.params.id });

    // Professional products filtering
    if (
      !req.user ||
      (req.user.role !== "professional" && req.user.role !== "admin")
    ) {
      query = query.find({ professionalOnly: { $ne: true } });
    }

    // Execute query with pagination
    const products = await query.skip(skip).limit(limit);
    const total = await Product.countDocuments({
      certifications: req.params.id,
    });

    res.status(200).json({
      status: "success",
      results: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        certification,
        products,
      },
    });
  }),
);

// Get sustainability statistics
router.get(
  "/stats/sustainability",
  asyncHandler(async (req, res) => {
    // Count sustainable products
    const sustainableProductsCount = await Product.countDocuments({
      isSustainable: true,
    });

    // Count products by certification type
    const ecoProductsCount = await Product.countDocuments({
      certifications: {
        $in: await Certification.find({ type: "eco" }).distinct("_id"),
      },
    });

    const crueltyFreeProductsCount = await Product.countDocuments({
      certifications: {
        $in: await Certification.find({ type: "cruelty-free" }).distinct("_id"),
      },
    });

    const carbonNeutralProductsCount = await Product.countDocuments({
      certifications: {
        $in: await Certification.find({ type: "carbon-neutral" }).distinct(
          "_id",
        ),
      },
    });

    // Calculate average sustainability score
    const avgScoreResult = await Product.aggregate([
      { $match: { sustainabilityScore: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: "$sustainabilityScore" } } },
    ]);

    const avgSustainabilityScore =
      avgScoreResult.length > 0
        ? Math.round(avgScoreResult[0].avgScore * 10) / 10
        : 0;

    // Calculate total carbon footprint reduction
    // This is a simplified calculation - in a real app, you would have more detailed data
    const totalCarbonReduction = carbonNeutralProductsCount * 50; // Assuming 50kg CO2 reduction per carbon-neutral product

    res.status(200).json({
      status: "success",
      data: {
        sustainableProductsCount,
        ecoProductsCount,
        crueltyFreeProductsCount,
        carbonNeutralProductsCount,
        avgSustainabilityScore,
        totalCarbonReduction,
        carbonReductionUnit: "kg CO2",
      },
    });
  }),
);

export default router;
