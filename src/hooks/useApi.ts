import { useState, useCallback, useEffect, useRef } from 'react';
import type { RequestParams } from '@/lib/api/types';

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
  const refetchRef = useRef<(params: RequestParams) => Promise<void>>(() => Promise.resolve());
  const apiFunctionRef = useRef(apiFunction);

  // 更新 ref 值
  apiFunctionRef.current = apiFunction;

  const refetch = useCallback(
    async (params: RequestParams = {}) => {
      setLoading(true);
      setError(null);

      try {
        // 使用闭包捕获最新的状态值
        const currentResponse = await apiFunctionRef.current({ ...params });
        setData(currentResponse.data.records);
        setTotal(currentResponse.data.total);
        setCurrent(currentResponse.data.current);
        setSize(currentResponse.data.size);
        options?.onSuccess?.(currentResponse.data.records, currentResponse.data.total);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '查询失败';
        setError(errorMessage);
        options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  refetchRef.current = refetch;

  // 立即执行 - 使用 ref 避免依赖循环
  const optionsRef = useRef(options);
  const initialParamsRef = useRef(initialParams);

  // 更新 ref 值
  optionsRef.current = options;
  initialParamsRef.current = initialParams;

  useEffect(() => {
    if (optionsRef.current?.immediate) {
      refetchRef.current?.(initialParamsRef.current);
    }
  }, []); // 空依赖数组，只执行一次

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
