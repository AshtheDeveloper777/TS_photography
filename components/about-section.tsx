'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MediaAsset } from '@/lib/types/media';
import PhotographyImage from './photography-image';

interface AboutSectionProps {
  headline: string;
  introCopy: string;
  photo?: MediaAsset | null;
  customImageUrl?: string;
}

export default function AboutSection({
  headline,
  introCopy,
  photo,
  customImageUrl,
}: AboutSectionProps) {
  const imageSrc = customImageUrl || photo?.url;

  return (
    <section
      id="about"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#F7F5F0] border-b border-[#D8D2C8]"
      aria-label="About TS Photography Studio"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Studio Editorial Visual */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {imageSrc ? (
                <div className="relative overflow-hidden border border-[#D8D2C8] shadow-editorial">
                  <PhotographyImage
                    src={imageSrc}
                    alt="Tholkappiyan A - TS Photography studio"
                    aspectRatioClass="aspect-[4/5]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#F7F5F0]/90 backdrop-blur-sm p-4 border border-[#D8D2C8]">
                    <span className="text-[10px] uppercase tracking-editorial-widest text-[#B39A72] block">
                      Tholkappiyan A &middot; Founder
                    </span>
                    <p className="font-editorial text-sm italic text-[#20201E]">
                      TS Photography Studio
                    </p>
                  </div>
                </div>
              ) : (
                /* Editorial Graphic if no separate photo is designated */
                <div className="aspect-[4/5] bg-[#EBE7DF] border border-[#D8D2C8] flex flex-col justify-between p-8 md:p-12">
                  <span className="text-xs uppercase tracking-editorial-widest text-[#B39A72]">
                    Studio Monograph
                  </span>
                  <div>
                    <span className="font-editorial text-6xl text-[#20201E]/20 block mb-4">
                      &ldquo;
                    </span>
                    <p className="font-editorial text-2xl md:text-3xl text-[#20201E] italic leading-snug">
                      Preserving moments before they become memories.
                    </p>
                  </div>
                  <span className="text-[11px] uppercase tracking-editorial-widest text-[#77746F]">
                    TS Photography Studio
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Introduction Text */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-6 h-[1px] bg-[#B39A72]" />
              <span className="text-[11px] uppercase tracking-editorial-widest text-[#77746F] font-interface">
                About the Studio
              </span>
            </div>

            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#20201E] font-normal leading-tight mb-8">
              {headline}
            </h2>

            <div className="space-y-6 text-[#77746F] font-interface text-base md:text-lg leading-relaxed font-light">
              <p>{introCopy}</p>
              <p>
                We believe that the most meaningful photographs are not manufactured through rigid poses,
                but uncovered through patience, observation, and an appreciation for the atmosphere that surrounds you.
              </p>
              <p className="text-sm text-[#9E9A92]">
                Whether documenting the sacred celebration of a wedding or crafting an intimate portrait,
                our work is guided by honesty, timeless aesthetics, and a deep respect for your individual narrative.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-[#D8D2C8] flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <Link
                href="/#portfolio"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#20201E] hover:text-[#B39A72] transition-colors"
              >
                <span>Explore the Portfolio</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/#contact"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#B39A72] hover:text-[#20201E] transition-colors"
              >
                <span>Inquire for Your Date</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
