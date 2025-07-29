// index.ts - Glavni ulaz za backend aplikaciju
import dotenv from "dotenv";

import app from "./app";
import { connectToDatabase, disconnectFromDatabase } from "./config/database";
import logger from "./utils/logger";

// Učitavanje varijabli okruženja
dotenv.config();

const PORT = process.env.PORT || 3000;

// Funkcija za inicijalizaciju servera
async function startServer() {
  try {
    // Povezivanje s bazom podataka
    await connectToDatabase();
    logger.info("Uspješno povezivanje s bazom podataka");

    // Pokretanje servera
    const server = app.listen(PORT, () => {
      logger.info(`Server je pokrenut na portu ${PORT}`);
      logger.info(`Okruženje: ${process.env.NODE_ENV}`);
    });

    // Rukovanje nepredviđenim greškama
    process.on("uncaughtException", (error) => {
      logger.error("Nepredviđena greška:", {
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

    // Rukovanje neuhvaćenim Promise odbijanjima
    process.on("unhandledRejection", (reason: Error) => {
      logger.error("Neuhvaćeno Promise odbijanje:", {
        reason: reason.message,
        stack: reason.stack,
      });
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal primljen: zatvaranje HTTP servera");
      server.close(async () => {
        await disconnectFromDatabase();
        logger.info("HTTP server zatvoren, veza s bazom podataka prekinuta");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT signal primljen: zatvaranje HTTP servera");
      server.close(async () => {
        await disconnectFromDatabase();
        logger.info("HTTP server zatvoren, veza s bazom podataka prekinuta");
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    logger.error("Greška pri pokretanju servera:", { error });
    process.exit(1);
  }
}

// Pokreni server
startServer();

// Za testiranje i korištenje u drugim modulima
export default app;
