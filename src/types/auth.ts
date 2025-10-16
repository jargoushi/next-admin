// 认证相关类型定义

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
}
