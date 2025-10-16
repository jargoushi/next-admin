import { api } from '../config';
import type { ApiResponse, PaginatedResponse, RequestParams } from '../types';
import type { User, LoginRequest, LoginResponse, RegisterRequest } from '@/types';

// 用户 API 函数集合
export const userApi = {
  // 用户登录
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => api.post('/auth/login', data),

  // 用户注册
  register: (data: RegisterRequest): Promise<ApiResponse<User>> => api.post('/auth/register', data),

  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<User>> => api.get('/auth/me'),

  // 获取用户列表（分页）
  getList: (params?: RequestParams): Promise<PaginatedResponse<User>> =>
    api.get('/user', { params }),

  // 获取用户详情
  getDetail: (userId: string): Promise<ApiResponse<User>> => api.get(`/user/${userId}`),

  // 创建用户
  create: (data: Omit<User, 'id' | 'createTime' | 'updateTime'>): Promise<ApiResponse<User>> =>
    api.post('/user', data),

  // 更新用户
  update: (userId: string, data: Partial<User>): Promise<ApiResponse<User>> =>
    api.put(`/user/${userId}`, data),

  // 删除用户
  delete: (userId: string): Promise<ApiResponse<boolean>> => api.delete(`/user/${userId}`),

  // 更新用户密码
  updatePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<boolean>> => api.patch('/auth/password', data),

  // 根据角色获取用户
  getByRole: (role: string): Promise<ApiResponse<User[]>> => api.get(`/user/role/${role}`),

  // 批量更新用户状态
  batchUpdateStatus: (userIds: string[], status: string): Promise<ApiResponse<boolean>> =>
    api.patch('/user/batch/status', { userIds, status }),

  // 重置用户密码
  resetPassword: (userId: string): Promise<ApiResponse<string>> =>
    api.patch(`/user/${userId}/reset-password`),
};
