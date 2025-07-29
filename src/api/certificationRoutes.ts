import express from "express";

import { CertificationType } from "../models/Certification";
import CertificationService from "../services/CertificationService";

const router = express.Router();

/**
 * @route GET /api/certifications
 * @desc Dohvati sve certifikate
 */
router.get("/", async (req, res) => {
  try {
    const certifications = await CertificationService.getAllCertifications();
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: "Greška pri dohvatu certifikata", error });
  }
});

/**
 * @route GET /api/certifications/type/:type
 * @desc Dohvati certifikate po tipu
 */
router.get("/type/:type", async (req, res) => {
  try {
    const type = req.params.type as CertificationType;
    if (!Object.values(CertificationType).includes(type)) {
      return res.status(400).json({ message: "Nevažeći tip certifikata" });
    }

    const certifications =
      await CertificationService.getCertificationsByType(type);
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: "Greška pri dohvatu certifikata", error });
  }
});

/**
 * @route GET /api/certifications/co2-savings
 * @desc Dohvati ukupnu CO2 uštedu
 */
router.get("/co2-savings", async (req, res) => {
  try {
    const totalSavings = await CertificationService.calculateTotalCO2Savings();
    res.json({ totalSavingsKg: totalSavings });
  } catch (error) {
    res.status(500).json({ message: "Greška pri izračunu CO2 uštede", error });
  }
});

/**
 * @route POST /api/certifications/sync
 * @desc Sinkroniziraj certifikate s vanjskim API-jima
 * @access Private - Admin only
 */
router.post("/sync", async (req, res) => {
  try {
    await CertificationService.syncEUEcolabelCertifications();
    res.json({ message: "Certifikati uspješno sinkronizirani" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greška pri sinkronizaciji certifikata", error });
  }
});

export default router;
