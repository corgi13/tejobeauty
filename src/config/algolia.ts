// config/algolia.ts - Konfiguracija za Algolia pretraživanje
import algoliasearch from "algoliasearch";

import config from "./config";
import { ExternalServiceError } from "../utils/errorTypes";
import logger from "../utils/logger";

// Provjeri jesu li postavljene konfiguracijske varijable
if (!config.algolia.appId || !config.algolia.apiKey) {
  logger.warn("Algolia konfiguracijske varijable nisu postavljene!");
}

/**
 * Klasa za Algolia pretraživački servis
 */
export class AlgoliaService {
  private client: ReturnType<typeof algoliasearch>;
  private indices: Record<string, ReturnType<typeof algoliasearch.initIndex>>;

  constructor() {
    this.client = algoliasearch(config.algolia.appId, config.algolia.apiKey);
    this.indices = {};

    // Inicijaliziraj glavni indeks proizvoda
    this.indices.products = this.client.initIndex(config.algolia.indexName);

    logger.info("Algolia servis inicijaliziran");
  }

  /**
   * Dohvati Algolia indeks
   */
  getIndex(indexName: string = "products") {
    if (!this.indices[indexName]) {
      this.indices[indexName] = this.client.initIndex(indexName);
    }
    return this.indices[indexName];
  }

  /**
   * Pretraži proizvode
   */
  async search(query: string, options: any = {}) {
    try {
      const index = this.getIndex(options.indexName || "products");
      const searchOptions: any = {
        hitsPerPage: options.hitsPerPage || 20,
        page: options.page || 0,
      };

      if (options.filters) {
        searchOptions.filters = options.filters;
      }

      if (options.facets) {
        searchOptions.facets = options.facets;
      }

      if (options.attributesToRetrieve) {
        searchOptions.attributesToRetrieve = options.attributesToRetrieve;
      }

      if (options.attributesToHighlight) {
        searchOptions.attributesToHighlight = options.attributesToHighlight;
      }

      if (options.restrictSearchableAttributes) {
        searchOptions.restrictSearchableAttributes =
          options.restrictSearchableAttributes;
      }

      return await index.search(query, searchOptions);
    } catch (error) {
      logger.error("Algolia pretraživanje nije uspjelo:", {
        error,
        query,
        options,
      });
      throw new ExternalServiceError("Algolia", "Pretraživanje nije uspjelo");
    }
  }

  /**
   * Dohvati objekte po ID-u
   */
  async getObjects(objectIDs: string[], indexName: string = "products") {
    try {
      const index = this.getIndex(indexName);
      return await index.getObjects(objectIDs);
    } catch (error) {
      logger.error("Dohvaćanje Algolia objekata nije uspjelo:", {
        error,
        objectIDs,
      });
      throw new ExternalServiceError(
        "Algolia",
        "Dohvaćanje objekata nije uspjelo",
      );
    }
  }

  /**
   * Spremi jedan objekt u indeks
   */
  async saveObject(object: any, indexName: string = "products") {
    try {
      const index = this.getIndex(indexName);
      return await index.saveObject(object);
    } catch (error) {
      logger.error("Spremanje Algolia objekta nije uspjelo:", {
        error,
        object,
      });
      throw new ExternalServiceError(
        "Algolia",
        "Spremanje objekta nije uspjelo",
      );
    }
  }

  /**
   * Spremi više objekata u indeks
   */
  async saveObjects(objects: any[], indexName: string = "products") {
    try {
      const index = this.getIndex(indexName);
      return await index.saveObjects(objects);
    } catch (error) {
      logger.error("Spremanje Algolia objekata nije uspjelo:", {
        error,
        count: objects.length,
      });
      throw new ExternalServiceError(
        "Algolia",
        "Spremanje objekata nije uspjelo",
      );
    }
  }

  /**
   * Obriši objekt iz indeksa
   */
  async deleteObject(objectID: string, indexName: string = "products") {
    try {
      const index = this.getIndex(indexName);
      return await index.deleteObject(objectID);
    } catch (error) {
      logger.error("Brisanje Algolia objekta nije uspjelo:", {
        error,
        objectID,
      });
      throw new ExternalServiceError(
        "Algolia",
        "Brisanje objekta nije uspjelo",
      );
    }
  }

  /**
   * Konfiguriraj indeks (postavke za pretraživanje, filtriranje itd.)
   */
  async configureIndex(settings: any, indexName: string = "products") {
    try {
      const index = this.getIndex(indexName);
      return await index.setSettings(settings);
    } catch (error) {
      logger.error("Konfiguracija Algolia indeksa nije uspjela:", {
        error,
        indexName,
      });
      throw new ExternalServiceError(
        "Algolia",
        "Konfiguracija indeksa nije uspjela",
      );
    }
  }
}

// Singleton instanca
export const algoliaService = new AlgoliaService();

// Za kompatibilnost s postojećim kodom
export const algoliaClient = algoliasearch(
  config.algolia.appId,
  config.algolia.apiKey,
);
export const productsIndex = algoliaClient.initIndex(config.algolia.indexName);
export const algoliaConfig = {
  appId: config.algolia.appId,
  apiKey: config.algolia.apiKey,
  indexName: config.algolia.indexName,
};

export default algoliaService;
