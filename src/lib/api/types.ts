// API 响应类型定义

// 非分页响应结构
export interface ApiResponse<T = unknown> {
  data: T;
  code: number; // 1 表示成功，其他表示失败
  serviceCode: string;
  msg: string; // 成功时为成功信息，失败时为错误信息
}

// 分页响应结构
export interface PaginatedResponse<T = unknown> {
  data: {
    records: T[]; // 数据列表
    total: number; // 总数
    size: number; // 每页数量
    current: number; // 当前页码
  };
  code: number;
  serviceCode: string;
  msg: string;
}

// 分页查询参数
export interface PaginationParams {
  current?: number; // 当前页码
  size?: number; // 每页数量
}

// 通用请求参数
export interface RequestParams extends PaginationParams {
  [key: string]: unknown;
}

// API 请求状态
export interface ApiState<T> {
  data: T | null; // 响应数据
  loading: boolean; // 加载状态
  error: string | null; // 错误信息
}

// 分页查询状态
export interface PaginatedState<T> {
  data: T[]; // 数据列表
  total: number; // 总数
  current: number; // 当前页码
  size: number; // 每页数量
  loading: boolean; // 加载状态
  error: string | null; // 错误信息
}

// ==================== 字典管理相关类型 ====================

// 字典类型查询参数
export interface DictTypeParams {
  dictName?: string;
  dictType?: string;
  status?: string;
  serviceName?: string;
  dataType?: string;
}

// 字典类型实体
export interface DictType {
  dictId: string;
  serviceName: string;
  dictName: string;
  dictType: string;
  status: string;
  createUserNickName: string;
  createTime: string;
  updateUserNickName?: string;
  updateTime?: string;
  remark?: string;
  dataType: number;
}

// 字典类型列表响应
export interface DictTypeListResponse {
  records: DictType[];
  total: string;
  size: string;
  current: string;
  pages: string;
}

// 字典类型分页查询请求
export interface DictTypePageRequest {
  params: DictTypeParams;
  current: number;
  size: number;
}

// 字典类型分页查询响应
export interface DictTypePageResponse {
  data: DictTypeListResponse;
  code: number;
  serviceCode: string;
  msg: string;
}

// 字典类型编辑请求（排除时间字段）
export type DictTypeEditRequest = Omit<DictType, 'createTime' | 'updateTime'>;
