// PersonalizedSearch.ts - Komponenta za personaliziranu pretragu
import { SearchOptions, SearchResult } from "../models/SearchTypes";
import { SearchService } from "../services/SearchService";

export class PersonalizedSearch {
  private searchService: SearchService;
  private userId: string | null = null;
  private lastSearch: SearchOptions | null = null;
  private searchResults: SearchResult | null = null;
  private isLoading: boolean = false;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
    this.initializeUI();
  }

  setUserId(userId: string | null) {
    this.userId = userId;
    // Ako je korisnik logiran, osvježi rezultate s personalizacijom
    if (userId && this.lastSearch) {
      this.search(this.lastSearch.query, this.lastSearch.filters);
    }
  }

  async search(query: string, filters: any = {}) {
    try {
      this.isLoading = true;
      this.updateLoadingState();

      this.lastSearch = { query, filters };
      this.searchResults = await this.searchService.searchProducts(
        query,
        filters,
        this.userId || undefined,
      );

      this.renderResults(this.searchResults);
      // Prati korisničku aktivnost pretrage
      if (this.userId) {
        this.trackSearchAction(query, filters);
      }
    } catch (error) {
      console.error("Greška pri pretraživanju:", error);
      this.showError("Došlo je do greške prilikom pretraživanja.");
    } finally {
      this.isLoading = false;
      this.updateLoadingState();
    }
  }

  async getRecommendations(productId?: number) {
    if (!this.userId) {
      return [];
    }

    try {
      return await this.searchService.getRecommendations(
        this.userId,
        productId,
      );
    } catch (error) {
      console.error("Greška pri dohvaćanju preporuka:", error);
      return [];
    }
  }

  private initializeUI() {
    // Inicijalizacija UI elemenata za pretragu
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById(
      "search-input",
    ) as HTMLInputElement;
    const filterElements = document.querySelectorAll("[data-filter]");

    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const filters = this.collectFilters();
        this.search(searchInput.value, filters);
      });
    }

    // Postavljanje osluškivača na filtere
    filterElements.forEach((element) => {
      element.addEventListener("change", () => {
        if (searchInput.value) {
          const filters = this.collectFilters();
          this.search(searchInput.value, filters);
        }
      });
    });
  }

  private collectFilters() {
    const filters: any = {};
    const categorySelect = document.getElementById(
      "category-filter",
    ) as HTMLSelectElement;
    const brandSelect = document.getElementById(
      "brand-filter",
    ) as HTMLSelectElement;
    const priceRange = document.getElementById(
      "price-range",
    ) as HTMLInputElement;

    if (categorySelect && categorySelect.value) {
      filters.category = categorySelect.value;
    }

    if (brandSelect && brandSelect.value) {
      filters.brand = brandSelect.value;
    }

    if (priceRange && priceRange.value) {
      const [min, max] = priceRange.value.split("-").map(Number);
      filters.priceRange = { min, max };
    }

    return filters;
  }

  private renderResults(results: SearchResult) {
    const resultsContainer = document.getElementById("search-results");
    if (!resultsContainer) return;

    if (results.hits.length === 0) {
      resultsContainer.innerHTML =
        '<p class="no-results">Nema rezultata za vaš upit.</p>';
      return;
    }

    const resultsHTML = results.hits
      .map(
        (product) => `
      <div class="product-card" data-product-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">
            ${
              product.originalPrice > product.price
                ? `<span class="original-price">${product.originalPrice.toFixed(2)}€</span>`
                : ""
            }
            <span class="current-price">${product.price.toFixed(2)}€</span>
          </div>
          <div class="product-rating">
            <span class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</span>
            <span class="reviews">(${product.reviews})</span>
          </div>
          ${product.relevanceScore ? '<div class="relevance-badge">Personalizirano</div>' : ""}
          <button class="btn add-to-cart" data-product-id="${product.id}">Dodaj u košaricu</button>
        </div>
      </div>
    `,
      )
      .join("");

    resultsContainer.innerHTML = resultsHTML;

    // Dodavanje osluškivača događaja na gumbe
    const addToCartButtons = resultsContainer.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = (e.currentTarget as HTMLElement).getAttribute(
          "data-product-id",
        );
        if (productId) {
          this.handleAddToCart(parseInt(productId));
        }
      });
    });

    // Dodavanje osluškivača za praćenje pregledavanja proizvoda
    const productCards = resultsContainer.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!(e.target as HTMLElement).classList.contains("add-to-cart")) {
          const productId = (e.currentTarget as HTMLElement).getAttribute(
            "data-product-id",
          );
          if (productId) {
            this.handleProductView(parseInt(productId));
          }
        }
      });
    });
  }

  private updateLoadingState() {
    const searchButton = document.querySelector(
      '#search-form button[type="submit"]',
    );
    const loadingIndicator = document.getElementById("loading-indicator");

    if (searchButton) {
      (searchButton as HTMLButtonElement).disabled = this.isLoading;
    }

    if (loadingIndicator) {
      loadingIndicator.style.display = this.isLoading ? "block" : "none";
    }
  }

  private showError(message: string) {
    const errorContainer = document.getElementById("search-error");
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = "block";

      // Sakrij poruku nakon 5 sekundi
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 5000);
    }
  }

  private async trackSearchAction(query: string, filters: any) {
    if (!this.userId) return;

    try {
      await fetch("/api/track-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "search",
          userId: this.userId,
          data: { query, filters },
        }),
      });
    } catch (error) {
      console.error("Greška pri praćenju pretrage:", error);
    }
  }

  private async handleAddToCart(productId: number) {
    // Implementacija dodavanja u košaricu
    if (this.userId) {
      try {
        await fetch("/api/track-action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "addToCart",
            userId: this.userId,
            productId,
          }),
        });
      } catch (error) {
        console.error("Greška pri praćenju dodavanja u košaricu:", error);
      }
    }
  }

  private async handleProductView(productId: number) {
    // Implementacija pregledavanja proizvoda
    if (this.userId) {
      try {
        await fetch("/api/track-action", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "view",
            userId: this.userId,
            productId,
          }),
        });
      } catch (error) {
        console.error("Greška pri praćenju pregledavanja proizvoda:", error);
      }
    }
  }
}
