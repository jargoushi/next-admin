// 本地存储键值常量定义

export const STORAGE_KEYS = {
  // 认证相关
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',

  // 应用设置
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',

  // 用户偏好
  TABLE_PAGE_SIZE: 'tablePageSize',
  DATE_FORMAT: 'dateFormat',
  TIME_FORMAT: 'timeFormat',

  // 缓存数据
  CACHED_PERMISSIONS: 'cachedPermissions',
  CACHED_USER_MENU: 'cachedUserMenu',
  CACHED_DICT_DATA: 'cachedDictData',

  // 临时数据
  TEMP_FORM_DATA: 'tempFormData',
  LAST_VISITED_PAGE: 'lastVisitedPage',
} as const;

// 默认配置值
export const DEFAULT_VALUES = {
  THEME: 'light',
  LANGUAGE: 'zh-CN',
  TABLE_PAGE_SIZE: 10,
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm:ss',
  SIDEBAR_COLLAPSED: false,
} as const;

// 过期时间（毫秒）
export const EXPIRY_TIME = {
  USER_INFO: 24 * 60 * 60 * 1000, // 24小时
  PERMISSIONS: 12 * 60 * 60 * 1000, // 12小时
  DICT_DATA: 60 * 60 * 1000, // 1小时
} as const;
