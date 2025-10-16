// 用户相关类型定义

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  realName?: string;
  gender?: Gender;
  birthday?: string;
  address?: string;
  bio?: string;
}

export interface UserPreferences {
  theme: Theme;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  sidebarCollapsed: boolean;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  system: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  description?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  lastActivityTime: string;
  isActive: boolean;
}

// 枚举类型
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

export enum UserAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  EXPORT = 'export',
  IMPORT = 'import',
}

// 用户查询参数
export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 用户统计信息
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  onlineUsers: number;
  userGrowthRate: number;
  userActivityData: {
    date: string;
    count: number;
  }[];
}
