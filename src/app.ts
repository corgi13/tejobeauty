// app.ts - Konfiguracija Express aplikacije odvojena od pokretanja servera
import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

// API rute
import analyticsApi from "./api/analyticsApi";
import categoryApi from "./api/categoryApi";
import certificationApi from "./api/certificationApi";
import loyaltyApi from "./api/loyaltyApi";
import orderApi from "./api/orderApi";
import productApi from "./api/productApi";
import productsRouter from "./api/products";
import recommendationsRouter from "./api/recommendations";
import reviewApi from "./api/reviewApi";
import searchApi from "./api/searchApi";
import userApi from "./api/userApi";

// Middleware
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";

// Učitavanje varijabli okruženja
dotenv.config();

// Inicijalizacija __dirname za ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicijalizacija Express aplikacije
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'"],
      },
    },
  }),
);

// Logging middleware
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Statički direktorij
app.use(express.static(path.join(__dirname, "../public")));

// API rute
app.use("/api/search", searchApi);
app.use("/api/analytics", analyticsApi);
app.use("/api/products", productApi);
app.use("/api/users", userApi);
app.use("/api/orders", orderApi);
app.use("/api/categories", categoryApi);
app.use("/api/reviews", reviewApi);
app.use("/api/loyalty", loyaltyApi);
app.use("/api/certifications", certificationApi);
app.use("/api/products", productsRouter);
app.use("/api/recommendations", recommendationsRouter);

// Glavna ruta
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Ruta nije pronađena" });
});

export default app;
