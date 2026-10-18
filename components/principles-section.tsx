'use client';

import { StudioPrinciple } from '@/lib/types/media';

interface PrinciplesSectionProps {
  principles: StudioPrinciple[];
}

export default function PrinciplesSection({
  principles,
}: PrinciplesSectionProps) {
  return (
    <section
      id="experience"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#20201E] text-white border-b border-white/10"
      aria-label="The TS Experience & Principles"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-6 h-[1px] bg-[#B39A72]" />
            <span className="text-[11px] uppercase tracking-editorial-widest text-[#B39A72] font-interface">
              The TS Experience
            </span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#FFFFFF] font-normal leading-tight">
            Guiding Principles of <br />
            <span className="italic font-light text-[#F7F5F0]">Our Craft.</span>
          </h2>
        </div>

        {/* 4 Studio Principles in an Editorial Typographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/15">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className={`pt-8 md:pt-0 ${
                index > 0 ? 'md:pl-8 lg:pl-10' : ''
              } flex flex-col justify-between`}
            >
              <div>
                <span className="font-editorial text-3xl md:text-4xl text-[#B39A72] block mb-4">
                  {principle.number}
                </span>

                <h3 className="font-editorial text-2xl md:text-3xl text-[#FFFFFF] mb-4 font-normal">
                  {principle.title}
                </h3>

                <p className="font-interface text-sm text-[#D8D2C8] leading-relaxed font-light">
                  {principle.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-editorial-widest text-white/40">
                  Standard of Work
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
