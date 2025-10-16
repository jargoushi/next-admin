import { api } from '../config';
import type { ApiResponse, PaginatedResponse, RequestParams } from '@/types/api';
import type { DictType, DictTypePageRequest, DictTypePageResponse } from '@/types/dict';

// 字典 API 函数集合
export const dictApi = {
  // 获取字典列表（分页）
  getList: (params?: RequestParams): Promise<PaginatedResponse<DictType>> =>
    api.get('/dict', { params }),

  // 获取字典详情
  getDetail: (dictId: string): Promise<ApiResponse<DictType>> => api.get(`/dict/${dictId}`),

  // 创建字典
  create: (
    data: Omit<DictType, 'dictId' | 'createTime' | 'updateTime'>
  ): Promise<ApiResponse<DictType>> => api.post('/dict', data),

  // 更新字典
  update: (dictId: string, data: Partial<DictType>): Promise<ApiResponse<DictType>> =>
    api.put(`/dict/${dictId}`, data),

  // 删除字典
  delete: (dictId: string): Promise<ApiResponse<boolean>> => api.delete(`/dict/${dictId}`),

  // 按类型获取字典
  getByType: (dictType: string): Promise<ApiResponse<DictType[]>> =>
    api.get(`/dict/type/${dictType}`),

  // 批量更新状态
  batchUpdateStatus: (dictIds: string[], status: string): Promise<ApiResponse<boolean>> =>
    api.patch('/dict/batch/status', { dictIds, status }),

  // 字典类型分页查询
  getPageList: (request: DictTypePageRequest): Promise<DictTypePageResponse> =>
    api.post('/basic-public-app/web/system/sysDictType/pageList', request),

  // 编辑字典类型
  editById: (dictData: DictType): Promise<ApiResponse<null>> =>
    api.post('/basic-public-app/web/system/sysDictType/editById', dictData),

  // 删除字典类型
  removeById: (dictId: string): Promise<ApiResponse<null>> =>
    api.post(`/basic-public-app/web/system/sysDictType/remove/${dictId}`),
};
