import { apiClient } from "./api";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "CUSTOMER" | "PROFESSIONAL" | "MANAGER" | "ADMIN";
  isEmailVerified: boolean;
  language: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private static instance: AuthService;
  private listeners: Array<(state: AuthState) => void> = [];
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Check if we're in the browser environment
      if (typeof window === "undefined") {
        this.setState({ ...this.state, isLoading: false });
        return;
      }

      const token = localStorage.getItem("auth_token");
      if (token) {
        apiClient.setToken(token);
        const response = await apiClient.getProfile();

        if (response.data) {
          this.setState({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          this.clearAuth();
        }
      } else {
        this.setState({ ...this.state, isLoading: false });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      this.clearAuth();
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState(): AuthState {
    return this.state;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: string;
    mfaRequired?: boolean;
    userId?: string;
  }> {
    try {
      this.setState({ ...this.state, isLoading: true });

      const response = await apiClient.login(email, password);

      if (response.data) {
        const { access_token, user } = response.data;

        await this.setSecureToken(access_token);

        this.setState({
          user,
          token: 'secure-token',
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        this.setState({ ...this.state, isLoading: false });
        // Check if MFA is required (this would come from the API response)
        if (response.error === "MFA_REQUIRED") {
          return {
            success: false,
            mfaRequired: true,
            userId: "temp-user-id", // This should come from API
            error: response.error,
          };
        }
        return { success: false, error: response.error || "Login failed" };
      }
    } catch (error) {
      this.setState({ ...this.state, isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      this.setState({ ...this.state, isLoading: true });

      const response = await apiClient.register(userData);

      if (response.data) {
        const { access_token, user } = response.data;

        await this.setSecureToken(access_token);

        this.setState({
          user,
          token: 'secure-token',
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } else {
        this.setState({ ...this.state, isLoading: false });
        return {
          success: false,
          error: response.error || "Registration failed",
        };
      }
    } catch (error) {
      this.setState({ ...this.state, isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }

  logout() {
    this.clearAuth();
  }

  private clearAuth() {
    this.clearSecureToken();
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    apiClient.setToken("");
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  private async setSecureToken(token: string): Promise<void> {
    try {
      await fetch('/api/auth/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'same-origin'
      });
    } catch (error) {
      console.error('Failed to set secure token:', error);
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }
      apiClient.setToken(token);
    }
  }

  private async clearSecureToken(): Promise<void> {
    try {
      await fetch('/api/auth/clear-token', {
        method: 'POST',
        credentials: 'same-origin'
      });
    } catch (error) {
      console.error('Failed to clear secure token:', error);
    }
  }

  private getTokenFromStorage(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  async refreshProfile(): Promise<boolean> {
    try {
      const response = await apiClient.getProfile();
      if (response.data) {
        this.setState({ ...this.state, user: response.data });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Profile refresh error:", error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
