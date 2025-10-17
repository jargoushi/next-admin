'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Download, Upload } from 'lucide-react';
import { GenericTable } from './GenericTable';
import { GenericSearchForm } from './GenericSearchForm';
import { GenericEditDialog } from './GenericEditDialog';
import { GenericPagination } from './GenericPagination';
import { useCrud } from '@/hooks/useCrud';
import type { CrudConfig } from '@/types/crud';

interface CrudPageProps<T = Record<string, unknown>, CreateParams = Partial<T>> {
  config: CrudConfig<T, CreateParams>;
  className?: string;
}

/**
 * 通用CRUD页面组件
 * 提供完整的增删改查页面功能
 */
export function CrudPage<T extends Record<string, unknown>, CreateParams = Partial<T>>({
  config,
  className = '',
}: CrudPageProps<T, CreateParams>) {
  const { state, actions } = useCrud<T, CreateParams>(config);

  // 使用 ref 来避免 actions 变化导致的重复调用
  const hasInitialized = useRef(false);

  // 初始化时加载数据 - 只执行一次
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      actions.fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.fetchData]); // 只依赖 fetchData 函数，使用 ref 避免重复调用

  // 处理表格操作
  const handleTableEdit = (record: T) => {
    actions.handleEdit(record);
  };

  const handleTableDelete = (record: T) => {
    actions.handleDelete(record);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: CreateParams | Partial<T>) => {
    await actions.handleSubmit(data);
  };

  // 处理批量操作
  const handleBatchDelete = () => {
    if (state.selectedRows.length > 0) {
      actions.handleBatchDelete(state.selectedRows);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 页面标题和操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
          {config.description && <p className="text-muted-foreground mt-2">{config.description}</p>}
        </div>
        <div className="flex gap-2">
          {config.features?.enableRefresh !== false && (
            <Button variant="outline" size="sm" onClick={actions.refresh} disabled={state.loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${state.loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          )}
          {config.features?.enableExport && (
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
          )}
          {config.features?.enableImport && (
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              导入
            </Button>
          )}
          {config.permissions?.create !== false && config.api.create && (
            <Button onClick={actions.handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新建
            </Button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {state.error && (
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="text-sm text-destructive">{state.error}</div>
        </div>
      )}

      {/* 搜索表单 */}
      {config.features?.enableSearch !== false && (
        <GenericSearchForm
          fields={config.search.fields}
          defaultParams={config.search.defaultParams}
          onSearch={actions.handleSearch}
          onReset={actions.handleReset}
          loading={state.loading}
          collapsed={true}
          collapsible={config.search.fields.length > 3}
        />
      )}

      {/* 批量操作栏 */}
      {config.features?.enableBatchDelete && state.selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
          <div className="text-sm text-muted-foreground">已选择 {state.selectedRows.length} 项</div>
          <div className="flex gap-2">
            {config.permissions?.delete !== false && (
              <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                批量删除
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => actions.handleSelectionChange([], [])}
            >
              取消选择
            </Button>
          </div>
        </div>
      )}

      {/* 数据表格 */}
      <GenericTable
        data={state.data}
        loading={state.loading}
        columns={config.table.columns}
        rowKey={config.table.rowKey}
        showSelection={config.table.showSelection}
        showIndex={config.table.showIndex}
        selectedRowKeys={state.selectedRowKeys}
        onSelectionChange={actions.handleSelectionChange}
        onEdit={config.permissions?.edit !== false ? handleTableEdit : undefined}
        onDelete={config.permissions?.delete !== false ? handleTableDelete : undefined}
        permissions={config.permissions}
        actions={config.table.columns.find((col) => col.key === 'actions')?.render ? [] : undefined}
      />

      {/* 分页组件 */}
      <GenericPagination
        current={state.current}
        size={state.size}
        total={state.total}
        onPageChange={actions.handlePageChange}
        loading={state.loading}
        showSizeChanger={config.pagination.showSizeChanger}
        showQuickJumper={config.pagination.showQuickJumper}
        showTotal={config.pagination.showTotal}
        pageSizeOptions={config.pagination.pageSizeOptions}
      />

      {/* 编辑对话框 */}
      <GenericEditDialog
        open={state.editDialogOpen}
        onOpenChange={actions.handleCancel}
        record={state.editingRecord}
        fields={config.edit.fields}
        onSubmit={handleFormSubmit}
        mode={state.editMode}
        title={state.editMode === 'create' ? `新建${config.title}` : `编辑${config.title}`}
        layout={config.edit.layout}
        width="md"
      />
    </div>
  );
}
