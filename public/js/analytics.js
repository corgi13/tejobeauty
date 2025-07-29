// analytics.js - Inicijalizacija Analytics Dashboarda

document.addEventListener("DOMContentLoaded", function () {
  // Provjera je li stranica za analitiku
  if (
    window.location.pathname === "/analytics" ||
    document.getElementById("analytics-dashboard")
  ) {
    // Dinamičko učitavanje CSS-a
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "/css/analytics-dashboard.css";
    document.head.appendChild(cssLink);

    // Dohvaćanje podataka s API-ja
    fetch("/api/analytics/dashboard-metrics")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dashboard podaci učitani:", data);
        // Daljnja inicijalizacija kroz modul
        if (window.AnalyticsDashboardPage) {
          const page = new window.AnalyticsDashboardPage();
          page.initialize();
        }
      })
      .catch((error) => {
        console.error("Greška pri učitavanju podataka za dashboard:", error);
      });
  }
});
