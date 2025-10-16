// API 相关类型定义

// 基础 API 响应类型
export interface ApiResponse<T = unknown> {
  data: T;
  code: number;
  serviceCode: string;
  msg: string;
  timestamp?: string;
}

// 分页响应类型
export interface PaginatedResponse<T = unknown> {
  data: {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages?: number;
  };
  code: number;
  serviceCode: string;
  msg: string;
  timestamp?: string;
}

// 分页请求参数
export interface PaginationParams {
  current?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 通用请求参数
export interface RequestParams extends PaginationParams {
  [key: string]: unknown;
}

// HTTP 方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求配置类型
export interface RequestConfig {
  url: string;
  method?: HttpMethod;
  params?: RequestParams;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

// API 错误类型
export interface ApiError {
  code: number;
  serviceCode: string;
  message: string;
  details?: unknown;
  timestamp?: string;
}

// 文件上传响应类型
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// 批量操作请求类型
export interface BatchOperationRequest<T = unknown> {
  ids: string[];
  data?: T;
}

// 批量操作响应类型
export interface BatchOperationResponse {
  success: number;
  failed: number;
  errors?: {
    id: string;
    error: string;
  }[];
}

// 导出请求类型
export interface ExportRequest {
  format: 'excel' | 'csv' | 'pdf';
  filters?: RequestParams;
  columns?: string[];
}

// 导出响应类型
export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  filesize: number;
  expiresAt: string;
}

// 统计数据类型
export interface StatisticsData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growthRate?: number;
  chartData?: {
    date: string;
    value: number;
  }[];
}

// 健康检查响应类型
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services?: {
    name: string;
    status: 'up' | 'down';
    responseTime?: number;
  }[];
}
