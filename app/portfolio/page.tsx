import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getStudioMediaInventory } from '@/lib/supabase/media';
import PortfolioClient from './portfolio-client';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const revalidate = 60;

export const metadata = {
  title: 'Complete Portfolio & Archive · TS Photography',
  description:
    'Browse the complete collection of photographs by TS Photography studio. Honest moments, artfully told.',
};

export default async function PortfolioPage() {
  const inventory = await getStudioMediaInventory();

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#20201E]">
      <Navigation hasVideo={Boolean(inventory.videoAsset)} />

      {/* Header Banner */}
      <div className="pt-36 pb-16 px-6 md:px-12 border-b border-[#D8D2C8] bg-[#EFECE4]">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#77746F] hover:text-[#20201E] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center space-x-3 mb-4">
            <span className="w-6 h-[1px] bg-[#B39A72]" />
            <span className="text-[11px] uppercase tracking-editorial-widest text-[#77746F]">
              The Studio Archive
            </span>
          </div>

          <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl text-[#20201E] font-normal leading-tight">
            Complete <span className="italic font-light">Portfolio.</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-[#77746F] font-interface max-w-xl leading-relaxed">
            Every photograph is retrieved dynamically from the studio storage vault.
          </p>
        </div>
      </div>

      {/* Interactive Gallery with Lightbox and Filter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <PortfolioClient
          allPhotos={inventory.allPhotos}
          bucketAccessible={inventory.bucketAccessible}
        />
      </div>

      <Footer />
    </main>
  );
}
