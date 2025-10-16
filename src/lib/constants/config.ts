// 应用配置常量

export const APP_CONFIG = {
  // 应用基本信息
  APP_NAME: '后台管理系统',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: '基于 Next.js 的现代化后台管理系统',

  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    SHOW_SIZE_CHANGER: true,
    SHOW_QUICK_JUMPER: true,
  },

  // 表格配置
  TABLE: {
    DEFAULT_SCROLL_Y: 400,
    SHOW_HEADER: true,
    BORDERED: true,
    SIZE: 'middle' as const,
  },

  // 主题配置
  THEME: {
    DEFAULT: 'light',
    OPTIONS: ['light', 'dark', 'auto'],
  },

  // 语言配置
  LANGUAGE: {
    DEFAULT: 'zh-CN',
    OPTIONS: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: 'English' },
    ],
  },

  // 上传配置
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },

  // 防抖配置
  DEBOUNCE: {
    SEARCH_DELAY: 300,
    INPUT_DELAY: 500,
  },

  // 缓存配置
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5分钟
    MAX_CACHE_SIZE: 100, // 最大缓存条目数
  },
} as const;

// 环境配置
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME || APP_CONFIG.APP_NAME,
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '权限不足，无法访问该资源',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败',
  UNKNOWN_ERROR: '发生未知错误，请联系管理员',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  CREATE_SUCCESS: '创建成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  UPLOAD_SUCCESS: '上传成功',
} as const;
