import React, { useState } from 'react';

const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /**
   * Image source - can be:
   * - A Vite-imported image (processed URL like /assets/image-hash.avif)
   * - A filename like 'aboutus1.avif'
   * - A path like '../img/aboutus1.avif'
   */
  src: string;
  /**
   * Optional: srcSet for responsive images
   * e.g., { 640: 'aboutus1-sm', 1024: 'aboutus1-md', 1920: 'aboutus1-lg' }
   */
  srcSet?: Record<number, string>;
  /**
   * Optional: sizes for responsive images
   * e.g., '(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px'
   */
  sizes?: string;
}

/**
 * ResponsiveImage Component
 * 
 * Handles both Vite-processed URLs and static paths.
 * For Vite imports, uses the image directly.
 * For static paths, creates picture element with AVIF format.
 */
export function ResponsiveImage({
  src,
  srcSet,
  sizes,
  alt = '',
  loading = 'lazy',
  decoding = 'async',
  className = '',
  fetchPriority,
  ...rest
}: ResponsiveImageProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  // If error occurred, show placeholder
  if (didError) {
    return (
      <div className={`inline-block bg-gray-100 text-center align-middle ${className}`}>
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            loading={loading}
            decoding={decoding}
            {...rest}
            data-original-url={src}
          />
        </div>
      </div>
    );
  }

  // Check if this is already a Vite-processed asset URL
  // These contain /assets/ or have a hash pattern like image-AbCdEf12.avif
  const isProcessedUrl = src.includes('/assets/') || /[-_][a-zA-Z0-9]{8,}\.(avif|webp|jpg|jpeg|png|gif)$/i.test(src);
  
  // If it's already a processed URL from Vite import, use it directly
  if (isProcessedUrl) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={className}
        onError={handleError}
        // @ts-expect-error - React expects lowercase fetchpriority for DOM, but types use camelCase
        fetchpriority={fetchPriority}
        {...rest}
      />
    );
  }

  // For non-processed URLs, strip extension and build picture element
  const srcBase = src.replace(/\.(avif|webp|jpg|jpeg|png|gif)$/i, '');

  // Build srcSet with AVIF support
  const buildSrcSet = (base: string): string => {
    return `${base}.avif 1x`;
  };

  // Build responsive srcSet with AVIF support
  const buildResponsiveSrcSet = (): string => {
    if (!srcSet) return buildSrcSet(srcBase);

    return Object.entries(srcSet)
      .map(([width, path]) => `${path}.avif ${width}w`)
      .join(', ');
  };

  return (
    <picture>
      {/* AVIF format */}
      <source
        srcSet={buildResponsiveSrcSet()}
        sizes={sizes}
        type="image/avif"
      />

      {/* Fallback img with AVIF */}
      <img
        src={`${srcBase}.avif`}
        srcSet={srcSet
          ? Object.entries(srcSet)
            .map(([width, path]) => `${path}.avif ${width}w`)
            .join(', ')
          : undefined
        }
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={className}
        onError={handleError}
        // @ts-expect-error - React expects lowercase fetchpriority for DOM, but types use camelCase
        fetchpriority={fetchPriority}
        {...rest}
      />
    </picture>
  );
}
