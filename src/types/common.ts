// 通用类型定义

// 基础实体类型
export interface BaseEntity {
  id: string;
  createTime: string;
  updateTime: string;
  createUser?: string;
  updateUser?: string;
}

// 状态枚举
export enum Status {
  ACTIVE = '0',
  INACTIVE = '1',
  DELETED = '2',
}

// 性别枚举
export enum GenderType {
  MALE = '1',
  FEMALE = '2',
  UNKNOWN = '3',
}

// 操作类型枚举
export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  EXPORT = 'export',
  IMPORT = 'import',
}

// 通用选择器选项类型
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
}

// 树形节点类型
export interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  disabled?: boolean;
  icon?: string;
  data?: unknown;
}

// 表格列配置类型
export interface TableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: unknown) => React.ReactNode;
}

// 表单字段类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'date' | 'number' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  rules?: ValidationRule[];
  disabled?: boolean;
  hidden?: boolean;
}

// 验证规则类型
export interface ValidationRule {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: unknown) => boolean | string;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  hidden?: boolean;
  external?: boolean;
  badge?: string | number;
}

// 面包屑类型
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}

// 搜索表单类型
export interface SearchForm {
  keyword?: string;
  dateRange?: [string, string];
  status?: string;
  [key: string]: unknown;
}

// 通知消息类型
export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  content: string;
  duration?: number;
  closable?: boolean;
  timestamp?: string;
}

// 模态框配置类型
export interface ModalConfig {
  title: string;
  visible: boolean;
  width?: number;
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  footer?: React.ReactNode;
}

// 抽屉配置类型
export interface DrawerConfig {
  title: string;
  visible: boolean;
  width?: number;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  closable?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
}

// 文件信息类型
export interface FileInfo {
  uid: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  status: 'uploading' | 'done' | 'error';
  response?: unknown;
  error?: unknown;
}

// 图表数据类型
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// 时间范围类型
export interface DateRange {
  startDate: string;
  endDate: string;
}

// 导出配置类型
export interface ExportConfig {
  filename: string;
  format: 'excel' | 'csv' | 'pdf';
  columns?: string[];
  data?: unknown[];
}
