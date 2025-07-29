// AlgoliaClient.ts - Klijent za Algolia servis
import algoliasearch, { SearchClient, SearchIndex } from "algoliasearch";

import logger from "./logger";

/**
 * Klasa za integraciju s Algolia pretraživačkim servisom
 */
export class AlgoliaClient {
  private client: SearchClient;
  private index: SearchIndex;

  /**
   * Inicijalizira Algolia klijent s odgovarajućim parametrima
   * @param appId Algolia aplikacijski ID
   * @param apiKey Algolia API ključ
   * @param indexName Naziv indeksa (zadano: 'products')
   */
  constructor(appId: string, apiKey: string, indexName: string = "products") {
    this.client = algoliasearch(appId, apiKey);
    this.index = this.client.initIndex(indexName);
    logger.info(`Algolia klijent inicijaliziran za indeks: ${indexName}`);
  }

  /**
   * Pretražuje indeks prema upitu i opcijama
   * @param query Upit za pretraživanje
   * @param options Opcije za pretraživanje
   */
  async search(query: string, options: any = {}) {
    try {
      // Postavke za pretraživanje
      const searchOptions: any = {
        hitsPerPage: options.hitsPerPage || 20,
        page: options.page || 0,
      };

      // Dodavanje filtera ako postoje
      if (options.filters) {
        searchOptions.filters = options.filters;
      }

      // Dodavanje faceta ako postoje
      if (options.facets) {
        searchOptions.facets = options.facets;
      }

      // Dodatne opcije
      if (options.attributesToRetrieve) {
        searchOptions.attributesToRetrieve = options.attributesToRetrieve;
      }

      if (options.attributesToHighlight) {
        searchOptions.attributesToHighlight = options.attributesToHighlight;
      }

      // Izvrši pretragu
      logger.debug(`Izvršavanje Algolia pretrage za upit: "${query}"`, {
        options: searchOptions,
      });
      const results = await this.index.search(query, searchOptions);
      return results;
    } catch (error) {
      logger.error("Greška prilikom Algolia pretrage:", { error, query });
      throw error;
    }
  }

  /**
   * Dohvaća objekte prema njihovim ID-jevima
   * @param objectIDs Lista ID-jeva objekata za dohvaćanje
   */
  async getObjects(objectIDs: string[]) {
    try {
      logger.debug(`Dohvaćanje ${objectIDs.length} objekata iz Algolia`);
      const results = await this.index.getObjects(objectIDs);
      return results;
    } catch (error) {
      logger.error("Greška prilikom dohvaćanja Algolia objekata:", {
        error,
        objectIDs,
      });
      throw error;
    }
  }

  /**
   * Sprema jedan objekt u Algolia indeks
   * @param object Objekt za spremanje
   */
  async saveObject(object: any) {
    try {
      logger.debug("Spremanje objekta u Algolia", {
        objectID: object.objectID,
      });
      const result = await this.index.saveObject(object);
      return result;
    } catch (error) {
      logger.error("Greška prilikom spremanja Algolia objekta:", {
        error,
        objectID: object.objectID,
      });
      throw error;
    }
  }

  /**
   * Sprema više objekata u Algolia indeks
   * @param objects Lista objekata za spremanje
   */
  async saveObjects(objects: any[]) {
    try {
      logger.debug(`Spremanje ${objects.length} objekata u Algolia`);
      const result = await this.index.saveObjects(objects);
      return result;
    } catch (error) {
      logger.error("Greška prilikom spremanja Algolia objekata:", {
        error,
        count: objects.length,
      });
      throw error;
    }
  }

  /**
   * Briše objekt iz Algolia indeksa prema ID-u
   * @param objectID ID objekta za brisanje
   */
  async deleteObject(objectID: string) {
    try {
      logger.debug("Brisanje objekta iz Algolia", { objectID });
      const result = await this.index.deleteObject(objectID);
      return result;
    } catch (error) {
      logger.error("Greška prilikom brisanja objekta iz Algolia:", {
        error,
        objectID,
      });
      throw error;
    }
  }

  /**
   * Postavlja konfiguraciju indeksa
   * @param settings Postavke indeksa
   */
  async setSettings(settings: any) {
    try {
      logger.debug("Postavljanje Algolia postavki", { settings });
      const result = await this.index.setSettings(settings);
      return result;
    } catch (error) {
      logger.error("Greška prilikom postavljanja Algolia postavki:", { error });
      throw error;
    }
  }
}
