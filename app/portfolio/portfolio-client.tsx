'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { MediaAsset } from '@/lib/types/media';
import PhotographyImage from '@/components/photography-image';
import Lightbox from '@/components/lightbox';

interface PortfolioClientProps {
  allPhotos: MediaAsset[];
  bucketAccessible: boolean;
}

export default function PortfolioClient({
  allPhotos,
  bucketAccessible,
}: PortfolioClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  if (!allPhotos || allPhotos.length === 0) {
    return (
      <div className="py-24 text-center border border-dashed border-[#D8D2C8] bg-[#EFECE4] p-8">
        <span className="text-xs uppercase tracking-editorial-widest text-[#B39A72] block mb-3">
          Supabase Storage · TS_photography
        </span>
        <h2 className="font-editorial text-2xl md:text-3xl text-[#20201E] italic mb-3">
          No photographs currently detected in the bucket.
        </h2>
        <p className="text-xs text-[#77746F] max-w-md mx-auto leading-relaxed">
          When photographs are uploaded to your Supabase Storage bucket <code>TS_photography</code>,
          they will automatically display here in responsive high resolution.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {allPhotos.map((photo, index) => (
          <div
            key={photo.id || photo.name}
            className="group cursor-pointer flex flex-col justify-between"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden bg-[#EBE7DF] border border-[#D8D2C8]/60">
              <PhotographyImage
                src={photo.url}
                alt={photo.title || 'Studio photograph'}
                aspectRatioClass="aspect-[4/5]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="editorial-image-zoom"
              />

              <div className="absolute inset-0 bg-[#20201E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6 text-white z-20">
                <div>
                  <p className="font-editorial text-xl italic text-white">
                    {photo.title}
                  </p>
                  <span className="text-[10px] uppercase tracking-editorial-widest text-[#EBE7DF]">
                    View Fullscreen
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#77746F]">
              <span className="font-editorial text-lg italic text-[#20201E]">
                {photo.title}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#77746F]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={allPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
