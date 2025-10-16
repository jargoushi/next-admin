// Store 统一导出

export {
  useAuthStore,
  useAuthUser,
  useAuthToken,
  useAuthPermissions,
  useAuthLoading,
  useAuthError,
} from './authStore';
export {
  useUserStore,
  useUsers,
  useUserTotal,
  useUserPagination,
  useUserProfile,
  useUserPreferences,
  useUserLoading,
  useUserError,
} from './userStore';
export {
  useAppStore,
  useTheme,
  useSidebarCollapsed,
  useGlobalLoading,
  useBreadcrumbs,
  usePageInfo,
  useNotifications,
} from './appStore';

// 重新导出类型
export type { AuthState } from './authStore';
export type { UserState } from './userStore';
export type { AppState } from './appStore';
