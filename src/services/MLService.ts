// MLService.ts - Servis za strojno učenje
export class MLService {
  private modelEndpoint: string;
  private apiKey: string;

  constructor(modelEndpoint: string, apiKey: string) {
    this.modelEndpoint = modelEndpoint;
    this.apiKey = apiKey;
  }

  async predict(data: {
    userHistory: any[];
    userBrowsingHistory?: any[];
    collaborativeFiltering: any[];
    currentProduct?: number;
  }): Promise<any[]> {
    try {
      const response = await fetch(this.modelEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Problem s ML API-jem");
      }

      const recommendations = await response.json();
      return this.postProcessRecommendations(recommendations);
    } catch (error) {
      console.error("Greška pri dohvaćanju ML preporuka:", error);
      // Fallback na jednostavniju metodu preporuka ako ML servis nije dostupan
      return this.getFallbackRecommendations(data);
    }
  }

  async getCollaborativeFiltering(userId: string) {
    // Implementacija collaborative filtering algoritma
    // Ovo bi moglo biti zamijenjeno s pozivom vanjskom servisu

    try {
      const response = await fetch(
        `${this.modelEndpoint}/collaborative-filtering`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({ userId }),
        },
      );

      return await response.json();
    } catch (error) {
      console.error(
        "Greška pri dohvaćanju collaborative filtering podataka:",
        error,
      );
      return [];
    }
  }

  private postProcessRecommendations(recommendations: any[]) {
    // Uklanjanje duplikata i sortiranje po relevantnosti
    const uniqueRecommendations = [
      ...new Map(
        recommendations.map((item) => [item.productId, item]),
      ).values(),
    ];

    return uniqueRecommendations.sort((a, b) => b.score - a.score);
  }

  private getFallbackRecommendations(data: any) {
    // Jednostavna implementacija preporuka kao fallback
    // Na temelju najčešće kupovanih proizvoda iz korisničke povijesti
    const productCounts = {};

    data.userHistory.forEach((purchase) => {
      purchase.products.forEach((product) => {
        productCounts[product.id] = (productCounts[product.id] || 0) + 1;
      });
    });

    const recommendations = Object.entries(productCounts)
      .map(([productId, count]) => ({
        productId: parseInt(productId),
        score: count / data.userHistory.length,
        source: "history",
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return recommendations;
  }
}
