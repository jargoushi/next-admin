'use client';

import { create } from 'zustand';
import type { User, UserProfile, UserPreferences, Theme } from '@/types';

export interface UserState {
  // 用户列表
  users: User[];
  total: number;
  current: number;
  pageSize: number;

  // 当前用户详细信息
  userProfile: UserProfile | null;
  userPreferences: UserPreferences;

  // 状态
  loading: boolean;
  error: string | null;

  // 操作方法
  setUsers: (users: User[]) => void;
  setTotal: (total: number) => void;
  setCurrent: (current: number) => void;
  setPageSize: (pageSize: number) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 添加用户
  addUser: (user: User) => void;

  // 更新用户
  updateUser: (id: string, userData: Partial<User>) => void;

  // 删除用户
  removeUser: (id: string) => void;

  // 批量删除用户
  removeUsers: (ids: string[]) => void;

  // 重置状态
  reset: () => void;
}

const initialState = {
  users: [],
  total: 0,
  current: 1,
  pageSize: 10,
  userProfile: null,
  userPreferences: {
    theme: 'light' as Theme,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    sidebarCollapsed: false,
    notifications: {
      email: true,
      push: true,
      sms: false,
      system: true,
    },
  },
  loading: false,
  error: null,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  // 设置用户列表
  setUsers: (users) => set({ users }),

  // 设置总数
  setTotal: (total) => set({ total }),

  // 设置当前页
  setCurrent: (current) => set({ current }),

  // 设置每页大小
  setPageSize: (pageSize) => set({ pageSize }),

  // 设置用户详细信息
  setUserProfile: (userProfile) => set({ userProfile }),

  // 设置用户偏好
  setUserPreferences: (userPreferences) => set({ userPreferences }),

  // 设置加载状态
  setLoading: (loading) => set({ loading }),

  // 设置错误信息
  setError: (error) => set({ error }),

  // 添加用户
  addUser: (user) =>
    set((state) => ({
      users: [user, ...state.users],
      total: state.total + 1,
    })),

  // 更新用户
  updateUser: (id, userData) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...userData } : user)),
    })),

  // 删除用户
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      total: Math.max(0, state.total - 1),
    })),

  // 批量删除用户
  removeUsers: (ids) =>
    set((state) => ({
      users: state.users.filter((user) => !ids.includes(user.id)),
      total: Math.max(0, state.total - ids.length),
    })),

  // 重置状态
  reset: () => set(initialState),
}));

// 选择器
export const useUsers = () => useUserStore((state) => state.users);
export const useUserTotal = () => useUserStore((state) => state.total);
export const useUserPagination = () =>
  useUserStore((state) => ({
    current: state.current,
    pageSize: state.pageSize,
  }));
export const useUserProfile = () => useUserStore((state) => state.userProfile);
export const useUserPreferences = () => useUserStore((state) => state.userPreferences);
export const useUserLoading = () => useUserStore((state) => state.loading);
export const useUserError = () => useUserStore((state) => state.error);
