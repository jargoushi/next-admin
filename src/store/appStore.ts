'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppState {
  // 应用主题
  theme: 'light' | 'dark' | 'auto';

  // 侧边栏状态
  sidebarCollapsed: boolean;

  // 全局加载状态
  globalLoading: boolean;

  // 面包屑导航
  breadcrumbs: Array<{
    title: string;
    path?: string;
  }>;

  // 当前页面信息
  pageTitle: string;
  pageDescription?: string;

  // 通知消息
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    timestamp: number;
  }>;

  // 操作方法
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ title: string; path?: string }>) => void;
  setPageTitle: (title: string, description?: string) => void;

  // 通知操作
  addNotification: (notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // 重置状态
  reset: () => void;
}

const initialState = {
  theme: 'light' as const,
  sidebarCollapsed: false,
  globalLoading: false,
  breadcrumbs: [],
  pageTitle: '',
  pageDescription: '',
  notifications: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 设置主题
      setTheme: (theme) => set({ theme }),

      // 设置侧边栏状态
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      // 设置全局加载状态
      setGlobalLoading: (globalLoading) => set({ globalLoading }),

      // 设置面包屑导航
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      // 设置页面信息
      setPageTitle: (pageTitle, pageDescription) => set({ pageTitle, pageDescription }),

      // 添加通知
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = {
          ...notification,
          id,
          timestamp: Date.now(),
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // 自动移除通知
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 3000);
        }
      },

      // 移除通知
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // 清除所有通知
      clearNotifications: () => set({ notifications: [] }),

      // 重置状态
      reset: () => set(initialState),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// 选择器
export const useTheme = () => useAppStore((state) => state.theme);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
export const useGlobalLoading = () => useAppStore((state) => state.globalLoading);
export const useBreadcrumbs = () => useAppStore((state) => state.breadcrumbs);
export const usePageInfo = () =>
  useAppStore((state) => ({
    title: state.pageTitle,
    description: state.pageDescription,
  }));
export const useNotifications = () => useAppStore((state) => state.notifications);
