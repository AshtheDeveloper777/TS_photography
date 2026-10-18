'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import { MediaAsset } from '@/lib/types/media';
import PhotographyImage from './photography-image';
import Lightbox from './lightbox';

interface SelectedPortfolioProps {
  photos: MediaAsset[];
  bucketAccessible: boolean;
}

export default function SelectedPortfolio({
  photos,
  bucketAccessible,
}: SelectedPortfolioProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section
      id="portfolio"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#F7F5F0] border-b border-[#D8D2C8]"
      aria-label="Selected Portfolio"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-[#D8D2C8]">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-6 h-[1px] bg-[#B39A72]" />
              <span className="text-[11px] uppercase tracking-editorial-widest text-[#77746F] font-interface">
                Curated Works
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#20201E] font-normal leading-tight">
              Selected <span className="italic font-light">Photographs.</span>
            </h2>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col md:items-end">
            <p className="text-sm text-[#77746F] font-interface max-w-sm mb-4 leading-relaxed">
              Moments captured with quiet observation, honest intention, and natural light.
            </p>
            <Link
              href="/portfolio"
              className="group inline-flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#20201E] hover:text-[#B39A72] transition-colors"
            >
              <span>View Full Archive</span>
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Gallery Grid */}
        {photos && photos.length > 0 ? (
          <div className="space-y-12 md:space-y-20">
            {/* Asymmetrical Editorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Image 0: Large Editorial Feature (Columns 1-7) */}
              {photos[0] && (
                <div
                  className="md:col-span-7 group cursor-pointer"
                  onClick={() => openLightbox(0)}
                >
                  <div className="relative overflow-hidden bg-[#EBE7DF] border border-[#D8D2C8]/60">
                    <PhotographyImage
                      src={photos[0].url}
                      alt={photos[0].title || 'Curated Portfolio photograph'}
                      aspectRatioClass="aspect-[4/5] sm:aspect-[3/4]"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="editorial-image-zoom"
                    />

                    {/* Minimalist Hover Overlay */}
                    <div className="absolute inset-0 bg-[#20201E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-6 text-white z-20">
                      <div>
                        <p className="font-editorial text-2xl italic text-[#FFFFFF]">
                          {photos[0].title}
                        </p>
                        <span className="text-[10px] uppercase tracking-editorial-widest text-[#EBE7DF]">
                          View Fullscreen
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-[#77746F]">
                    <span className="font-editorial text-lg italic text-[#20201E]">
                      {photos[0].title}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest text-[#77746F]">
                      Plate 01
                    </span>
                  </div>
                </div>
              )}

              {/* Image 1: Supporting Vertical Portrait (Columns 8-12) */}
              {photos[1] && (
                <div
                  className="md:col-span-5 md:mt-16 group cursor-pointer"
                  onClick={() => openLightbox(1)}
                >
                  <div className="relative overflow-hidden bg-[#EBE7DF] border border-[#D8D2C8]/60">
                    <PhotographyImage
                      src={photos[1].url}
                      alt={photos[1].title || 'Curated Portfolio photograph'}
                      aspectRatioClass="aspect-[3/4]"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="editorial-image-zoom"
                    />

                    <div className="absolute inset-0 bg-[#20201E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-6 text-white z-20">
                      <div>
                        <p className="font-editorial text-2xl italic text-[#FFFFFF]">
                          {photos[1].title}
                        </p>
                        <span className="text-[10px] uppercase tracking-editorial-widest text-[#EBE7DF]">
                          View Fullscreen
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-[#77746F]">
                    <span className="font-editorial text-lg italic text-[#20201E]">
                      {photos[1].title}
                    </span>
                    <span className="text-[11px] uppercase tracking-widest text-[#77746F]">
                      Plate 02
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Second Row for remaining photos if 3 or 4 photos are present */}
            {(photos[2] || photos[3]) && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start pt-6">
                {/* Image 2: Supporting Vertical / Balanced (Columns 1-5) */}
                {photos[2] && (
                  <div
                    className="md:col-span-5 group cursor-pointer"
                    onClick={() => openLightbox(2)}
                  >
                    <div className="relative overflow-hidden bg-[#EBE7DF] border border-[#D8D2C8]/60">
                      <PhotographyImage
                        src={photos[2].url}
                        alt={photos[2].title || 'Curated Portfolio photograph'}
                        aspectRatioClass="aspect-[4/5]"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="editorial-image-zoom"
                      />

                      <div className="absolute inset-0 bg-[#20201E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-6 text-white z-20">
                        <div>
                          <p className="font-editorial text-2xl italic text-[#FFFFFF]">
                            {photos[2].title}
                          </p>
                          <span className="text-[10px] uppercase tracking-editorial-widest text-[#EBE7DF]">
                            View Fullscreen
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-[#77746F]">
                      <span className="font-editorial text-lg italic text-[#20201E]">
                        {photos[2].title}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-[#77746F]">
                        Plate 03
                      </span>
                    </div>
                  </div>
                )}

                {/* Image 3: Wide Cinematic Anchor (Columns 6-12) */}
                {photos[3] && (
                  <div
                    className="md:col-span-7 group cursor-pointer md:-mt-8"
                    onClick={() => openLightbox(3)}
                  >
                    <div className="relative overflow-hidden bg-[#EBE7DF] border border-[#D8D2C8]/60">
                      <PhotographyImage
                        src={photos[3].url}
                        alt={photos[3].title || 'Curated Portfolio photograph'}
                        aspectRatioClass="aspect-[16/10]"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="editorial-image-zoom"
                      />

                      <div className="absolute inset-0 bg-[#20201E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-6 text-white z-20">
                        <div>
                          <p className="font-editorial text-2xl italic text-[#FFFFFF]">
                            {photos[3].title}
                          </p>
                          <span className="text-[10px] uppercase tracking-editorial-widest text-[#EBE7DF]">
                            View Fullscreen
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-[#77746F]">
                      <span className="font-editorial text-lg italic text-[#20201E]">
                        {photos[3].title}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-[#77746F]">
                        Plate 04
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Polished Empty State */
          <div className="py-20 border border-dashed border-[#D8D2C8] bg-[#EFECE4] text-center p-8">
            <span className="text-xs uppercase tracking-editorial-widest text-[#B39A72] block mb-3">
              Storage Bucket · TS_photography
            </span>
            <p className="font-editorial text-2xl md:text-3xl text-[#20201E] italic mb-3">
              Photographs will appear here dynamically.
            </p>
            <p className="text-xs text-[#77746F] max-w-md mx-auto leading-relaxed">
              Upload photographs to the Supabase Storage bucket{' '}
              <code className="text-[#20201E] bg-[#D8D2C8]/50 px-2 py-0.5 rounded">
                TS_photography
              </code>{' '}
              to showcase your curated portfolio.
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox
        images={photos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
}
