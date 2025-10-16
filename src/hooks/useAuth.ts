'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { clearAuth, isAuthenticated } from '@/lib/auth';
import type { User, LoginRequest } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { user, setUser, setLoading, loading, error } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          // 这里可以添加获取用户信息的逻辑
          setLoading(false);
        } catch {
          clearAuth();
        }
      } else {
        setLoading(false);
      }
      setIsInitialized(true);
    };

    initAuth();
  }, [setLoading]);

  // 登录
  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      // 这里添加实际的登录逻辑
      // const response = await authApi.login(credentials);
      // setUser(response.user);
      // saveTokens(response.tokens);

      // 临时模拟登录成功
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: 'user@example.com',
        role: 'admin' as User['role'],
        status: 'active' as User['status'],
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };

      setUser(mockUser);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    setLoading(true);
    try {
      // 这里可以添加实际的登出逻辑
      // await authApi.logout();

      clearAuth();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 检查权限
  const hasPermission = (): boolean => {
    // 这里添加权限检查逻辑
    return true; // 临时返回 true
  };

  // 检查角色
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return {
    user,
    loading,
    error,
    isInitialized,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    hasRole,
  };
}
