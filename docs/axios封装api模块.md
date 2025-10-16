# Axios 封装 API 模块设计文档

## 📋 概述

本文档详细描述了基于 Axios 的 API 模块封装设计，旨在为后台管理系统提供统一、类型安全、易用的 HTTP 请求解决方案。

## 🎯 设计目标

- **类型安全**: 完整的 TypeScript 类型支持
- **状态自动化**: 自动管理请求状态（loading、error、data）
- **RESTful 规范**: 遵循 RESTful API 设计规范
- **错误处理**: 统一的错误处理和用户反馈
- **认证管理**: 自动令牌管理和失效处理
- **易于扩展**: 新业务模块快速集成

## 🏗️ 目录结构

```
src/lib/
├── api/
│   ├── index.ts              # API 模块统一导出
│   ├── config.ts             # axios 基础配置
│   ├── types.ts              # API 响应类型定义
│   ├── interceptors.ts       # 请求/响应拦截器
│   ├── hooks/
│   │   └── useApi.ts         # 通用 API Hook
│   └── modules/
│       ├── dict.ts           # 字典管理 API
│       ├── user.ts           # 用户管理 API
│       └── index.ts          # 业务模块统一导出
```

## 📝 类型定义

### API 响应类型

```typescript
// lib/api/types.ts

// 非分页响应结构
interface ApiResponse<T = any> {
  data: T;
  code: number; // 1 表示成功，其他表示失败
  serviceCode: string;
  msg: string; // 成功时为成功信息，失败时为错误信息
}

// 分页响应结构
interface PaginatedResponse<T = any> {
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
interface PaginationParams {
  current?: number; // 当前页码
  size?: number; // 每页数量
}

// 通用请求参数
interface RequestParams extends PaginationParams {
  [key: string]: any;
}

// API 请求状态
interface ApiState<T> {
  data: T | null; // 响应数据
  loading: boolean; // 加载状态
  error: string | null; // 错误信息
}

// 分页查询状态
interface PaginatedState<T> {
  data: T[]; // 数据列表
  total: number; // 总数
  current: number; // 当前页码
  size: number; // 每页数量
  loading: boolean; // 加载状态
  error: string | null; // 错误信息
}
```

## ⚙️ 基础配置

### Axios 实例配置

```typescript
// lib/api/config.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 请求/响应拦截器

```typescript
// lib/api/interceptors.ts
import { api } from './config';
import { useAuthStore } from '@/store';

// 请求拦截器 - 自动添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一处理业务状态码
api.interceptors.response.use(
  (response) => {
    const { data } = response;

    // 检查业务状态码，1 表示成功
    if (data.code !== 1) {
      // 业务失败，抛出错误
      const error = new Error(data.msg || '请求失败');
      (error as any).code = data.code;
      (error as any).serviceCode = data.serviceCode;
      throw error;
    }

    return response;
  },
  (error) => {
    // HTTP 错误处理
    if (error.response?.status === 401) {
      // 未授权，清除状态并跳转登录页
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
```

## 🪝 自定义 Hooks

### 通用 API Hook

```typescript
// lib/api/hooks/useApi.ts
import { useState, useCallback } from 'react';
import type { ApiState, PaginatedState } from '../types';

// 单个 API 请求 Hook
export function useApi<T>(
  apiFunction: () => Promise<{ data: T }>,
  options?: {
    immediate?: boolean; // 是否立即执行
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): ApiState<T> & {
  execute: () => Promise<void>;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction();
      setData(response.data);
      options?.onSuccess?.(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败';
      setError(errorMessage);
      options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  // 立即执行
  useState(() => {
    if (options?.immediate) {
      execute();
    }
  });

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// 分页查询 Hook
export function usePaginatedApi<T>(
  apiFunction: (
    params: any
  ) => Promise<{ data: { records: T[]; total: number; current: number; size: number } }>,
  initialParams: any = {},
  options?: {
    immediate?: boolean;
    onSuccess?: (data: T[], total: number) => void;
    onError?: (error: Error) => void;
  }
): PaginatedState<T> & {
  refetch: (params?: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(initialParams.current || 1);
  const [size, setSize] = useState(initialParams.size || 10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (params: any = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunction({ current, size, ...params });
        setData(response.data.records);
        setTotal(response.data.total);
        setCurrent(response.data.current);
        setSize(response.data.size);
        options?.onSuccess?.(response.data.records, response.data.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '查询失败';
        setError(errorMessage);
        options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, current, size, options]
  );

  // 立即执行
  useState(() => {
    if (options?.immediate) {
      refetch(initialParams);
    }
  });

  return {
    data,
    total,
    current,
    size,
    loading,
    error,
    refetch,
    setLoading: (loadingValue: boolean) => setLoading(loadingValue),
  };
}
```

## 📦 业务模块实现

### 字典管理模块示例

```typescript
// lib/api/modules/dict.ts
import { api } from '../config';
import type { ApiResponse, PaginatedResponse, RequestParams } from '../types';

// 字典实体类型
export interface Dict {
  dictId: string;
  serviceName: string;
  dictName: string;
  dictType: string;
  status: string;
  createUserNickName: string;
  createTime: string;
  updateUserNickName: string;
  updateTime: string;
  remark: string;
  dataType: number;
}

// 字典 API 函数集合
export const dictApi = {
  // 获取字典列表（分页）
  getList: (params?: RequestParams): Promise<PaginatedResponse<Dict>> =>
    api.get('/dict', { params }),

  // 获取字典详情
  getDetail: (dictId: string): Promise<ApiResponse<Dict>> => api.get(`/dict/${dictId}`),

  // 创建字典
  create: (data: Omit<Dict, 'dictId' | 'createTime' | 'updateTime'>): Promise<ApiResponse<Dict>> =>
    api.post('/dict', data),

  // 更新字典
  update: (dictId: string, data: Partial<Dict>): Promise<ApiResponse<Dict>> =>
    api.put(`/dict/${dictId}`, data),

  // 删除字典
  delete: (dictId: string): Promise<ApiResponse<boolean>> => api.delete(`/dict/${dictId}`),

  // 按类型获取字典
  getByType: (dictType: string): Promise<ApiResponse<Dict[]>> => api.get(`/dict/type/${dictType}`),

  // 批量更新状态
  batchUpdateStatus: (dictIds: string[], status: string): Promise<ApiResponse<boolean>> =>
    api.patch('/dict/batch/status', { dictIds, status }),
};
```

### 模块统一导出

```typescript
// lib/api/modules/index.ts
export { dictApi } from './dict';
export { userApi } from './user';
// 其他模块...

// 统一 API 对象
export const apiModules = {
  dict: dictApi,
  user: userApi,
  // 其他模块...
};
```

## 🚀 使用示例

### 在组件中使用

```typescript
// components/DictList.tsx
import { usePaginatedApi, useApi } from '@/lib/api/hooks';
import { dictApi } from '@/lib/api';
import type { Dict } from '@/lib/api';

export const DictList = () => {
  // 自动管理分页查询状态
  const {
    data,
    total,
    current,
    size,
    loading,
    error,
    refetch,
  } = usePaginatedApi<Dict>(
    (params) => dictApi.getList(params),
    { current: 1, size: 10 },
    { immediate: true }
  );

  // 创建字典
  const { execute: createDict, loading: createLoading } = useApi(
    () => dictApi.create(formData),
    { onSuccess: () => refetch() }
  );

  // 更新字典
  const { execute: updateDict, loading: updateLoading } = useApi(
    (id: string, data: Partial<Dict>) => dictApi.update(id, data),
    { onSuccess: () => refetch() }
  );

  // 删除字典
  const { execute: deleteDict, loading: deleteLoading } = useApi(
    (id: string) => dictApi.delete(id),
    { onSuccess: () => refetch() }
  );

  const handleCreate = async (formData: Partial<Dict>) => {
    try {
      await createDict();
    } catch (error) {
      // 错误信息已在 Hook 中处理
    }
  };

  const handleDelete = async (dictId: string) => {
    try {
      await deleteDict();
    } catch (error) {
      // 错误信息已在 Hook 中处理
    }
  };

  return (
    <div>
      {/* 搜索表单 */}
      <DictSearch onSearch={(params) => refetch(params)} />

      {/* 表格内容 */}
      {loading ? (
        <div>加载中...</div>
      ) : error ? (
        <div>错误: {error}</div>
      ) : (
        <DictTable
          data={data}
          onDelete={handleDelete}
          onUpdate={async (id, data) => {
            await updateDict(id, data);
          }}
        />
      )}

      {/* 分页组件 */}
      <Pagination
        current={current}
        pageSize={size}
        total={total}
        onChange={(page, pageSize) => refetch({ current: page, size: pageSize })}
      />
    </div>
  );
};
```

### 在 Zustand Store 中使用

```typescript
// store/dictStore.ts
import { create } from 'zustand';
import { dictApi } from '@/lib/api';
import type { Dict } from '@/lib/api';

interface DictState {
  dictList: Dict[];
  dictMap: Record<string, Dict>;

  // Actions
  fetchDictList: (params?: any) => Promise<void>;
  fetchDictByType: (type: string) => Promise<Dict[]>;
  createDict: (data: Partial<Dict>) => Promise<void>;
  updateDict: (id: string, data: Partial<Dict>) => Promise<void>;
  deleteDict: (id: string) => Promise<void>;
}

export const useDictStore = create<DictState>((set, get) => ({
  dictList: [],
  dictMap: {},

  fetchDictList: async (params = {}) => {
    try {
      const response = await dictApi.getList(params);
      const dictList = response.data.records;
      set({ dictList });

      // 构建 map 方便查找
      const dictMap = dictList.reduce(
        (acc, dict) => {
          acc[dict.dictId] = dict;
          return acc;
        },
        {} as Record<string, Dict>
      );
      set({ dictMap });
    } catch (error) {
      throw error;
    }
  },

  fetchDictByType: async (type: string) => {
    try {
      const response = await dictApi.getByType(type);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDict: async (data: Partial<Dict>) => {
    const response = await dictApi.create(data);
    if (response.data) {
      await get().fetchDictList(); // 刷新列表
    }
  },

  updateDict: async (id: string, data: Partial<Dict>) => {
    const response = await dictApi.update(id, data);
    if (response.data) {
      await get().fetchDictList(); // 刷新列表
    }
  },

  deleteDict: async (id: string) => {
    const response = await dictApi.delete(id);
    if (response.data) {
      await get().fetchDictList(); // 刷新列表
    }
  },
}));
```

## 🎯 核心优势

### 1. 自动状态管理

- **无需手动维护**: loading、error、data 状态自动管理
- **减少样板代码**: 组件中只需关注业务逻辑
- **状态一致性**: 统一的状态管理模式

### 2. 类型安全

- **完整类型覆盖**: API 响应、请求参数都有类型定义
- **编译时检查**: TypeScript 提供编译时类型检查
- **智能提示**: IDE 提供完整的代码智能提示

### 3. RESTful 规范

- **标准化 URL**: 遵循 RESTful API 设计规范
- **语义化方法**: 增删改查操作语义清晰
- **易于理解**: API 结构清晰，便于团队协作

### 4. 错误处理

- **统一处理**: 拦截器统一处理业务状态码
- **用户友好**: 错误信息自动展示给用户
- **认证管理**: 401 错误自动处理登录跳转

### 5. 易于扩展

- **模块化设计**: 新业务模块快速添加
- **基类复用**: BaseApi 提供通用 CRUD 操作
- **Hook 复用**: 通用 Hook 减少重复代码

## 📈 性能优化

### 1. 请求缓存

```typescript
// 可扩展缓存机制
const cache = new Map();

export function useCachedQuery<T>(key: string, queryFn: () => Promise<T>) {
  // 缓存逻辑实现
}
```

### 2. 请求取消

```typescript
// 组件卸载时取消未完成的请求
useEffect(() => {
  const controller = new AbortController();

  return () => {
    controller.abort();
  };
}, []);
```

### 3. 请求去重

```typescript
// 避免重复请求
const pendingRequests = new Map();

export function deduplicateRequest(key: string, requestFn: () => Promise<any>) {
  // 去重逻辑实现
}
```

## 🔧 扩展指南

### 添加新的业务模块

1. **定义类型**:

```typescript
// lib/api/modules/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  // ...其他字段
}
```

2. **创建 API 类**:

```typescript
export class ProductApi extends BaseApi<Product> {
  constructor() {
    super('product');
  }

  // 自定义方法
  getByCategory(categoryId: string): Promise<ApiResponse<Product[]>> {
    return api.get(`/product/category/${categoryId}`);
  }
}

export const productApi = new ProductApi();
```

3. **更新导出**:

```typescript
// lib/api/modules/index.ts
export { productApi } from './product';

export const apiModules = {
  // ...其他模块
  product: productApi,
};
```

4. **在组件中使用**:

```typescript
import { useQuery } from '@/lib/api/hooks';
import { apiModules } from '@/lib/api';

const { data, loading, refetch } = useQuery<Product>((params) =>
  apiModules.product.getList(params)
);
```

## 📝 注意事项

1. **环境变量**: 确保在 `.env.local` 中配置 API 基础 URL
2. **类型定义**: 新增业务实体时务必添加对应的 TypeScript 类型
3. **错误边界**: 在应用顶层添加错误边界处理未捕获的错误
4. **权限控制**: 根据业务需求扩展权限相关的拦截器和逻辑
5. **日志记录**: 可以在拦截器中添加请求日志记录功能

这个 API 模块设计为后台管理系统提供了完整的 HTTP 请求解决方案，既保持了代码的简洁性，又提供了强大的功能和良好的开发体验。
