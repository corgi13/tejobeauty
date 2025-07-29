// AnalyticsDashboard.ts - Komponenta za prikazivanje analitike
import {
  AnalyticsService,
  AnalyticsDashboardMetrics,
  RealtimeMetrics,
} from "../services/AnalyticsService";

export class AnalyticsDashboard {
  private analyticsService: AnalyticsService;
  private dashboardElement: HTMLElement | null = null;
  private realtimeInterval: number | null = null;
  private updateInterval: number = 60000; // Osvježavanje svakih 60 sekundi
  private isInitialized: boolean = false;
  private activeTab: "overview" | "sales" | "products" | "users" = "overview";

  constructor(analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService;
  }

  async initialize(
    dashboardElementId: string = "analytics-dashboard",
  ): Promise<void> {
    this.dashboardElement = document.getElementById(dashboardElementId);

    if (!this.dashboardElement) {
      console.error("Element za dashboard nije pronađen");
      return;
    }

    this.isInitialized = true;
    this.renderDashboardStructure();
    await this.loadDashboardData();
    this.setupEventListeners();
    this.startRealtimeUpdates();
  }

  private renderDashboardStructure(): void {
    if (!this.dashboardElement) return;

    this.dashboardElement.innerHTML = `
      <div class="dashboard-container">
        <header class="dashboard-header">
          <h1>Tejo Nails Analitika</h1>
          <div class="realtime-indicator">
            <span class="pulse-dot"></span> Podaci u stvarnom vremenu
          </div>
        </header>

        <nav class="dashboard-tabs">
          <ul>
            <li><a href="#" data-tab="overview" class="active">Pregled</a></li>
            <li><a href="#" data-tab="sales">Prodaja</a></li>
            <li><a href="#" data-tab="products">Proizvodi</a></li>
            <li><a href="#" data-tab="users">Korisnici</a></li>
          </ul>
        </nav>

        <div class="realtime-metrics-container">
          <div class="realtime-metric">
            <h3>Trenutno online</h3>
            <div id="online-users" class="metric-value">--</div>
          </div>
          <div class="realtime-metric">
            <h3>Aktivne narudžbe</h3>
            <div id="active-orders" class="metric-value">--</div>
          </div>
          <div class="realtime-metric">
            <h3>Prihod danas</h3>
            <div id="today-revenue" class="metric-value">--</div>
          </div>
          <div class="realtime-metric">
            <h3>Stopa konverzije</h3>
            <div id="conversion-rate" class="metric-value">--</div>
          </div>
        </div>

        <div class="dashboard-content">
          <div id="overview-tab" class="tab-content active">
            <div class="metrics-container">
              <div class="metric-card total-revenue">
                <h3>Ukupni prihod (30 dana)</h3>
                <div class="metric-value">--</div>
                <div class="metric-trend"></div>
              </div>
              <div class="metric-card total-orders">
                <h3>Ukupno narudžbi</h3>
                <div class="metric-value">--</div>
                <div class="metric-trend"></div>
              </div>
              <div class="metric-card active-users">
                <h3>Aktivnih korisnika</h3>
                <div class="metric-value">--</div>
                <div class="metric-trend"></div>
              </div>
              <div class="metric-card conversion-rate">
                <h3>Stopa konverzije</h3>
                <div class="metric-value">--</div>
                <div class="metric-trend"></div>
              </div>
            </div>

            <div class="chart-container">
              <div class="chart" id="revenue-chart">
                <h3>Prihod tijekom vremena</h3>
                <div class="chart-content">Graf prihoda će biti ovdje</div>
              </div>
              <div class="chart" id="category-chart">
                <h3>Prodaja po kategorijama</h3>
                <div class="chart-content">Graf kategorija će biti ovdje</div>
              </div>
            </div>
          </div>

          <div id="sales-tab" class="tab-content">
            <h2>Analiza prodaje</h2>
            <div class="sales-filters">
              <select id="sales-timeframe">
                <option value="daily">Dnevno</option>
                <option value="weekly">Tjedno</option>
                <option value="monthly">Mjesečno</option>
              </select>
            </div>
            <div id="sales-chart" class="full-chart">
              <div class="chart-content">Detaljan graf prodaje će biti ovdje</div>
            </div>
          </div>

          <div id="products-tab" class="tab-content">
            <h2>Analiza proizvoda</h2>
            <div class="top-products">
              <h3>Najprodavaniji proizvodi</h3>
              <div class="products-table-container">
                <table id="top-products-table">
                  <thead>
                    <tr>
                      <th>Proizvod</th>
                      <th>Kategorija</th>
                      <th>Prodaja</th>
                      <th>Prihod</th>
                      <th>Prosječna ocjena</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="5">Učitavanje...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div id="users-tab" class="tab-content">
            <h2>Analiza korisnika</h2>
            <div class="users-overview">
              <div class="user-metric">
                <h3>Stopa zadržavanja</h3>
                <div id="retention-rate" class="large-metric">--</div>
              </div>
              <div class="user-metric">
                <h3>Izvori akvizicije</h3>
                <div id="acquisition-chart" class="chart-content">Graf izvora akvizicije će biti ovdje</div>
              </div>
              <div class="user-metric">
                <h3>Demografija (dob)</h3>
                <div id="demographics-chart" class="chart-content">Graf demografije će biti ovdje</div>
              </div>
            </div>
          </div>
        </div>

        <footer class="dashboard-footer">
          <div class="last-updated">Zadnje osvježeno: <span id="last-updated-time">--</span></div>
        </footer>
      </div>
    `;
  }

  private async loadDashboardData(): Promise<void> {
    try {
      const metrics = await this.analyticsService.getDashboardMetrics();
      const realtimeMetrics = await this.analyticsService.getRealtimeMetrics();

      this.updateDashboardMetrics(metrics);
      this.updateRealtimeMetrics(realtimeMetrics);

      // Učitaj dodatne podatke ovisno o aktivnom tabu
      await this.loadTabData(this.activeTab);
    } catch (error) {
      console.error("Greška pri učitavanju podataka za dashboard:", error);
      this.showError(
        "Greška pri učitavanju podataka. Pokušajte ponovno osvježiti stranicu.",
      );
    }
  }

  private async loadTabData(
    tab: "overview" | "sales" | "products" | "users",
  ): Promise<void> {
    switch (tab) {
      case "overview":
        // Već učitano u loadDashboardData
        await this.loadRevenueChart("daily");
        break;

      case "sales":
        const timeframe =
          (document.getElementById("sales-timeframe") as HTMLSelectElement)
            ?.value || "daily";
        await this.loadRevenueChart(
          timeframe as "daily" | "weekly" | "monthly",
        );
        break;

      case "products":
        await this.loadTopProductsTable();
        break;

      case "users":
        await this.loadUserAnalytics();
        break;
    }
  }

  private async loadRevenueChart(
    timeframe: "daily" | "weekly" | "monthly",
  ): Promise<void> {
    try {
      const revenueData =
        await this.analyticsService.getRevenueOverTime(timeframe);

      // Ovdje bi trebala biti implementacija za crtanje grafa s Chart.js ili sličnom bibliotekom
      // Za potrebe demonstracije, samo ćemo prikazati podatke u tekstualnom obliku
      const chartElement = document.getElementById(
        this.activeTab === "overview" ? "revenue-chart" : "sales-chart",
      );
      if (chartElement) {
        const chartContent = chartElement.querySelector(".chart-content");
        if (chartContent) {
          chartContent.innerHTML = `
            <div style="height: 200px; background-color: #f8f9fa; padding: 1rem; border-radius: 8px;">
              <p style="margin: 0;">Graf prihoda za ${timeframe} period</p>
              <p style="margin: 0; font-size: 0.8rem; color: #6c757d;">${revenueData.length} točaka podataka</p>
              <div style="height: 150px; display: flex; align-items: flex-end;">
                ${revenueData
                  .slice(0, 15)
                  .map((point) => {
                    const height = (point.revenue / 1500) * 100;
                    return `
                    <div style="flex: 1; margin: 0 2px;">
                      <div style="height: ${height}%; background-color: #0d6efd; border-radius: 2px 2px 0 0;"></div>
                      <div style="font-size: 0.6rem; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${point.date}</div>
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
          `;
        }
      }
    } catch (error) {
      console.error("Greška pri učitavanju podataka o prihodima:", error);
    }
  }

  private async loadTopProductsTable(): Promise<void> {
    const tableElement = document.getElementById("top-products-table");
    if (!tableElement) return;

    try {
      const metrics = await this.analyticsService.getDashboardMetrics();
      const topProducts = metrics.topProducts;

      const tableBody = tableElement.querySelector("tbody");
      if (tableBody) {
        if (topProducts.length === 0) {
          tableBody.innerHTML =
            '<tr><td colspan="5">Nema dostupnih podataka</td></tr>';
          return;
        }

        tableBody.innerHTML = topProducts
          .map(
            (product) => `
          <tr>
            <td>
              <div class="product-cell">
                <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                <span>${product.name}</span>
              </div>
            </td>
            <td>${product.category}</td>
            <td>${Math.floor(Math.random() * 100 + 10)} kom</td>
            <td>${(product.price * Math.floor(Math.random() * 100 + 10)).toFixed(2)} €</td>
            <td>
              <div class="rating">
                <span class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</span>
                <span class="reviews">(${product.reviews})</span>
              </div>
            </td>
          </tr>
        `,
          )
          .join("");
      }
    } catch (error) {
      console.error("Greška pri učitavanju top proizvoda:", error);
      if (tableElement.querySelector("tbody")) {
        tableElement.querySelector("tbody")!.innerHTML =
          '<tr><td colspan="5">Greška pri učitavanju podataka</td></tr>';
      }
    }
  }

  private async loadUserAnalytics(): Promise<void> {
    try {
      const userAnalytics = await this.analyticsService.getUserAnalytics();

      // Prikaži stopu zadržavanja
      const retentionElement = document.getElementById("retention-rate");
      if (retentionElement) {
        retentionElement.textContent = `${userAnalytics.retention.toFixed(1)}%`;
      }

      // Prikaži izvore akvizicije (jednostavan prikaz)
      const acquisitionElement = document.getElementById("acquisition-chart");
      if (acquisitionElement) {
        acquisitionElement.innerHTML = `
          <div style="height: 200px; padding: 1rem;">
            ${userAnalytics.acquisitionSources
              .map(
                (source) => `
              <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <div style="width: 150px;">${source.source}</div>
                <div style="flex-grow: 1; height: 20px; background-color: #e9ecef; border-radius: 4px;">
                  <div style="width: ${source.percentage}%; height: 100%; background-color: #0d6efd; border-radius: 4px;"></div>
                </div>
                <div style="width: 60px; text-align: right;">${source.percentage.toFixed(1)}%</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      }

      // Prikaži demografske podatke (jednostavan prikaz)
      const demographicsElement = document.getElementById("demographics-chart");
      if (demographicsElement) {
        demographicsElement.innerHTML = `
          <div style="height: 200px; padding: 1rem; display: flex; align-items: flex-end;">
            ${userAnalytics.demographics
              .map(
                (demo) => `
              <div style="flex: 1; text-align: center; padding: 0 0.25rem;">
                <div style="height: ${demo.percentage * 2}px; background-color: #0d6efd; border-radius: 4px 4px 0 0;"></div>
                <div style="margin-top: 0.5rem;">${demo.age}</div>
                <div style="font-size: 0.8rem; color: #6c757d;">${demo.percentage}%</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      }
    } catch (error) {
      console.error("Greška pri učitavanju korisničke analitike:", error);
    }
  }

  private updateDashboardMetrics(metrics: AnalyticsDashboardMetrics): void {
    // Ažuriranje osnovnih metrika
    const totalRevenueElement = document.querySelector(
      ".metric-card.total-revenue .metric-value",
    );
    const totalOrdersElement = document.querySelector(
      ".metric-card.total-orders .metric-value",
    );
    const activeUsersElement = document.querySelector(
      ".metric-card.active-users .metric-value",
    );
    const conversionRateElement = document.querySelector(
      ".metric-card.conversion-rate .metric-value",
    );

    if (totalRevenueElement)
      totalRevenueElement.textContent = `${metrics.totalRevenue.toFixed(2)} €`;
    if (totalOrdersElement)
      totalOrdersElement.textContent = metrics.totalOrders.toString();
    if (activeUsersElement)
      activeUsersElement.textContent = metrics.activeUsers.toString();
    if (conversionRateElement)
      conversionRateElement.textContent = `${metrics.conversionRate.toFixed(1)}%`;

    // Ažuriranje grafova po kategorijama
    const categoryChartElement = document.getElementById("category-chart");
    if (categoryChartElement) {
      const chartContent = categoryChartElement.querySelector(".chart-content");
      if (chartContent && metrics.salesByCategory.length > 0) {
        chartContent.innerHTML = `
          <div style="height: 200px; padding: 1rem;">
            ${metrics.salesByCategory
              .map(
                (category) => `
              <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <div style="width: 120px;">${category.category}</div>
                <div style="flex-grow: 1; height: 20px; background-color: #e9ecef; border-radius: 4px;">
                  <div style="width: ${category.percentage}%; height: 100%; background-color: #198754; border-radius: 4px;"></div>
                </div>
                <div style="width: 100px; text-align: right;">${category.sales.toFixed(2)} € (${category.percentage.toFixed(1)}%)</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      }
    }

    // Ažuriranje vremena zadnjeg osvježavanja
    const lastUpdatedElement = document.getElementById("last-updated-time");
    if (lastUpdatedElement) {
      lastUpdatedElement.textContent =
        metrics.lastUpdated.toLocaleString("hr-HR");
    }
  }

  private updateRealtimeMetrics(metrics: RealtimeMetrics): void {
    const onlineUsersElement = document.getElementById("online-users");
    const activeOrdersElement = document.getElementById("active-orders");
    const todayRevenueElement = document.getElementById("today-revenue");
    const conversionRateElement = document.getElementById("conversion-rate");

    if (onlineUsersElement)
      onlineUsersElement.textContent = metrics.onlineUsers.toString();
    if (activeOrdersElement)
      activeOrdersElement.textContent = metrics.activeOrders.toString();
    if (todayRevenueElement)
      todayRevenueElement.textContent = `${metrics.todayRevenue.toFixed(2)} €`;
    if (conversionRateElement)
      conversionRateElement.textContent = `${metrics.conversionRate.toFixed(1)}%`;
  }

  private setupEventListeners(): void {
    // Postavljanje osluškivača za tabove
    const tabLinks = document.querySelectorAll(".dashboard-tabs a");
    tabLinks.forEach((link) => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();

        const target = e.currentTarget as HTMLElement;
        const tabName = target.getAttribute("data-tab") as
          | "overview"
          | "sales"
          | "products"
          | "users";

        // Ažuriranje aktivnog taba
        this.activeTab = tabName;

        // Ažuriranje klasa za aktivne tabove
        tabLinks.forEach((link) => link.classList.remove("active"));
        target.classList.add("active");

        // Sakrivanje/prikazivanje sadržaja tabova
        const tabContents = document.querySelectorAll(".tab-content");
        tabContents.forEach((content) => content.classList.remove("active"));
        document.getElementById(`${tabName}-tab`)?.classList.add("active");

        // Učitavanje podataka za tab
        await this.loadTabData(tabName);
      });
    });

    // Postavljanje osluškivača za vremenski okvir prodaje
    const salesTimeframeSelect = document.getElementById("sales-timeframe");
    if (salesTimeframeSelect) {
      salesTimeframeSelect.addEventListener("change", async () => {
        const timeframe = (salesTimeframeSelect as HTMLSelectElement).value as
          | "daily"
          | "weekly"
          | "monthly";
        await this.loadRevenueChart(timeframe);
      });
    }
  }

  private startRealtimeUpdates(): void {
    // Osvježavanje realtime podataka svake minute
    this.realtimeInterval = window.setInterval(async () => {
      try {
        const realtimeMetrics =
          await this.analyticsService.getRealtimeMetrics();
        this.updateRealtimeMetrics(realtimeMetrics);
      } catch (error) {
        console.error("Greška pri dohvaćanju realtime metrika:", error);
      }
    }, this.updateInterval) as unknown as number;
  }

  private showError(message: string): void {
    if (!this.dashboardElement) return;

    const errorElement = document.createElement("div");
    errorElement.className = "dashboard-error";
    errorElement.textContent = message;

    // Dodavanje elementa za grešku na početak dashboard-a
    this.dashboardElement.insertBefore(
      errorElement,
      this.dashboardElement.firstChild,
    );

    // Automatsko uklanjanje poruke nakon 5 sekundi
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }

  public destroy(): void {
    // Čišćenje intervala i ostalih resursa
    if (this.realtimeInterval !== null) {
      clearInterval(this.realtimeInterval);
      this.realtimeInterval = null;
    }

    if (this.dashboardElement) {
      this.dashboardElement.innerHTML = "";
    }

    this.isInitialized = false;
  }
}
