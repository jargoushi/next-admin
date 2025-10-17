import axios from 'axios';

// 创建 axios 实例
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://proxy-test.jdd51.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer rh_admin:admin:9f7396eb-db72-4b7e-b760-fd1c21c84168',
  },
});

export default api;
