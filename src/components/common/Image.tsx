import React from 'react';
import Image from 'next/image';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
}

export default function CustomImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallback = '/placeholder.png',
  priority = false,
}: ImageProps) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 100}
      height={height || 100}
      className={`image-component ${className}`}
      onError={handleError}
      priority={priority}
      unoptimized={imgSrc.startsWith('http')}
    />
  );
}
