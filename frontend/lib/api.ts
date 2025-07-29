const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as any).Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error:
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    return this.request<{ access_token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request<any>("/auth/profile");
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);

    const query = searchParams.toString();
    return this.request<{
      products: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/products${query ? `?${query}` : ""}`);
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  // Categories endpoints
  async getCategories() {
    return this.request<any[]>("/categories");
  }

  // Orders endpoints
  async createOrder(orderData: {
    shippingAddressId: string;
    billingAddressId?: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    notes?: string;
    discount?: number;
  }) {
    return this.request<any>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders(page = 1, limit = 10) {
    return this.request<{
      orders: any[];
      pagination: any;
    }>(`/orders/my-orders?page=${page}&limit=${limit}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async cancelOrder(id: string) {
    return this.request<any>(`/orders/${id}/cancel`, {
      method: "DELETE",
    });
  }

  // Professional endpoints
  async registerProfessional(data: {
    businessName: string;
    taxId: string;
    commissionRate?: number;
  }) {
    return this.request<any>("/professional/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfessionalProfile() {
    return this.request<any>("/professional/profile");
  }

  async getProfessionalStats() {
    return this.request<any>("/professional/stats");
  }

  async createBulkOrder(data: {
    name: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
  }) {
    return this.request<any>("/professional/bulk-orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyBulkOrders(page = 1, limit = 10) {
    return this.request<{
      bulkOrders: any[];
      pagination: any;
    }>(`/professional/bulk-orders/my?page=${page}&limit=${limit}`);
  }

  async getMyCommissions(page = 1, limit = 10) {
    return this.request<{
      commissions: any[];
      pagination: any;
    }>(`/professional/commissions/my?page=${page}&limit=${limit}`);
  }

  // Search endpoints
  async search(
    query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    const searchParams = new URLSearchParams({ query });
    if (filters?.category) searchParams.set("category", filters.category);
    if (filters?.minPrice)
      searchParams.set("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      searchParams.set("maxPrice", filters.maxPrice.toString());

    return this.request<{
      products: any[];
      total: number;
    }>(`/search?${searchParams.toString()}`);
  }

  // Analytics endpoints (Admin only)
  async getDashboardStats() {
    return this.request<any>("/analytics/dashboard");
  }

  async getSalesData(period: "week" | "month" | "year" = "month") {
    return this.request<any[]>(`/analytics/sales?period=${period}`);
  }

  async getTopProducts(limit = 10) {
    return this.request<any[]>(`/analytics/products/top?limit=${limit}`);
  }

  async getTopCategories(limit = 10) {
    return this.request<any[]>(`/analytics/categories/top?limit=${limit}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
