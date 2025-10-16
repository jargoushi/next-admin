import { useState, useCallback, useEffect } from 'react';
import type { RequestParams } from '@/lib/api';

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
  useEffect(() => {
    if (options?.immediate) {
      execute();
    }
  }, [execute, options?.immediate]);

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
    params: RequestParams
  ) => Promise<{ data: { records: T[]; total: number; current: number; size: number } }>,
  initialParams: RequestParams = {},
  options?: {
    immediate?: boolean;
    onSuccess?: (data: T[], total: number) => void;
    onError?: (error: Error) => void;
  }
): PaginatedState<T> & {
  refetch: (params?: RequestParams) => Promise<void>;
  setLoading: (loading: boolean) => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(initialParams.current || 1);
  const [size, setSize] = useState(initialParams.size || 10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (params: RequestParams = {}) => {
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
  useEffect(() => {
    if (options?.immediate) {
      refetch(initialParams);
    }
  }, [refetch, initialParams, options?.immediate]);

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
