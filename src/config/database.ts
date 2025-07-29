// config/database.ts - Konfiguracija baze podataka
import mongoose from "mongoose";

import config from "./config";
import logger from "../utils/logger";

// Opcije povezivanja s MongoDB
const connectOptions: mongoose.ConnectOptions = {
  ...config.mongodb.options,
  autoIndex: config.env === "development", // Automatsko indeksiranje samo u developmentu
};

/**
 * Funkcija za povezivanje s MongoDB bazom podataka
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  try {
    mongoose.set("strictQuery", false);
    // config/database.ts - Konfiguracija baze podataka
    import mongoose from "mongoose";

    import config from "./config";
    import logger from "../utils/logger";

    // Opcije povezivanja s MongoDB
    const connectOptions: mongoose.ConnectOptions = {
      ...config.mongodb.options,
      autoIndex: config.env === "development", // Automatsko indeksiranje samo u developmentu
    };

    /**
     * Funkcija za povezivanje s MongoDB bazom podataka
     */
    export const connectToDatabase = async (): Promise<typeof mongoose> => {
      try {
        mongoose.set("strictQuery", false);

        // Ako već postoji aktivna veza, vrati postojeću
        if (mongoose.connection.readyState === 1) {
          logger.info("Korištenje postojeće MongoDB veze");
          return mongoose;
        }

        const connection = await mongoose.connect(
          config.mongodb.uri,
          connectOptions,
        );
        logger.info(
          `Uspješno povezivanje s MongoDB bazom: ${config.mongodb.uri}`,
        );

        // Postavi event listenere
        setupConnectionListeners();

        return connection;
      } catch (error) {
        logger.error("Greška pri povezivanju s MongoDB bazom:", { error });
        throw error;
      }
    };

    /**
     * Funkcija za prekid veze s MongoDB bazom podataka
     */
    export const disconnectFromDatabase = async (): Promise<void> => {
      try {
        await mongoose.disconnect();
        logger.info("Veza s MongoDB bazom prekinuta");
      } catch (error) {
        logger.error("Greška pri prekidu veze s MongoDB bazom:", { error });
        throw error;
      }
    };

    /**
     * Postavljanje event listenera za MongoDB vezu
     */
    function setupConnectionListeners() {
      mongoose.connection.on("connected", () => {
        logger.info("Mongoose povezan s MongoDB bazom");
      });

      mongoose.connection.on("error", (err) => {
        logger.error("Greška u Mongoose vezi:", { error: err });
      });

      mongoose.connection.on("disconnected", () => {
        logger.info("Mongoose prekinuo vezu s MongoDB bazom");
      });

      mongoose.connection.on("reconnected", () => {
        logger.info("Mongoose ponovno povezan s MongoDB bazom");
      });
    }

    export default mongoose;
    // Ako već postoji aktivna veza, vrati postojeću
    if (mongoose.connection.readyState === 1) {
      logger.info("Korištenje postojeće MongoDB veze");
      return mongoose;
    }

    const connection = await mongoose.connect(
      config.mongodb.uri,
      connectOptions,
    );
    logger.info(`Uspješno povezivanje s MongoDB bazom: ${config.mongodb.uri}`);

    // Postavi event listenere
    setupConnectionListeners();

    return connection;
  } catch (error) {
    logger.error("Greška pri povezivanju s MongoDB bazom:", { error });
    throw error;
  }
};

/**
 * Funkcija za prekid veze s MongoDB bazom podataka
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("Veza s MongoDB bazom prekinuta");
  } catch (error) {
    logger.error("Greška pri prekidu veze s MongoDB bazom:", { error });
    throw error;
  }
};

/**
 * Postavljanje event listenera za MongoDB vezu
 */
function setupConnectionListeners() {
  mongoose.connection.on("connected", () => {
    logger.info("Mongoose povezan s MongoDB bazom");
  });
  // config/database.ts - Konfiguracija i upravljanje vezom prema bazi podataka
  import mongoose from "mongoose";

  import logger from "../utils/logger";

  /**
   * Uspostavlja vezu s MongoDB bazom podataka
   */
  export const connectToDatabase = async (): Promise<void> => {
    try {
      const uri =
        process.env.MONGO_URI || "mongodb://138.199.226.201:27017/tejo-nails";

      // Opcije za povezivanje
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      // Povezivanje na bazu
      await mongoose.connect(uri);

      logger.info("Uspješno povezivanje s MongoDB bazom");
    } catch (error) {
      logger.error("Greška pri povezivanju s MongoDB bazom:", { error });
      throw error;
    }
  };

  /**
   * Prekida vezu s MongoDB bazom podataka
   */
  export const disconnectFromDatabase = async (): Promise<void> => {
    try {
      await mongoose.disconnect();
      logger.info("Uspješno prekinuta veza s MongoDB bazom");
    } catch (error) {
      logger.error("Greška pri prekidu veze s MongoDB bazom:", { error });
      throw error;
    }
  };
  mongoose.connection.on("error", (err) => {
    logger.error("Greška u Mongoose vezi:", { error: err });
  });

  mongoose.connection.on("disconnected", () => {
    logger.info("Mongoose prekinuo vezu s MongoDB bazom");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("Mongoose ponovno povezan s MongoDB bazom");
  });
}

export default mongoose;
