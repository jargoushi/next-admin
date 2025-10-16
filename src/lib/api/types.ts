// 通用API响应类型定义

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
