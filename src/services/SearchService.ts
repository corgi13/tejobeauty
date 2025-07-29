// SearchService.ts - Napredna pretraga s AI personalizacijom
import { MLService } from "./MLService";
import { UserRepository } from "./UserRepository";
import { AlgoliaClient } from "../../AlgoliaClient";

export class SearchService {
  private algoliaClient: AlgoliaClient;
  private mlService: MLService;
  private userRepository: UserRepository;

  constructor(
    algoliaClient: AlgoliaClient,
    mlService: MLService,
    userRepository: UserRepository,
  ) {
    this.algoliaClient = algoliaClient;
    this.mlService = mlService;
    this.userRepository = userRepository;
  }

  async searchProducts(query: string, filters: any, userId?: string) {
    // Implementacija Algolia pretrage
    const searchResults = await this.algoliaClient.search(query, {
      filters: this.buildFilters(filters),
      facets: ["kategorija", "brend", "cijena"],
      hitsPerPage: 24,
    });

    // AI personalizacija rezultata
    if (userId) {
      const personalizedResults = await this.personalizeResults(
        searchResults,
        userId,
      );
      return personalizedResults;
    }

    return searchResults;
  }

  async getRecommendations(userId: string, productId?: number) {
    // Dohvaćanje povijesti korisnika
    const userHistory = await this.getUserPurchaseHistory(userId);
    const userBrowsingHistory = await this.getUserBrowsingHistory(userId);
    const collaborativeFiltering =
      await this.getCollaborativeRecommendations(userId);

    // ML preporuke
    const recommendations = await this.mlService.predict({
      userHistory,
      userBrowsingHistory,
      collaborativeFiltering,
      currentProduct: productId,
    });

    return recommendations;
  }

  private async personalizeResults(results: any, userId: string) {
    const userPreferences = await this.getUserPreferences(userId);
    const userBehavior = await this.getUserBehavior(userId);

    // Ponovno rangiranje rezultata prema korisničkim preferencijama
    return results.hits
      .map((hit) => ({
        ...hit,
        relevanceScore: this.calculatePersonalizedScore(
          hit,
          userPreferences,
          userBehavior,
        ),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private buildFilters(filters: any): string {
    // Pretvaranje objekata filtera u Algolia format
    let filterString = "";
    // SearchService.ts - Servis za pretraživanje i dohvaćanje preporuka proizvoda
    import { ProductRecommendation } from "../models/SearchTypes";

    export class SearchService {
      private apiBaseUrl: string;

      constructor(apiBaseUrl: string = "/api") {
        this.apiBaseUrl = apiBaseUrl;
      }

      /**
       * Dohvaća preporuke proizvoda za određenog korisnika
       * @param userId ID korisnika
       * @param productId Opcionalni ID proizvoda za kontekstualne preporuke
       * @returns Promise s listom preporuka proizvoda
       */
      async getRecommendations(
        userId: string,
        productId?: number,
      ): Promise<ProductRecommendation[]> {
        try {
          let url = `${this.apiBaseUrl}/recommendations?userId=${encodeURIComponent(userId)}`;

          if (productId) {
            url += `&productId=${productId}`;
          }

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          throw error;
        }
      }

      /**
       * Pretražuje proizvode prema upitu
       * @param query Tekst za pretraživanje
       * @param filters Opcionalni filtri za pretraživanje
       * @returns Promise s rezultatima pretraživanja
       */
      async searchProducts(query: string, filters?: Record<string, any>) {
        try {
          let url = `${this.apiBaseUrl}/search?q=${encodeURIComponent(query)}`;

          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                url += `&${key}=${encodeURIComponent(String(value))}`;
              }
            });
          }

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error("Error searching products:", error);
          throw error;
        }
      }
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const valueFilters = value.map((v) => `${key}:${v}`).join(" OR ");
        filterString += `(${valueFilters}) AND `;
      } else {
        filterString += `${key}:${value} AND `;
      }
    });

    return filterString.endsWith(" AND ")
      ? filterString.slice(0, -5)
      : filterString;
  }

  private async getUserPreferences(userId: string) {
    return this.userRepository.getPreferences(userId);
  }

  private async getUserBehavior(userId: string) {
    return this.userRepository.getBehavior(userId);
  }

  private async getUserPurchaseHistory(userId: string) {
    return this.userRepository.getPurchaseHistory(userId);
  }

  private async getUserBrowsingHistory(userId: string) {
    return this.userRepository.getBrowsingHistory(userId);
  }

  private async getCollaborativeRecommendations(userId: string) {
    return this.mlService.getCollaborativeFiltering(userId);
  }

  private calculatePersonalizedScore(
    product: any,
    userPreferences: any,
    userBehavior: any,
  ): number {
    let score = product._score || 1.0; // Osnovni score

    // Povećaj score ako proizvod odgovara preferiranim kategorijama
    if (userPreferences.categories.includes(product.category)) {
      score *= 1.5;
    }

    // Povećaj score ako proizvod odgovara preferiranim brendovima
    if (userPreferences.brands.includes(product.brand)) {
      score *= 1.3;
    }

    // Utjecaj korisničkog ponašanja
    const interactionWeight = userBehavior.viewedProducts.includes(product.id)
      ? 1.2
      : 1;
    score *= interactionWeight;

    // Sezonalnost i trendovi
    if (product.trending) {
      score *= 1.1;
    }

    return score;
  }
}
