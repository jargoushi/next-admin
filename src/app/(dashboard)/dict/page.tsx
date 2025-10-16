'use client';

import { useState, useCallback } from 'react';
import { usePaginatedApi } from '@/hooks/useApi';
import { dictApi } from '@/lib/api';
import { DictSearch } from './components/DictSearch';
import { DictTable } from './components/DictTable';
import { DictPagination } from './components/DictPagination';
import { DictEditDialog } from './components/DictEditDialog';
import { toast } from 'sonner';
import type { DictTypeParams, DictType } from '@/lib/api/types';

export default function DictPage() {
  const [searchParams, setSearchParams] = useState<DictTypeParams>({
    dictName: '',
    dictType: '',
    status: 'all',
    serviceName: '',
    dataType: '0',
  });

  // 编辑对话框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDict, setEditingDict] = useState<DictType | null>(null);
  const [editLoading, setEditLoading] = useState(false);

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

  // 处理编辑
  const handleEdit = useCallback((item: DictType) => {
    setEditingDict(item);
    setEditDialogOpen(true);
  }, []);

  // 处理删除
  const handleDelete = useCallback(
    async (item: DictType) => {
      if (!confirm(`确定要删除字典"${item.dictName}"吗？此操作不可撤销。`)) {
        return;
      }

      try {
        await dictApi.removeById(item.dictId);
        toast.success(`字典"${item.dictName}"已成功删除`);
        // 刷新列表
        refetch({ current, size });
      } catch (error) {
        console.error('删除失败:', error);
        toast.error('删除字典时发生错误，请重试');
      }
    },
    [current, size, refetch]
  );

  // 处理编辑提交
  const handleEditSubmit = useCallback(
    async (data: DictType) => {
      setEditLoading(true);
      try {
        await dictApi.editById(data);
        toast.success(`字典"${data.dictName}"已成功${editingDict ? '更新' : '创建'}`);
        // 刷新列表
        refetch({ current, size });
      } catch (error) {
        console.error('提交失败:', error);
        toast.error(`${editingDict ? '更新' : '创建'}字典时发生错误，请重试`);
        throw error; // 重新抛出错误，让对话框保持打开状态
      } finally {
        setEditLoading(false);
      }
    },
    [editingDict, current, size, refetch]
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
      <DictTable data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* 分页组件 */}
      <DictPagination
        current={current}
        size={size}
        total={total}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* 编辑对话框 */}
      <DictEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        dict={editingDict}
        onSubmit={handleEditSubmit}
        loading={editLoading}
      />
    </div>
  );
}
