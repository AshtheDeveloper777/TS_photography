'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PhotographyImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspectRatioClass?: string;
  objectFit?: 'cover' | 'contain';
}

export default function PhotographyImage({
  src,
  alt,
  fill = true,
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  aspectRatioClass = 'aspect-[4/5]',
  objectFit = 'cover',
}: PhotographyImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div
        className={`relative w-full ${aspectRatioClass} bg-[#EBE7DF] border border-[#D8D2C8] flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <div className="w-10 h-10 mb-3 rounded-full border border-[#B39A72]/40 flex items-center justify-center text-[#B39A72]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="font-editorial text-lg text-[#20201E] italic">{alt || 'Studio Archive'}</p>
        <span className="mt-1 text-[11px] uppercase tracking-editorial-widest text-[#77746F]">
          TS Photography
        </span>
      </div>
    );
  }

  // Ensure URI is properly encoded for filenames with spaces or timestamps
  const cleanSrc = src.includes('%') ? src : encodeURI(src);

  return (
    <div
      className={`relative overflow-hidden ${aspectRatioClass} bg-[#EBE7DF] ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-[#E8E4DC] animate-pulse z-0"
          aria-hidden="true"
        />
      )}

      {fill ? (
        <Image
          src={cleanSrc}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className={`duration-700 ease-out z-10 ${
            isLoading ? 'scale-105 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
          } ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      ) : (
        <Image
          src={cleanSrc}
          alt={alt}
          width={width || 800}
          height={height || 1000}
          unoptimized
          priority={priority}
          sizes={sizes}
          className={`duration-700 ease-out z-10 w-full h-auto ${
            isLoading ? 'scale-105 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
          } ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
