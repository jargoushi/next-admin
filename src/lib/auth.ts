// 认证相关工具函数

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

// 保存认证令牌
export const saveTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

// 获取认证令牌
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// 获取刷新令牌
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// 清除认证信息
export const clearAuth = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// 保存用户信息
export const saveUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

// 获取用户信息
export const getUserInfo = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr) as UserInfo;
    } catch {
      return null;
    }
  }
  return null;
};
