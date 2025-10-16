'use client';

import { useState, useCallback } from 'react';
import { usePaginatedApi } from '@/hooks/useApi';
import { dictApi } from '@/lib/api';
import { DictSearch } from './components/DictSearch';
import { DictTable } from './components/DictTable';
import { DictPagination } from './components/DictPagination';
import type { DictTypeParams, DictType } from './types/dict';

export default function DictPage() {
  const [searchParams, setSearchParams] = useState<DictTypeParams>({
    dictName: '',
    dictType: '',
    status: 'all',
    serviceName: '',
    dataType: '0',
  });

  // 使用 useCallback 缓存 API 函数，避免不必要的重新创建
  const apiFunction = useCallback(
    async (params: { current?: number; size?: number }) => {
      const request = {
        params: {
          dictName: searchParams.dictName || '',
          dictType: searchParams.dictType || '',
          status: searchParams.status === 'all' ? '' : searchParams.status,
          serviceName: searchParams.serviceName || '',
          dataType: searchParams.dataType || '0',
        },
        current: params.current || 1,
        size: params.size || 10,
      };
      const response = await dictApi.getPageList(request);

      // 转换数据格式以匹配 hook 的期望
      // 注意：API响应结构为 response.data.data.records
      const responseData = response.data.data;
      return {
        data: {
          records: responseData.records || [],
          total: Number(responseData.total || 0),
          current: Number(responseData.current || 1),
          size: Number(responseData.size || 10),
        },
      };
    },
    [searchParams]
  );

  // 使用分页查询 hook
  const { data, total, current, size, loading, error, refetch } = usePaginatedApi<DictType>(
    apiFunction,
    { current: 1, size: 10 },
    { immediate: true }
  );

  // 处理搜索
  const handleSearch = useCallback(
    (params: DictTypeParams) => {
      setSearchParams(params);
      // 重新查询，回到第一页
      refetch({ current: 1, size });
    },
    [refetch, size]
  );

  // 处理分页
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      refetch({ current: page, size: pageSize });
    },
    [refetch]
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">字典管理</h1>
        <p className="text-muted-foreground">
          管理系统中的字典类型配置，包括启用状态、数据类型等信息。
        </p>
      </div>

      {/* 搜索表单 */}
      <DictSearch onSearch={handleSearch} loading={loading} />

      {/* 错误提示 */}
      {error && (
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="text-sm text-destructive">加载失败: {error}</div>
        </div>
      )}

      {/* 数据表格 */}
      <DictTable data={data} loading={loading} />

      {/* 分页组件 */}
      <DictPagination
        current={current}
        size={size}
        total={total}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
