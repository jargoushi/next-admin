import axios from 'axios';

// 创建 axios 实例
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://proxy-test.jdd51.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    authorization: 'Bearer rh_admin:admin:ed8fde93-9b86-4b5c-a991-97104a3a6b52',
  },
});

export default api;
