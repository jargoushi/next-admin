import axios from 'axios';

// 创建 axios 实例
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://proxy-test.jdd51.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
