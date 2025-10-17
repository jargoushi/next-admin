'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 图片组件
 * 提供加载失败回退和优化的图片显示功能
 */
export function CustomImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallback = '/placeholder.png',
  priority = false,
  fill = false,
  sizes,
  style,
  onLoad,
  onError,
}: ImageProps) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
      setIsLoading(false);
      onError?.();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // 重置状态当 src 改变时
  React.useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, imgSrc]);

  const imageProps = {
    src: imgSrc,
    alt,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    unoptimized: imgSrc.startsWith('http') || imgSrc.startsWith('data:'),
  };

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', className)} style={style}>
        {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
        <Image
          {...imageProps}
          fill
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} style={style}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse rounded-md"
          style={{ width, height }}
        />
      )}
      <Image
        {...imageProps}
        width={width || 100}
        height={height || 100}
        className={cn('transition-opacity duration-300', isLoading ? 'opacity-0' : 'opacity-100')}
      />
    </div>
  );
}

export type { ImageProps };
export default CustomImage;
