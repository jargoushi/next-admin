import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type { CrudConfig, CrudState, CrudActions } from '@/types/crud';
import type { RequestParams } from '@/types/api';
import { useConfirm } from './useConfirm';

/**
 * 通用CRUD Hook
 * 提供完整的增删改查功能，包括状态管理和操作方法
 */
export function useCrud<T extends Record<string, unknown>, CreateParams = Partial<T>>(
  config: CrudConfig<T, CreateParams>
) {
  const { confirm, ConfirmDialog } = useConfirm();
  // 初始化状态
  const [state, setState] = useState<CrudState<T>>({
    // 数据状态
    data: [],
    loading: false,
    error: null,

    // 分页状态
    total: 0,
    current: 1,
    size: config.pagination.defaultPageSize || 10,

    // 搜索状态
    searchParams: config.search.defaultParams || {},

    // 编辑状态
    editDialogOpen: false,
    editingRecord: null,
    editMode: 'create',
    editLoading: false,

    // 选择状态
    selectedRows: [],
    selectedRowKeys: [],
  });

  // 使用ref来避免依赖循环
  const configRef = useRef(config);
  configRef.current = config;

  // 使用ref来避免依赖循环
  const stateRef = useRef(state);
  stateRef.current = state;

  // 内部数据获取函数 - 稳定引用
  const fetchDataInternal = useCallback(async (params?: RequestParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const requestParams = {
        current: params?.current || stateRef.current.current,
        size: params?.size || stateRef.current.size,
        params: {
          ...stateRef.current.searchParams,
          ...params,
        },
      };

      const response = await configRef.current.api.getList(requestParams);

      // 处理响应数据 - 适配器已经处理了格式转换，response.data 直接就是数组
      // 如果适配器提供了 total 字段，则使用它，否则使用数据长度
      const dataList = Array.isArray(response.data) ? response.data : [];
      const totalCount = response.total !== undefined ? response.total : dataList.length;

      setState((prev) => ({
        ...prev,
        data: dataList,
        total: totalCount,
        current: params?.current || stateRef.current.current,
        size: params?.size || stateRef.current.size,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '查询失败';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      toast.error(errorMessage);
    }
  }, []);

  // 获取数据 - 对外暴露的函数
  const fetchData = useCallback(
    async (params?: RequestParams) => {
      await fetchDataInternal(params);
    },
    [fetchDataInternal]
  );

  // 刷新数据 - 避免循环依赖
  const refresh = useCallback(async () => {
    const requestParams = {
      current: stateRef.current.current,
      size: stateRef.current.size,
      params: stateRef.current.searchParams,
    };
    await fetchDataInternal(requestParams);
  }, [fetchDataInternal]);

  // 搜索处理
  const handleSearch = useCallback(
    (params: Record<string, unknown>) => {
      setState((prev) => ({
        ...prev,
        searchParams: params,
        current: 1, // 搜索时回到第一页
      }));
      fetchDataInternal({ current: 1, size: stateRef.current.size, params });
    },
    [fetchDataInternal]
  );

  // 重置搜索
  const handleReset = useCallback(() => {
    const defaultParams = configRef.current.search.defaultParams || {};
    setState((prev) => ({
      ...prev,
      searchParams: defaultParams,
      current: 1,
    }));
    fetchDataInternal({ current: 1, size: stateRef.current.size, params: defaultParams });
  }, [fetchDataInternal]);

  // 分页处理
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      setState((prev) => ({
        ...prev,
        current: page,
        size: pageSize,
      }));
      fetchDataInternal({ current: page, size: pageSize });
    },
    [fetchDataInternal]
  );

  // 新增处理
  const handleCreate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      editDialogOpen: true,
      editingRecord: null,
      editMode: 'create',
    }));
  }, []);

  // 编辑处理
  const handleEdit = useCallback((record: T) => {
    setState((prev) => ({
      ...prev,
      editDialogOpen: true,
      editingRecord: record,
      editMode: 'edit',
    }));
  }, []);

  // 查看处理
  const handleView = useCallback((record: T) => {
    setState((prev) => ({
      ...prev,
      editDialogOpen: true,
      editingRecord: record,
      editMode: 'view', // 使用查看模式
    }));
  }, []);

  // 删除处理
  const handleDelete = useCallback(
    async (record: T) => {
      if (!configRef.current.api.delete) {
        toast.error('删除功能未配置');
        return;
      }

      const idKey = configRef.current.table.rowKey || 'id';
      const id = record[idKey] as string | number;
      const name = record.name || record.title || record.dictName || `ID为${id}的记录`;

      const confirmed = await confirm({
        title: '删除确认',
        description: `确定要删除"${name}"吗？此操作不可撤销。`,
        confirmText: '删除',
        cancelText: '取消',
        variant: 'destructive',
      });

      if (!confirmed) {
        return;
      }

      try {
        await configRef.current.api.delete(id);
        toast.success(`"${name}"已成功删除`);
        await refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '删除失败';
        toast.error(errorMessage);
      }
    },
    [refresh, confirm]
  );

  // 批量删除处理
  const handleBatchDelete = useCallback(
    async (records: T[]) => {
      if (!configRef.current.api.delete) {
        toast.error('删除功能未配置');
        return;
      }

      if (records.length === 0) {
        toast.error('请选择要删除的记录');
        return;
      }

      const confirmed = await confirm({
        title: '批量删除确认',
        description: `确定要删除选中的${records.length}条记录吗？此操作不可撤销。`,
        confirmText: '删除',
        cancelText: '取消',
        variant: 'destructive',
      });

      if (!confirmed) {
        return;
      }

      try {
        const deletePromises = records.map((record) => {
          const idKey = configRef.current.table.rowKey || 'id';
          const id = record[idKey] as string | number;
          return configRef.current.api.delete!(id);
        });

        await Promise.all(deletePromises);
        toast.success(`已成功删除${records.length}条记录`);

        // 清空选择
        setState((prev) => ({
          ...prev,
          selectedRows: [],
          selectedRowKeys: [],
        }));

        await refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '批量删除失败';
        toast.error(errorMessage);
      }
    },
    [refresh, confirm]
  );

  // 提交处理
  const handleSubmit = useCallback(
    async (data: CreateParams | Partial<T>) => {
      setState((prev) => ({ ...prev, editLoading: true }));

      try {
        // 使用 ref 来获取最新的状态，避免依赖问题
        const currentState = stateRef.current;
        if (currentState.editMode === 'create' && configRef.current.api.create) {
          await configRef.current.api.create(data as CreateParams);
          toast.success(`${configRef.current.title}创建成功`);
        } else if (currentState.editMode === 'edit' && configRef.current.api.update) {
          const idKey = configRef.current.table.rowKey || 'id';
          const id = currentState.editingRecord![idKey] as string | number;
          await configRef.current.api.update(id, data as Partial<T>);
          toast.success(`${configRef.current.title}更新成功`);
        } else {
          throw new Error('当前操作模式未配置对应的API方法');
        }

        setState((prev) => ({
          ...prev,
          editDialogOpen: false,
          editingRecord: null,
          editLoading: false,
        }));

        await refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '提交失败';
        toast.error(errorMessage);
        setState((prev) => ({ ...prev, editLoading: false }));
        throw error; // 重新抛出错误，让表单组件处理
      }
    },
    [refresh]
  );

  // 取消编辑
  const handleCancel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      editDialogOpen: false,
      editingRecord: null,
      editLoading: false,
    }));
  }, []);

  // 选择处理
  const handleSelectionChange = useCallback((rows: T[], keys: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedRows: rows,
      selectedRowKeys: keys,
    }));
  }, []);

  // 全选处理
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const idKey = configRef.current.table.rowKey || 'id';
      const allKeys = stateRef.current.data.map((item) => String(item[idKey]));
      setState((prev) => ({
        ...prev,
        selectedRows: stateRef.current.data,
        selectedRowKeys: allKeys,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        selectedRows: [],
        selectedRowKeys: [],
      }));
    }
  }, []);

  // 构建actions对象
  const actions: CrudActions<T, CreateParams> = {
    fetchData,
    handleSearch,
    handleReset,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleBatchDelete,
    handleSubmit,
    handleCancel,
    handleSelectionChange,
    handleSelectAll,
  };

  return {
    state,
    actions,
    ConfirmDialog,
  };
}
