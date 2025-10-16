// API 端点常量定义

export const API_ENDPOINTS = {
  // 认证相关 API
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // 用户管理 API
  USER: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    SEARCH: '/users/search',
  },

  // 字典管理 API
  DICT: {
    LIST: '/dict',
    DETAIL: '/dict/:id',
    CREATE: '/dict',
    UPDATE: '/dict/:id',
    DELETE: '/dict/:id',
    BY_TYPE: '/dict/type/:type',
    UPDATE_STATUS: '/dict/:id/status',
  },

  // 文件上传 API
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    AVATAR: '/upload/avatar',
  },

  // 系统设置 API
  SETTINGS: {
    LIST: '/settings',
    DETAIL: '/settings/:key',
    UPDATE: '/settings/:key',
  },
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 业务状态码
export const BUSINESS_CODE = {
  SUCCESS: 1,
  FAILED: 0,
  TOKEN_EXPIRED: 1001,
  INVALID_CREDENTIALS: 1002,
  USER_NOT_FOUND: 1003,
  PERMISSION_DENIED: 1004,
} as const;

// 请求方法
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// API 请求配置
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;
