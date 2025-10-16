// 路由常量定义

export const ROUTES = {
  // 认证相关路由
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',

  // 主应用路由
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // 业务模块路由（示例）
  USERS: '/users',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  REPORTS: '/reports',
} as const;

// 路由组
export const ROUTE_GROUPS = {
  AUTH: '/(auth)',
  DASHBOARD: '/(dashboard)',
} as const;

// 路由配置
export const ROUTE_CONFIG = {
  [ROUTES.LOGIN]: {
    title: '登录',
    requireAuth: false,
    layout: 'auth',
  },
  [ROUTES.REGISTER]: {
    title: '注册',
    requireAuth: false,
    layout: 'auth',
  },
  [ROUTES.DASHBOARD]: {
    title: '仪表板',
    requireAuth: true,
    layout: 'dashboard',
  },
  [ROUTES.PROFILE]: {
    title: '个人资料',
    requireAuth: true,
    layout: 'dashboard',
  },
  [ROUTES.SETTINGS]: {
    title: '系统设置',
    requireAuth: true,
    layout: 'dashboard',
  },
} as const;

// 菜单导航配置
export const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: '仪表板',
    icon: 'Dashboard',
    path: ROUTES.DASHBOARD,
  },
  {
    key: 'profile',
    label: '个人资料',
    icon: 'User',
    path: ROUTES.PROFILE,
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'Settings',
    path: ROUTES.SETTINGS,
  },
] as const;
