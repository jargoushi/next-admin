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

  // 按类型获取字典
  getByType: (dictType: string): Promise<ApiResponse<DictType[]>> =>
    api.get(`/dict/type/${dictType}`),

  // 批量更新状态
  batchUpdateStatus: (dictIds: string[], status: string): Promise<ApiResponse<boolean>> =>
    api.patch('/dict/batch/status', { dictIds, status }),

  // 字典类型分页查询（标准接口）
  getPageList: (params: RequestParams): Promise<DictTypePageResponse> => {
    const request: DictTypePageRequest = {
      params: {
        dictName: (params.dictName as string) || '',
        dictType: (params.dictType as string) || '',
        status: params.status === 'all' ? '' : (params.status as string) || '',
        serviceName: (params.serviceName as string) || '',
        dataType: (params.dataType as string) || '0',
      },
      current: params.current || 1,
      size: params.size || 10,
    };
    return api.post('/basic-public-app/web/system/sysDictType/pageList', request);
  },

  // 原始接口（保留，用于特殊情况）
  getPageListOriginal: (request: DictTypePageRequest): Promise<DictTypePageResponse> =>
    api.post('/basic-public-app/web/system/sysDictType/pageList', request),

  // 创建字典类型（符合标准CRUD接口）
  create: (
    data: Omit<DictType, 'dictId' | 'createTime' | 'updateTime'>
  ): Promise<ApiResponse<null>> =>
    api.post('/basic-public-app/web/system/sysDictType/editById', { ...data, dictId: '' }),

  // 更新字典类型（符合标准CRUD接口）
  update: (dictId: string, data: Partial<DictType>): Promise<ApiResponse<null>> =>
    api.post('/basic-public-app/web/system/sysDictType/editById', { ...data, dictId }),

  // 删除字典类型（符合标准CRUD接口）
  delete: (dictId: string): Promise<ApiResponse<null>> =>
    api.post(`/basic-public-app/web/system/sysDictType/remove/${dictId}`),

  // 编辑字典类型（兼容方法，保留用于特殊情况）
  editById: (dictData: DictType): Promise<ApiResponse<null>> =>
    api.post('/basic-public-app/web/system/sysDictType/editById', dictData),

  // 删除字典类型（兼容方法，保留用于特殊情况）
  removeById: (dictId: string): Promise<ApiResponse<null>> =>
    api.post(`/basic-public-app/web/system/sysDictType/remove/${dictId}`),
};
