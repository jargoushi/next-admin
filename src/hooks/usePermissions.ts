'use client';

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useAuthStore } from '@/store/authStore';

export function usePermissions() {
  const { user } = useAuth();
  const { permissions } = useAuthStore();

  // 检查是否有特定权限
  const hasPermissionCode = useMemo(() => {
    return (permissionCode: string): boolean => {
      if (!user) return false;
      return permissions.some((p) => p.code === permissionCode);
    };
  }, [user, permissions]);

  // 检查是否有任一权限
  const hasAnyPermission = useMemo(() => {
    return (permissionCodes: string[]): boolean => {
      return permissionCodes.some((code) => hasPermissionCode(code));
    };
  }, [hasPermissionCode]);

  // 检查是否有所有权限
  const hasAllPermissions = useMemo(() => {
    return (permissionCodes: string[]): boolean => {
      return permissionCodes.every((code) => hasPermissionCode(code));
    };
  }, [hasPermissionCode]);

  // 获取用户权限列表
  const getUserPermissions = useMemo(() => {
    return permissions.map((p) => p.code);
  }, [permissions]);

  // 检查是否可以访问路由
  const canAccessRoute = useMemo(() => {
    return (requiredPermissions: string[]): boolean => {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true; // 无权限要求的路由，所有用户都可以访问
      }
      return hasAnyPermission(requiredPermissions);
    };
  }, [hasAnyPermission]);

  return {
    permissions,
    hasPermission: hasPermissionCode,
    hasAnyPermission,
    hasAllPermissions,
    getUserPermissions,
    canAccessRoute,
  };
}

// 权限常量
export const PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  // 系统设置
  SYSTEM_VIEW: 'system:view',
  SYSTEM_UPDATE: 'system:update',

  // 数据导出
  DATA_EXPORT: 'data:export',
  DATA_IMPORT: 'data:import',

  // 报表查看
  REPORT_VIEW: 'report:view',
} as const;
