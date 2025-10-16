'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ApiResponse, RequestParams } from '@/types';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (requestFn: () => Promise<ApiResponse<T>>) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = unknown>(options?: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (requestFn: () => Promise<ApiResponse<T>>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await requestFn();
        setData(response.data);
        options?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '请求失败';
        setError(errorMessage);
        options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// GET 请求 Hook
export function useGet<T = unknown>(
  url: string,
  params?: RequestParams,
  options?: UseApiOptions<T>
) {
  const { data, loading, error, execute, reset } = useApi<T>(options);

  const get = useCallback(() => {
    return execute(() => api.get<ApiResponse<T>>(url, { params }).then((res) => res.data));
  }, [execute, url, params]);

  return {
    data,
    loading,
    error,
    get,
    reset,
  };
}

// POST 请求 Hook
export function usePost<T = unknown>(url: string, options?: UseApiOptions<T>) {
  const { data, loading, error, execute } = useApi<T>(options);

  const post = useCallback(
    (postData?: unknown) => {
      return execute(() => api.post<ApiResponse<T>>(url, postData).then((res) => res.data));
    },
    [execute, url]
  );

  return {
    data,
    loading,
    error,
    post,
  };
}

// PUT 请求 Hook
export function usePut<T = unknown>(url: string, options?: UseApiOptions<T>) {
  const { data, loading, error, execute } = useApi<T>(options);

  const put = useCallback(
    (putData?: unknown) => {
      return execute(() => api.put<ApiResponse<T>>(url, putData).then((res) => res.data));
    },
    [execute, url]
  );

  return {
    data,
    loading,
    error,
    put,
  };
}

// DELETE 请求 Hook
export function useDelete<T = unknown>(url: string, options?: UseApiOptions<T>) {
  const { data, loading, error, execute } = useApi<T>(options);

  const del = useCallback(() => {
    return execute(() => api.delete<ApiResponse<T>>(url).then((res) => res.data));
  }, [execute, url]);

  return {
    data,
    loading,
    error,
    delete: del,
  };
}
