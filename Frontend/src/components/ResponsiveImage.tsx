import React, { useState } from 'react';

const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /**
   * Image filename or path
   * Can be just filename like 'aboutus1.webp' or path like '../img/aboutus1'
   * Component will automatically strip extension and serve .avif, .webp, .jpg
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
 * Automatically serves:
 * - AVIF for modern browsers (best compression)
 * - WebP as fallback (good compression)
 * - Original format (JPG/PNG) as last fallback
 * 
 * Supports responsive images with srcSet for different screen sizes
 * 
 * @example
 * // Simple usage - just filename
 * <ResponsiveImage
 *   src="aboutus1.webp"
 *   alt="About us 1"
 *   className="w-full h-auto"
 * />
 * 
 * // Or with path
 * <ResponsiveImage
 *   src="../img/aboutus1.webp"
 *   alt="About us 1"
 * />
 * 
 * @example
 * // With responsive sizes
 * <ResponsiveImage
 *   src="aboutus1.webp"
 *   srcSet={{
 *     480: 'aboutus1-sm',   // 480px width version
 *     768: 'aboutus1-md',   // 768px width version
 *     1280: 'aboutus1-lg'   // 1280px width version
 *   }}
 *   sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1280px"
 *   alt="About us 1"
 * />
 */
export function ResponsiveImage({
  src,
  srcSet,
  sizes,
  alt = '',
  loading = 'lazy',
  decoding = 'async',
  className = '',
  ...rest
}: ResponsiveImageProps) {
  const [didError, setDidError] = useState(false);

  // Extract filename from Vite-processed URL (e.g., /assets/image-hash.webp -> image)
  const getFilenameBase = (url: string): string => {
    const match = url.match(/\/([^/]+)-[a-zA-Z0-9]+\.(webp|jpg|jpeg|png|gif)$/i);
    if (match) return match[1]; // Returns "carrusel1" from "carrusel1-hash.webp"
    // Fallback: just remove extension
    return url.replace(/\.(webp|jpg|jpeg|png|gif)$/i, '');
  };

  // Check if this is a Vite asset URL
  const isViteAsset = src.includes('/assets/');
  
  // For Vite assets, construct public folder paths
  // For other paths, use the src as-is
  const srcBase = isViteAsset ? `/img/${getFilenameBase(src)}` : src.replace(/\.(webp|jpg|jpeg|png|gif)$/i, '');
  
  // Determine original extension
  const extMatch = src.match(/\.(webp|jpg|jpeg|png|gif)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

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
      {/* AVIF format - best compression */}
      <source
        srcSet={buildResponsiveSrcSet()}
        sizes={sizes}
        type="image/avif"
      />

      {/* WebP format - good compression */}
      <source
        srcSet={srcSet
          ? Object.entries(srcSet)
            .map(([width, path]) => `${path}.webp ${width}w`)
            .join(', ')
          : `${srcBase}.webp 1x`
        }
        sizes={sizes}
        type="image/webp"
      />

      {/* Original format as fallback */}
      <img
        src={`${srcBase}.${ext}`}
        srcSet={srcSet
          ? Object.entries(srcSet)
            .map(([width, path]) => `${path}.${ext} ${width}w`)
            .join(', ')
          : undefined
        }
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={className}
        onError={handleError}
        {...rest}
      />
    </picture>
  );
}
