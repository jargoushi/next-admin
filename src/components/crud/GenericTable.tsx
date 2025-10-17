'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import type { TableColumn } from '@/types/crud';

interface GenericTableProps<T = Record<string, unknown>> {
  data: T[];
  loading?: boolean;
  columns: TableColumn<T>[];
  rowKey?: keyof T;
  showSelection?: boolean;
  showIndex?: boolean;
  selectedRowKeys?: string[];
  onSelectionChange?: (rows: T[], keys: string[]) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  onView?: (record: T) => void;
  permissions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
  };
  actions?: {
    label?: string;
    icon?: React.ReactNode;
    onClick: (record: T) => void;
    disabled?: (record: T) => boolean;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  }[];
  className?: string;
}

/**
 * 通用表格组件
 * 支持自定义列配置、选择、操作等功能
 */
export function GenericTable<T extends Record<string, unknown>>({
  data,
  loading = false,
  columns,
  rowKey = 'id',
  showSelection = false,
  showIndex = true,
  selectedRowKeys = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onView,
  permissions = {
    edit: true,
    delete: true,
    view: false,
  },
  actions = [],
  className = '',
}: GenericTableProps<T>) {
  // 获取行唯一标识
  const getRowKey = (record: T): string | number => {
    return record[rowKey] as string | number;
  };

  // 处理选择
  const handleSelectRow = (record: T, checked: boolean) => {
    const key = String(getRowKey(record));
    const newSelectedKeys = checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter((k) => k !== key);

    const selectedRows = data.filter((r) => newSelectedKeys.includes(String(getRowKey(r))));

    onSelectionChange?.(selectedRows, newSelectedKeys);
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    const allKeys = data.map((r) => String(getRowKey(r)));
    const newKeys = checked ? allKeys : [];
    const selectedRows = checked ? data : [];
    onSelectionChange?.(selectedRows, newKeys);
  };

  // 是否全选
  const isAllSelected = data.length > 0 && selectedRowKeys.length === data.length;

  // 渲染单元格内容
  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : null;

    if (column.render) {
      return column.render(value, record, index);
    }

    // 默认渲染逻辑
    if (value === null || value === undefined) {
      return '-';
    }

    // 特殊类型处理
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? '是' : '否'}</Badge>;
    }

    return String(value);
  };

  // 渲染操作列
  const renderActions = (record: T) => {
    const hasCustomActions = actions.length > 0;
    const hasDefaultActions = permissions.edit || permissions.delete || permissions.view;

    if (!hasCustomActions && !hasDefaultActions) {
      return null;
    }

    return (
      <div className="flex items-center gap-1">
        {permissions.view && onView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(record)}
            className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
        {permissions.edit && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(record)}
            className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
        {permissions.delete && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(record)}
            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">暂无数据</div>
      </div>
    );
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            {showSelection && (
              <TableHead className="w-12 border-r border-gray-200 bg-gray-100 text-gray-700 font-medium">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
            )}
            {showIndex && (
              <TableHead className="w-12 text-center border-r border-gray-200 bg-gray-100 text-gray-700 font-medium">
                #
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
                className={`border-r border-gray-200 bg-gray-100 text-gray-700 font-medium ${
                  column.fixed === 'left'
                    ? 'sticky left-0 bg-gray-100'
                    : column.fixed === 'right'
                      ? 'sticky right-0 bg-gray-100'
                      : ''
                }`}
              >
                {column.title}
              </TableHead>
            ))}
            {(permissions.edit || permissions.delete || permissions.view || actions.length > 0) && (
              <TableHead className="w-32 text-center bg-gray-100 text-gray-700 font-medium sticky right-0 bg-gray-100">
                操作
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => {
            const key = getRowKey(record);
            const isSelected = selectedRowKeys.includes(String(key));

            return (
              <TableRow
                key={String(key)}
                className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} border-b border-gray-100`}
              >
                {showSelection && (
                  <TableCell className="w-12 border-r border-gray-100">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(record, checked as boolean)}
                      aria-label={`选择行 ${index + 1}`}
                    />
                  </TableCell>
                )}
                {showIndex && (
                  <TableCell className="w-12 text-center border-r border-gray-100">
                    {index + 1}
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    style={{
                      textAlign: column.align || 'left',
                    }}
                    className={`border-r border-gray-100 py-3 ${
                      column.fixed === 'left'
                        ? 'sticky left-0 bg-white'
                        : column.fixed === 'right'
                          ? 'sticky right-0 bg-white'
                          : ''
                    }`}
                  >
                    {renderCell(column, record, index)}
                  </TableCell>
                ))}
                {(permissions.edit ||
                  permissions.delete ||
                  permissions.view ||
                  actions.length > 0) && (
                  <TableCell className="w-32 text-center sticky right-0 bg-white">
                    {renderActions(record)}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
