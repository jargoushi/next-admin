import { api } from './config';

// 请求拦截器 - 自动添加认证令牌
api.interceptors.request.use(
  (config) => {
    // 从 cookie 或 localStorage 获取 token
    const token =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1] || localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理业务状态码
api.interceptors.response.use(
  (response) => {
    const { data } = response;

    // 检查业务状态码，1 表示成功
    if (data.code !== 1) {
      // 业务失败，抛出错误
      const error = new Error(data.msg || '请求失败');
      (error as Error & { code?: number; serviceCode?: string }).code = data.code;
      (error as Error & { code?: number; serviceCode?: string }).serviceCode = data.serviceCode;
      throw error;
    }

    return response;
  },
  (error) => {
    // HTTP 错误处理
    if (error.response?.status === 401) {
      // 未授权，清除认证信息并跳转登录页
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
