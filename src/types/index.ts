// 类型统一导出

// 导出所有类型定义
export * from './common';
export * from './user';
export * from './auth';

// 常用类型别名
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 常用工具类型
export interface PageData<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ResponseResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 事件处理器类型
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// 表单值类型
export type FormValues<T = Record<string, unknown>> = Partial<T>;

// 组件 Props 类型
export interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// 异步状态类型
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 选择器值类型
export type SelectValue = string | number | (string | number)[];

// 日期值类型
export type DateValue = string | Date | null;

// 颜色值类型
export type ColorValue = string;

// 尺寸值类型
export type SizeValue = number | string;

// 位置类型
export type Position = 'top' | 'right' | 'bottom' | 'left';

// 对齐方式类型
export type Align = 'start' | 'center' | 'end';

// 方向类型
export type Direction = 'horizontal' | 'vertical';
