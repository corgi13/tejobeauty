"use client";

import { useState, useEffect } from "react";

import { authService, AuthState } from "../auth";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return authService.login(email, password);
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    return authService.register(userData);
  };

  const logout = () => {
    authService.logout();
  };

  const refreshProfile = async () => {
    return authService.refreshProfile();
  };

  const verifyMfa = async (userId: string, code: string) => {
    // TODO: Implement MFA verification
    return true;
  };

  return {
    ...authState,
    login,
    register,
    logout,
    refreshProfile,
    verifyMfa,
  };
}
