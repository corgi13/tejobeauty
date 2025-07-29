// AnalyticsDashboardPage.ts - Stranica za analytics dashboard
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";
import { AnalyticsService } from "../services/AnalyticsService";
import { UserRepository } from "../services/UserRepository";

export class AnalyticsDashboardPage {
  private analyticsService: AnalyticsService;
  private dashboard: AnalyticsDashboard;

  constructor() {
    // Inicijalizacija potrebnih servisa
    const db = this.initializeDatabase();
    const userRepository = new UserRepository(db);
    this.analyticsService = new AnalyticsService(db, userRepository);
    this.dashboard = new AnalyticsDashboard(this.analyticsService);
  }

  async initialize(): Promise<void> {
    this.setupLayout();
    await this.dashboard.initialize("analytics-dashboard");
  }

  private setupLayout(): void {
    const appElement = document.getElementById("app");
    if (appElement) {
      appElement.innerHTML = `
        <div class="analytics-page">
          <header class="main-header">
            <div class="logo">Tejo Nails</div>
            <nav class="main-nav">
              <ul>
                <li><a href="/">Početna</a></li>
                <li><a href="/products">Proizvodi</a></li>
                <li><a href="/orders">Narudžbe</a></li>
                <li><a href="/analytics" class="active">Analitika</a></li>
                <li><a href="/settings">Postavke</a></li>
              </ul>
            </nav>
            <div class="user-menu">
              <img src="/images/avatar.jpg" alt="Admin" class="avatar">
              <span>Admin</span>
            </div>
          </header>

          <main class="main-content">
            <div class="page-header">
              <h1>Analitika poslovanja</h1>
              <div class="actions">
                <button id="export-report" class="btn btn-primary">Izvezi izvještaj</button>
                <button id="print-dashboard" class="btn btn-secondary">Ispiši</button>
              </div>
            </div>

            <div id="analytics-dashboard" class="dashboard-wrapper">
              <!-- Ovdje će se generirati dashboard -->
            </div>
          </main>

          <footer class="main-footer">
            <p>&copy; 2025 Tejo Nails Platform. Sva prava pridržana.</p>
          </footer>
        </div>
      `;

      // Dodavanje događaja za gumbe
      const exportButton = document.getElementById("export-report");
      const printButton = document.getElementById("print-dashboard");

      if (exportButton) {
        exportButton.addEventListener("click", this.exportReport.bind(this));
      }

      if (printButton) {
        printButton.addEventListener("click", this.printDashboard.bind(this));
      }
    }
  }

  private exportReport(): void {
    alert("Izvještaj će biti preuzet kao PDF datoteka (demo funkcionalnost)");
    // U stvarnoj implementaciji, ovo bi generiralo i preuzelo PDF izvještaj
  }

  private printDashboard(): void {
    window.print();
  }

  private initializeDatabase() {
    // Mock implementacija baze podataka za demo svrhe
    return {
      orders: {
        find: async (query: any) => {
          // Simulacija dohvaćanja narudžbi iz baze
          return Array.from({ length: 35 }, (_, i) => ({
            id: `order${i}`,
            userId: `user${i % 10}`,
            products: Array.from(
              { length: Math.floor(Math.random() * 4) + 1 },
              (_, j) => ({
                id: Math.floor(Math.random() * 20) + 1,
                quantity: Math.floor(Math.random() * 3) + 1,
                price: (Math.random() * 30 + 10).toFixed(2),
              }),
            ),
            totalAmount: (Math.random() * 200 + 50).toFixed(2),
            date: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ),
            status: "completed",
          }));
        },
        countDocuments: async () => Math.floor(Math.random() * 100) + 50,
        distinct: async () =>
          Array.from(
            { length: Math.floor(Math.random() * 50) + 20 },
            (_, i) => `user${i}`,
          ),
      },
      userActions: {
        find: async () => {
          return Array.from({ length: 25 }, (_, i) => ({
            userId: `user${i % 10}`,
            action:
              i % 3 === 0 ? "view" : i % 3 === 1 ? "addToCart" : "purchase",
            productId: Math.floor(Math.random() * 20) + 1,
            timestamp: new Date(
              Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000,
            ),
          }));
        },
        distinct: async () =>
          Array.from(
            { length: Math.floor(Math.random() * 100) + 50 },
            (_, i) => `user${i}`,
          ),
      },
      users: {
        findOne: async (query: any) => ({
          id: query.id,
          preferences: {
            categories: ["Lakovi za nokte", "Maske za lice"],
            brands: ["OPI", "The Ordinary"],
            priceRange: { min: 0, max: 50 },
            colors: ["#DC143C", "#FFB6C1"],
          },
        }),
      },
    };
  }
}

// Inicijalizacija stranice kada se DOM učita
document.addEventListener("DOMContentLoaded", () => {
  const page = new AnalyticsDashboardPage();
  page.initialize();
});
