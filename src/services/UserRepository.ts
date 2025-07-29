// UserRepository.ts - Repozitorij za korisničke podatke
export class UserRepository {
  private db: any; // Pretpostavka da imate neki tip baze podataka

  constructor(db: any) {
    this.db = db;
  }

  async getPreferences(userId: string): Promise<{
    categories: string[];
    brands: string[];
    priceRange: { min: number; max: number };
    colors: string[];
  }> {
    // Dohvaćanje korisničkih preferencija iz baze podataka
    const userData = await this.db.users.findOne({ id: userId });

    return {
      categories: userData?.preferences?.categories || [],
      brands: userData?.preferences?.brands || [],
      priceRange: userData?.preferences?.priceRange || {
        min: 0,
        max: Infinity,
      },
      colors: userData?.preferences?.colors || [],
    };
  }

  async getBehavior(userId: string) {
    // Dohvaćanje korisničkog ponašanja
    const viewedProducts = await this.db.userActions
      .find({
        userId,
        action: "view",
        timestamp: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // zadnjih 30 dana
      })
      .map((action) => action.productId);

    const addedToCart = await this.db.userActions
      .find({
        userId,
        action: "addToCart",
        timestamp: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      })
      .map((action) => action.productId);

    return {
      viewedProducts,
      addedToCart,
    };
  }

  async getPurchaseHistory(userId: string) {
    // Dohvaćanje povijesti kupovine
    return this.db.orders.find({
      userId,
      status: "completed",
      orderDate: { $gt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // zadnjih godinu dana
    });
  }

  async getBrowsingHistory(userId: string) {
    // Dohvaćanje povijesti pregledavanja
    return this.db.userActions.find({
      userId,
      action: "view",
      timestamp: { $gt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }, // zadnjih 15 dana
    });
  }

  async updateUserPreferences(userId: string, preferences: any) {
    // Ažuriranje korisničkih preferencija
    await this.db.users.updateOne({ id: userId }, { $set: { preferences } });
  }

  async trackUserAction(userId: string, action: string, productId: number) {
    // Bilježenje korisničke akcije
    await this.db.userActions.insertOne({
      userId,
      action,
      productId,
      timestamp: new Date(),
    });
  }
}
