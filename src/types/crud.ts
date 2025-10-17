// 通用CRUD组件类型定义

import { ReactNode } from 'react';
import type { RequestParams } from './api';

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (value: unknown) => boolean | string;
}

// 表格列配置
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sorter?: boolean;
  filters?: Array<{ text: string; value: string }>;
  filterMethod?: (value: string, row: T) => boolean;
}

// 搜索表单字段配置
export interface SearchField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'daterange' | 'number';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  defaultValue?: unknown;
  rules?: ValidationRule[];
  span?: number;
  visible?: boolean;
  disabled?: boolean;
}

// 编辑表单字段配置
export interface EditField<T = Record<string, unknown>> {
  name: keyof T;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'number' | 'switch' | 'radio';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  rules?: ValidationRule[];
  span?: number;
  visible?: boolean;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: unknown;
  render?: (value: unknown, record: T, form: Record<string, unknown>) => ReactNode;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  // 分页总数（可选字段，用于分页响应）
  total?: number;
}

// CRUD操作配置
export interface CrudConfig<T = Record<string, unknown>, CreateParams = Partial<T>> {
  // 基本配置
  title: string;
  description?: string;

  // API函数
  api: {
    getList: (params: RequestParams) => Promise<ApiResponse<T[]>>;
    create?: (data: CreateParams) => Promise<ApiResponse<T>>;
    update?: (id: string | number, data: Partial<T>) => Promise<ApiResponse<T>>;
    delete?: (id: string | number) => Promise<ApiResponse<boolean>>;
    getById?: (id: string | number) => Promise<ApiResponse<T>>;
  };

  // 表格配置
  table: {
    columns: TableColumn<T>[];
    rowKey?: keyof T;
    showSelection?: boolean;
    showIndex?: boolean;
    scroll?: { x?: number; y?: number };
    size?: 'small' | 'middle' | 'large';
  };

  // 搜索表单配置
  search: {
    fields: SearchField[];
    defaultParams?: Record<string, unknown>;
    span?: number;
    labelCol?: number;
    wrapperCol?: number;
  };

  // 编辑表单配置
  edit: {
    fields: EditField<T>[];
    layout?: 'horizontal' | 'vertical' | 'inline';
    span?: number;
    labelCol?: number;
    wrapperCol?: number;
  };

  // 分页配置
  pagination: {
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
    pageSizeOptions?: number[];
    defaultPageSize?: number;
  };

  // 权限配置
  permissions?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    export?: boolean;
    import?: boolean;
  };

  // 其他配置
  features?: {
    enableSearch?: boolean;
    enableRefresh?: boolean;
    enableExport?: boolean;
    enableImport?: boolean;
    enableBatchDelete?: boolean;
  };
}

// CRUD状态管理
export interface CrudState<T = Record<string, unknown>> {
  // 数据状态
  data: T[];
  loading: boolean;
  error: string | null;

  // 分页状态
  total: number;
  current: number;
  size: number;

  // 搜索状态
  searchParams: Record<string, unknown>;

  // 编辑状态
  editDialogOpen: boolean;
  editingRecord: T | null;
  editMode: 'create' | 'edit';
  editLoading: boolean;

  // 选择状态
  selectedRows: T[];
  selectedRowKeys: string[];
}

// CRUD操作方法
export interface CrudActions<T = Record<string, unknown>, CreateParams = Partial<T>> {
  // 数据操作
  fetchData: (params?: RequestParams) => Promise<void>;
  refresh: () => Promise<void>;

  // 搜索操作
  handleSearch: (params: Record<string, unknown>) => void;
  handleReset: () => void;

  // 分页操作
  handlePageChange: (page: number, pageSize: number) => void;

  // 编辑操作
  handleCreate: () => void;
  handleEdit: (record: T) => void;
  handleDelete: (record: T) => Promise<void>;
  handleBatchDelete: (records: T[]) => Promise<void>;
  handleSubmit: (data: CreateParams | Partial<T>) => Promise<void>;
  handleCancel: () => void;

  // 选择操作
  handleSelectionChange: (rows: T[], keys: string[]) => void;
  handleSelectAll: (checked: boolean) => void;
}

// CRUD Hook返回类型
export interface UseCrudReturn<T = Record<string, unknown>, CreateParams = Partial<T>> {
  state: CrudState<T>;
  actions: CrudActions<T, CreateParams>;
}
