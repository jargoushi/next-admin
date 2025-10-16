'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface DictPaginationProps {
  current: number;
  size: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
  loading?: boolean;
}

const PAGE_SIZE_OPTIONS = [
  { label: '10条/页', value: 10 },
  { label: '20条/页', value: 20 },
  { label: '50条/页', value: 50 },
  { label: '100条/页', value: 100 },
];

export function DictPagination({
  current,
  size,
  total,
  onPageChange,
  loading = false,
}: DictPaginationProps) {
  const totalPages = Math.ceil(total / size);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || loading) return;
    onPageChange(page, size);
  };

  const handlePageSizeChange = (newSize: number) => {
    if (loading) return;
    // 重置到第一页
    onPageChange(1, newSize);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // 总页数少于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={current === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              className={current === i ? 'cursor-default' : ''}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // 总页数较多，需要省略号
      const startPage = Math.max(1, current - 2);
      const endPage = Math.min(totalPages, current + 2);

      // 第一页
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={current === 1}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            className={current === 1 ? 'cursor-default' : ''}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // 前省略号
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // 中间页码
      for (let i = startPage; i <= endPage; i++) {
        if (i === 1 || i === totalPages) continue; // 跳过首尾页
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={current === i}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              className={current === i ? 'cursor-default' : ''}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // 后省略号
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // 最后一页
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={current === totalPages}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              className={current === totalPages ? 'cursor-default' : ''}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (total === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">共 {total} 条记录</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select
                value={size.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
                disabled={loading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(current - 1);
                    }}
                    className={
                      current === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(current + 1);
                    }}
                    className={
                      current === totalPages || loading
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
