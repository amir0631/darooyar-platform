// frontend/src/context/AuthContext.tsx
// Corrected Version

"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import apiClient from '@/lib/api';

// 1. Add the 'avatar' property to the User interface
interface User {
  pk: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  pending_requests_count: number;
  avatar: string | null;
  pharmacy_name: string | null;
  license_number: string | null;
  mobile_number: string | null;
  address_loc: string | null;
}

// 2. Add the 'fetchUser' function to the context type
interface AuthContextType {
  authToken: string | null;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  fetchUser: (token: string) => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Wrap fetchUser in useCallback for stability
  const fetchUser = useCallback(async (token: string) => {
    try {
      apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
      const response = await apiClient.get<User>('/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      // If user fetch fails, token is likely invalid, so log out
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      fetchUser(token);
    }
    setIsLoading(false);
  }, [fetchUser]);

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    await fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  // 4. Expose 'fetchUser' in the provider's value
  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, isLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};