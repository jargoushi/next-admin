'use client';

import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenericPaginationProps {
  current: number;
  size: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * 通用分页组件
 * 支持页面大小调整、快速跳转等功能
 */
export function GenericPagination({
  current,
  size,
  total,
  onPageChange,
  loading = false,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}: GenericPaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>('');

  // 计算总页数
  const totalPages = Math.ceil(total / size);

  // 处理页面大小变化
  const handleSizeChange = (newSize: string) => {
    const pageSize = Number(newSize);
    const newPage = Math.min(current, Math.ceil(total / pageSize));
    onPageChange(newPage, pageSize);
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page, size);
    }
  };

  // 处理快速跳转
  const handleJumpSubmit = () => {
    const page = Number(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpPage('');
    }
  };

  // 处理跳转输入框回车
  const handleJumpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpSubmit();
    }
  };

  // 生成页码数组
  const generatePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const currentNum = current;

    if (currentNum <= 4) {
      // 显示前面几页
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentNum >= totalPages - 3) {
      // 显示后面几页
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 显示中间页码
      pages.push(1);
      pages.push('...');
      for (let i = currentNum - 1; i <= currentNum + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  // 即使只有一页数据，也要显示页面大小选择器和总数信息
  // 只有在完全没有数据时才隐藏分页组件
  if (total <= 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* 总数显示 */}
      {showTotal && <div className="text-sm text-muted-foreground">共 {total} 条记录</div>}

      <div className="flex items-center gap-4">
        {/* 分页组件 - 只在有多页时显示分页按钮 */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              {/* 上一页 */}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(current - 1)}
                  disabled={current <= 1 || loading}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
              </PaginationItem>

              {/* 页码 */}
              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={page === current}
                      onClick={() => !loading && handlePageChange(page as number)}
                      className={loading ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* 下一页 */}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(current + 1)}
                  disabled={current >= totalPages || loading}
                  className="gap-1"
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* 页面大小选择器 - 始终显示 */}
        {showSizeChanger && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">每页显示</span>
            <Select value={String(size)} onValueChange={handleSizeChange} disabled={loading}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">条</span>
          </div>
        )}

        {/* 快速跳转 */}
        {showQuickJumper && totalPages > 7 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">跳至</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={handleJumpKeyDown}
              placeholder="页码"
              className="w-16 h-8 px-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              disabled={loading}
            />
            <span className="text-sm text-muted-foreground">页</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleJumpSubmit}
              disabled={loading || !jumpPage}
            >
              确定
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
