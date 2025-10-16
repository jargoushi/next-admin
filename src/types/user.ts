// 用户相关类型定义

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'blocked';
  createTime: string;
  updateTime: string;
  avatar?: string;
  phone?: string;
  realName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  realName?: string;
  phone?: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}
