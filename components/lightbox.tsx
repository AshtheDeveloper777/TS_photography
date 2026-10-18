'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaAsset } from '@/lib/types/media';

interface LightboxProps {
  images: MediaAsset[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#20201E]/95 backdrop-blur-lg flex flex-col justify-between p-4 md:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen photograph viewer"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white/80 z-20">
        <div className="font-interface text-xs uppercase tracking-editorial-widest">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-3 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72]"
          aria-label="Close fullscreen lightbox"
        >
          <X size={26} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Image Display Area */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-2 md:left-6 z-30 p-3 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72] bg-[#20201E]/40 rounded-full"
            aria-label="Previous photograph"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
        )}

        {/* The Photograph */}
        <div className="relative w-full h-full max-h-[82vh] flex items-center justify-center">
          <Image
            src={currentImage.url}
            alt={currentImage.title || 'Studio photograph'}
            fill
            sizes="100vw"
            className="object-contain duration-300"
            priority
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={onNext}
            className="absolute right-2 md:right-6 z-30 p-3 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72] bg-[#20201E]/40 rounded-full"
            aria-label="Next photograph"
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Bottom Caption Bar */}
      <div className="text-center text-white/80 z-20 pb-2">
        <p className="font-editorial text-lg md:text-xl text-[#F7F5F0] italic">
          {currentImage.title || 'Fine Art Photograph'}
        </p>
        <span className="text-[10px] uppercase tracking-editorial-widest text-[#B39A72]">
          TS Photography Collection
        </span>
      </div>
    </div>
  );
}
