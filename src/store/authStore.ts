'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Permission } from '@/types';

export interface AuthState {
  // 用户信息
  user: User | null;
  token: string | null;
  refreshToken: string | null;

  // 权限信息
  permissions: Permission[];

  // 状态
  loading: boolean;
  error: string | null;

  // 操作方法
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setPermissions: (permissions: Permission[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 清除认证信息
  clearAuth: () => void;

  // 更新用户信息
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 初始状态
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      loading: false,
      error: null,

      // 设置用户信息
      setUser: (user) => set({ user }),

      // 设置令牌
      setToken: (token) => set({ token }),

      // 设置刷新令牌
      setRefreshToken: (refreshToken) => set({ refreshToken }),

      // 设置权限
      setPermissions: (permissions) => set({ permissions }),

      // 设置加载状态
      setLoading: (loading) => set({ loading }),

      // 设置错误信息
      setError: (error) => set({ error }),

      // 清除认证信息
      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          permissions: [],
          error: null,
        }),

      // 更新用户信息
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        permissions: state.permissions,
      }),
    }
  )
);

// 选择器
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthPermissions = () => useAuthStore((state) => state.permissions);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () => useAuthStore((state) => state.error);
