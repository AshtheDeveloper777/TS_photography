'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { MediaAsset } from '@/lib/types/media';

interface HeroProps {
  heroPhoto: MediaAsset | null;
  bucketAccessible: boolean;
}

export default function Hero({ heroPhoto, bucketAccessible }: HeroProps) {
  return (
    <section
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#20201E] text-white"
      aria-label="TS Photography Hero"
    >
      {/* Background Hero Image */}
      {heroPhoto?.url ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroPhoto.url}
            alt={heroPhoto.title || 'TS Photography signature portrait'}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100 duration-1000 ease-out"
          />
          {/* Editorial subtle gradient overlays for readability while letting photograph shine */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#20201E]/90 via-[#20201E]/30 to-[#20201E]/40" />
          <div className="absolute inset-0 bg-[#20201E]/20" />
        </div>
      ) : (
        /* Editorial Fallback Hero Graphic when bucket is empty or loading */
        <div className="absolute inset-0 z-0 bg-[#20201E] flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B39A72_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="border border-[#77746F]/30 p-12 md:p-24 text-center max-w-xl mx-6">
            <span className="text-xs uppercase tracking-editorial-widest text-[#B39A72] block mb-4">
              TS Photography Archive
            </span>
            <p className="font-editorial text-2xl md:text-3xl text-[#F7F5F0] italic">
              “Photography is the art of seeing what remains invisible to others.”
            </p>
            {!bucketAccessible && (
              <span className="inline-block mt-6 px-3 py-1 text-[11px] uppercase tracking-wider text-[#D8D2C8] bg-white/10 border border-white/20">
                Storage: TS_photography
              </span>
            )}
          </div>
        </div>
      )}

      {/* Top Spacer for Nav */}
      <div className="h-28" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-12">
        <div className="max-w-3xl">
          {/* Sub-label */}
          <div className="flex items-center space-x-3 mb-6">
            <span className="w-8 h-[1px] bg-[#B39A72]" />
            <span className="text-[11px] md:text-xs uppercase tracking-editorial-widest text-[#EBE7DF] font-interface">
              TS PHOTOGRAPHY · YOUR MOMENTS, BEAUTIFULLY TOLD
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-[#FFFFFF] mb-6 drop-shadow-sm">
            Every Frame <br />
            <span className="italic font-light text-[#F7F5F0]">Tells a Story.</span>
          </h1>

          {/* Supporting Text */}
          <p className="font-interface text-base md:text-xl text-[#D8D2C8] font-light max-w-xl leading-relaxed mb-10">
            Honest moments. Artful perspectives. Timeless photographs.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <Link
              href="#portfolio"
              className="px-8 py-4 bg-[#FFFFFF] text-[#20201E] text-xs uppercase tracking-editorial-widest font-interface text-center transition-all duration-300 hover:bg-[#B39A72] hover:text-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
            >
              Explore Our Work
            </Link>

            <Link
              href="#contact"
              className="px-8 py-4 bg-transparent text-[#FFFFFF] border border-[#FFFFFF]/60 text-xs uppercase tracking-editorial-widest font-interface text-center transition-all duration-300 hover:bg-[#FFFFFF]/15 hover:border-[#FFFFFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
            >
              Book Your Session
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Bar with Scroll Indicator */}
      <div className="relative z-10 border-t border-white/15 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] tracking-editorial-wide uppercase text-white/60 font-interface">
            Editorial Portfolio &amp; Fine Art Studio
          </div>

          <Link
            href="#portfolio"
            className="group flex items-center space-x-2 text-[11px] uppercase tracking-editorial-widest text-[#D8D2C8] hover:text-white transition-colors"
            aria-label="Scroll to selected portfolio"
          >
            <span>Scroll to Discover</span>
            <ArrowDown
              size={14}
              className="group-hover:translate-y-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
