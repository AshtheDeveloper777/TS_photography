'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#20201E] text-white py-16 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <span className="font-editorial text-3xl md:text-4xl tracking-editorial-wide text-white block mb-2">
              TS PHOTOGRAPHY
            </span>
            <p className="text-xs uppercase tracking-editorial-widest text-[#B39A72] font-interface mb-6">
              Editorial &amp; Fine Art Studio
            </p>
            <p className="text-sm text-[#D8D2C8] max-w-sm font-light leading-relaxed">
              Honest moments. Artful perspectives. Timeless photographs. Capturing stories with intention and refined visual balance.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <span className="text-[11px] uppercase tracking-editorial-widest text-white/50 block mb-4">
              Explore
            </span>
            <ul className="space-y-3 text-xs uppercase tracking-editorial-wide font-interface text-[#D8D2C8]">
              <li>
                <Link href="/#portfolio" className="hover:text-white transition-colors">
                  Selected Portfolio
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Complete Archive
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About the Studio
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-white transition-colors">
                  The TS Experience
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  Book a Session
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Archive Information */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-editorial-widest text-white/50 block mb-4">
                Media Repository
              </span>
              <p className="text-xs text-[#D8D2C8] leading-relaxed mb-4">
                Dynamic image and motion delivery powered by Supabase Storage bucket{' '}
                <code className="text-[#F7F5F0] bg-white/10 px-2 py-0.5 rounded text-[11px]">
                  TS_photography
                </code>
                .
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#B39A72] hover:text-white transition-colors pt-4"
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#77746F] tracking-wide">
          <p>&copy; {new Date().getFullYear()} TS Photography. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Every Frame Tells a Story &middot; Handcrafted Creative Direction
          </p>
        </div>
      </div>
    </footer>
  );
}
