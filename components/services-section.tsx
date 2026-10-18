'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PhotographyService, MediaAsset } from '@/lib/types/media';

interface ServicesSectionProps {
  services: PhotographyService[];
  coverPhotos?: MediaAsset[];
}

export default function ServicesSection({
  services,
}: ServicesSectionProps) {
  const activeServices = services.filter((s) => s.active).sort((a, b) => a.order - b.order);

  return (
    <section
      id="services"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#F7F5F0] border-b border-[#D8D2C8]"
      aria-label="Photography Services"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-[#D8D2C8]">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-6 h-[1px] bg-[#B39A72]" />
              <span className="text-[11px] uppercase tracking-editorial-widest text-[#77746F] font-interface">
                Offerings &amp; Commissions
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#20201E] font-normal leading-tight">
              Photography <span className="italic font-light">Services.</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-sm text-[#77746F] font-interface max-w-sm leading-relaxed">
            Tailored creative coverage shaped around your specific vision, aesthetic, and celebration.
          </p>
        </div>

        {/* Editorial Services List */}
        <div className="divide-y divide-[#D8D2C8]">
          {activeServices.map((service, index) => (
            <div
              key={service.id}
              className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start group hover:bg-[#EFECE4]/50 transition-colors duration-300 px-4 md:px-6"
            >
              {/* Order Number */}
              <div className="md:col-span-1">
                <span className="text-xs uppercase tracking-editorial-widest text-[#B39A72] font-interface">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Title */}
              <div className="md:col-span-4">
                <h3 className="font-editorial text-2xl md:text-3xl lg:text-4xl text-[#20201E] group-hover:text-[#B39A72] transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm md:text-base text-[#77746F] font-interface leading-relaxed mb-2">
                  {service.shortDesc}
                </p>
                <p className="text-xs text-[#9E9A92] font-interface leading-relaxed">
                  {service.detailedDesc}
                </p>
              </div>

              {/* Action Link */}
              <div className="md:col-span-2 flex md:justify-end items-center pt-2 md:pt-0">
                <Link
                  href={`/#contact?service=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#20201E] group-hover:text-[#B39A72] transition-colors"
                >
                  <span>Enquire</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 pt-8 border-t border-[#D8D2C8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77746F]">
          <span>Every commission includes an initial consultation and tailored artistic direction.</span>
          <Link
            href="/#contact"
            className="mt-4 sm:mt-0 underline underline-offset-4 hover:text-[#20201E] transition-colors"
          >
            Request a Custom Quote &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
