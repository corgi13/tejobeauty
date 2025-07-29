// ProductRecommendations.ts - Komponenta za prikaz preporuka proizvoda
import { ProductRecommendation } from "../models/SearchTypes";
import { SearchService } from "../services/SearchService";

export class ProductRecommendations {
  private searchService: SearchService;
  private userId: string | null = null;
  private containerId: string;
  private isLoading: boolean = false;

  constructor(
    searchService: SearchService,
    containerId: string = "product-recommendations",
  ) {
    this.searchService = searchService;
    this.containerId = containerId;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
    // Osvježi preporuke ako je korisnik logiran
    if (userId) {
      this.loadRecommendations();
    } else {
      this.clearRecommendations();
    }
  }

  async loadRecommendations(productId?: number) {
    if (!this.userId) {
      this.renderNotLoggedIn();
      return;
    }

    try {
      this.isLoading = true;
      this.updateLoadingState();

      const recommendations = await this.searchService.getRecommendations(
        this.userId,
        productId,
      );
      this.renderRecommendations(recommendations);
    } catch (error) {
      console.error("Greška pri dohvaćanju preporuka:", error);
      this.showError("Došlo je do greške prilikom dohvaćanja preporuka.");
    } finally {
      this.isLoading = false;
      this.updateLoadingState();
    }
  }

  private renderRecommendations(recommendations: ProductRecommendation[]) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (recommendations.length === 0) {
      container.innerHTML =
        '<p class="no-recommendations">Trenutno nema dostupnih preporuka.</p>';
      return;
    }

    const title = document.createElement("h2");
    title.textContent = "Preporuke za vas";
    title.className = "recommendations-title";

    const productList = document.createElement("div");
    productList.className = "product-recommendations-list";

    recommendations.forEach((recommendation) => {
      // Za ovu implementaciju, pretpostavljamo da dohvaćamo dodatne detalje o proizvodu
      fetch(`/api/products/${recommendation.productId}`)
        .then((response) => response.json())
        .then((product) => {
          const productElement = document.createElement("div");
          productElement.className = "recommended-product";
          productElement.dataset.productId =
            recommendation.productId.toString();

          productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
              <h3 class="product-name">${product.name}</h3>
              <div class="product-price">${product.price.toFixed(2)}€</div>
              ${
                recommendation.source === "collaborative"
                  ? '<div class="recommendation-badge">Korisnici slični vama su kupili</div>'
                  : '<div class="recommendation-badge">Na temelju vaše povijesti</div>'
              }
              <button class="btn view-product" data-product-id="${product.id}">Pogledaj proizvod</button>
            </div>
          `;

          productList.appendChild(productElement);

          // Dodavanje osluškivača događaja
          const viewButton = productElement.querySelector(".view-product");
          if (viewButton) {
            viewButton.addEventListener("click", () => {
              window.location.href = `/product/${product.id}`;
            });
          }
        })
        .catch((error) => {
          console.error("Greška pri dohvaćanju detalja proizvoda:", error);
        });
    });

    container.innerHTML = "";
    container.appendChild(title);
    container.appendChild(productList);
  }

  private renderNotLoggedIn() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="login-prompt">
        <h3>Personalizirane preporuke</h3>
        <p>Prijavite se da biste vidjeli preporuke prilagođene vašim preferencijama.</p>
        <button class="btn login-btn">Prijava</button>
      </div>
    `;

    const loginButton = container.querySelector(".login-btn");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        window.location.href = "/login";
      });
    }
  }

  private clearRecommendations() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = "";
    }
  }

  private updateLoadingState() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (this.isLoading) {
      container.innerHTML =
        '<div class="loading-spinner">Učitavanje preporuka...</div>';
    }
  }

  private showError(message: string) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `<div class="error-message">${message}</div>`;
  }
}
