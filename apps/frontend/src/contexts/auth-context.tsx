'use client';

import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { CreateUser } from '@opendevelopment/shared-types';
import * as authApi from '@/lib/api/auth';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (data: CreateUser) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string) => {
    const res = await authApi.login(email);
    localStorage.setItem('auth_token', res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: CreateUser) => {
    const res = await authApi.register(data);
    localStorage.setItem('auth_token', res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
