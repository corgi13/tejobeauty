// SearchTypes.ts - Tipovi za pretraživanje i preporuke
// SearchTypes.ts - Tipovi za pretraživanje i personalizaciju

export interface SearchOptions {
  query: string;
  filters?: any;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  relevanceScore?: number;
}

export interface SearchResult {
  hits: Product[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  facets?: any;
}
export interface SearchFilter {
  category?: string | string[];
  brand?: string | string[];
  priceRange?: { min: number; max: number };
  colors?: string[];
  [key: string]: any;
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilter;
  page?: number;
  hitsPerPage?: number;
  sortBy?: string;
  facets?: string[];
  userId?: string;
}
// SearchTypes.ts - Tipovi podataka za pretraživanje i preporuke

/**
 * Tip koji predstavlja preporuku proizvoda
 */
export interface ProductRecommendation {
  /**
   * Jedinstveni identifikator proizvoda
   */
  productId: number;

  /**
   * Izvor preporuke (npr. 'collaborative', 'history', 'trending')
   */
  source: "collaborative" | "history" | "trending" | string;

  /**
   * Ocjena relevantnosti preporuke (veći broj znači veća relevantnost)
   */
  relevanceScore: number;
}

/**
 * Tip koji predstavlja rezultat pretraživanja proizvoda
 */
export interface SearchResult {
  /**
   * Jedinstveni identifikator proizvoda
   */
  id: number;

  /**
   * Naziv proizvoda
   */
  name: string;

  /**
   * Cijena proizvoda
   */
  price: number;

  /**
   * URL slike proizvoda
   */
  image: string;

  /**
   * Kategorija proizvoda
   */
  category: string;

  /**
   * Ocjena proizvoda (1-5)
   */
  rating?: number;
}
export interface SearchResult {
  hits: any[];
  page: number;
  nbHits: number;
  nbPages: number;
  hitsPerPage: number;
  facets?: any;
  processingTimeMS: number;
}

export interface PersonalizedHit extends Record<string, any> {
  id: number;
  relevanceScore: number;
  _score?: number;
}

export interface UserPreference {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  colors: string[];
  [key: string]: any;
}

export interface UserBehavior {
  viewedProducts: number[];
  addedToCart: number[];
  [key: string]: any;
}

export interface PurchaseHistory {
  id: string;
  userId: string;
  products: {
    id: number;
    quantity: number;
    price: number;
    [key: string]: any;
  }[];
  totalAmount: number;
  date: Date;
  [key: string]: any;
}

export interface ProductRecommendation {
  productId: number;
  score: number;
  source: string;
  [key: string]: any;
}
