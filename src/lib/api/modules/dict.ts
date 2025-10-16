import { api } from '../config';
import type { ApiResponse, PaginatedResponse, RequestParams } from '../types';
import type { DictTypePageRequest, DictTypePageResponse } from '@/app/(dashboard)/dict/types/dict';

// 字典实体类型
export interface Dict {
  dictId: string;
  serviceName: string;
  dictName: string;
  dictType: string;
  status: string;
  createUserNickName: string;
  createTime: string;
  updateUserNickName: string;
  updateTime: string;
  remark: string;
  dataType: number;
}

// 字典 API 函数集合
export const dictApi = {
  // 获取字典列表（分页）
  getList: (params?: RequestParams): Promise<PaginatedResponse<Dict>> =>
    api.get('/dict', { params }),

  // 获取字典详情
  getDetail: (dictId: string): Promise<ApiResponse<Dict>> => api.get(`/dict/${dictId}`),

  // 创建字典
  create: (data: Omit<Dict, 'dictId' | 'createTime' | 'updateTime'>): Promise<ApiResponse<Dict>> =>
    api.post('/dict', data),

  // 更新字典
  update: (dictId: string, data: Partial<Dict>): Promise<ApiResponse<Dict>> =>
    api.put(`/dict/${dictId}`, data),

  // 删除字典
  delete: (dictId: string): Promise<ApiResponse<boolean>> => api.delete(`/dict/${dictId}`),

  // 按类型获取字典
  getByType: (dictType: string): Promise<ApiResponse<Dict[]>> => api.get(`/dict/type/${dictType}`),

  // 批量更新状态
  batchUpdateStatus: (dictIds: string[], status: string): Promise<ApiResponse<boolean>> =>
    api.patch('/dict/batch/status', { dictIds, status }),

  // 字典类型分页查询
  getPageList: (request: DictTypePageRequest): Promise<DictTypePageResponse> =>
    api.post('/basic-public-app/web/system/sysDictType/pageList', request),
};
