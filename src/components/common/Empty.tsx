'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyProps {
  message?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * 空状态组件
 * 用于显示暂无数据的界面
 */
export function Empty({
  message = '暂无数据',
  description = '当前没有可显示的内容',
  className,
  icon,
}: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 text-muted-foreground">{icon || <Inbox className="h-12 w-12" />}</div>
      <h3 className="mb-2 text-lg font-medium">{message}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

export type { EmptyProps };
export default Empty;
