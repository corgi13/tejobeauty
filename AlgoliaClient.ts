import algoliasearch from "algoliasearch";

import type { SearchClient, SearchIndex, SearchOptions } from "algoliasearch";

export class AlgoliaClient {
  private client: SearchClient;
  private index: SearchIndex;

  constructor(appId: string, apiKey: string, indexName: string = "products") {
    this.client = algoliasearch(appId, apiKey);
    this.index = this.client.initIndex(indexName);
  }

  async search(query: string, options: SearchOptions = {}) {
    try {
      return await this.index.search(query, options);
    } catch (error) {
      console.error("Greška pri pretraživanju Algolia:", error);
      throw error;
    }
  }

  async saveObject(object: Record<string, unknown>) {
    try {
      return await this.index.saveObject(object);
    } catch (error) {
      console.error("Greška pri spremanju objekta u Algolia:", error);
      throw error;
    }
  }

  async saveObjects(objects: Record<string, unknown>[]) {
    try {
      return await this.index.saveObjects(objects);
    } catch (error) {
      console.error("Greška pri spremanju objekata u Algolia:", error);
      throw error;
    }
  }

  async deleteObject(objectID: string) {
    try {
      return await this.index.deleteObject(objectID);
    } catch (error) {
      console.error("Greška pri brisanju objekta iz Algolia:", error);
      throw error;
    }
  }

  async setSettings(settings: Record<string, unknown>) {
    try {
      return await this.index.setSettings(settings);
    } catch (error) {
      console.error("Greška pri postavljanju postavki Algolia:", error);
      throw error;
    }
  }
}
