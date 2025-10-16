'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Empty from '@/components/common/Empty';
import Loading from '@/components/common/Loading';
import type { DictType } from '@/types/dict';

interface DictTableProps {
  data: DictType[];
  loading?: boolean;
  onEdit?: (item: DictType) => void;
  onDelete?: (item: DictType) => void;
}

export function DictTable({ data, loading = false, onEdit, onDelete }: DictTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case '0':
        return <Badge variant="default">启用</Badge>;
      case '1':
        return <Badge variant="secondary">禁用</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  const getDataTypeBadge = (dataType: number) => {
    switch (dataType) {
      case 0:
        return <Badge variant="outline">系统字典</Badge>;
      case 1:
        return <Badge>业务字典</Badge>;
      default:
        return <Badge variant="destructive">未知</Badge>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '-';
    return dateTime;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <Loading message="加载中..." />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <Empty description="暂无字典数据" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>字典列表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">字典ID</TableHead>
                <TableHead className="w-[150px]">服务名称</TableHead>
                <TableHead className="w-[200px]">字典名称</TableHead>
                <TableHead className="w-[200px]">字典类型</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[120px]">数据类型</TableHead>
                <TableHead className="w-[120px]">创建人</TableHead>
                <TableHead className="w-[150px]">创建时间</TableHead>
                <TableHead className="w-[120px]">更新人</TableHead>
                <TableHead className="w-[150px]">更新时间</TableHead>
                <TableHead className="w-[200px]">备注</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.dictId}>
                  <TableCell className="font-medium">{item.dictId}</TableCell>
                  <TableCell>{item.serviceName}</TableCell>
                  <TableCell className="font-medium">{item.dictName}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">{item.dictType}</code>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{getDataTypeBadge(item.dataType)}</TableCell>
                  <TableCell>{item.createUserNickName}</TableCell>
                  <TableCell>{formatDateTime(item.createTime)}</TableCell>
                  <TableCell>{item.updateUserNickName || '-'}</TableCell>
                  <TableCell>{formatDateTime(item.updateTime || '')}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={item.remark}>
                      {item.remark || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">打开菜单</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(item)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
