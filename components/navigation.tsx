'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  hasVideo?: boolean;
}

export default function Navigation({ hasVideo = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Services', href: '/#services' },
    ...(hasVideo ? [{ label: 'Cinema', href: '/#cinema' }] : []),
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#D8D2C8] py-4 shadow-sm'
            : 'bg-gradient-to-b from-[#20201E]/40 via-[#20201E]/10 to-transparent text-white py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Wordmark Logo */}
          <Link
            href="/"
            className="group flex flex-col focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72]"
            aria-label="TS Photography Home"
          >
            <span
              className={`font-editorial text-2xl md:text-3xl tracking-editorial-wide transition-colors ${
                scrolled
                  ? 'text-[#20201E] group-hover:text-[#B39A72]'
                  : 'text-[#FFFFFF] group-hover:text-[#EBE7DF]'
              }`}
            >
              TS PHOTOGRAPHY
            </span>
            <span
              className={`text-[9px] uppercase tracking-editorial-widest -mt-1 font-interface transition-colors ${
                scrolled ? 'text-[#77746F]' : 'text-white/70'
              }`}
            >
              Editorial &amp; Fine Art Studio
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-8"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs uppercase tracking-editorial-widest font-interface transition-all duration-200 relative py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72] ${
                  scrolled
                    ? 'text-[#20201E] hover:text-[#B39A72]'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/#contact"
              className={`text-xs uppercase tracking-editorial-widest px-5 py-2.5 transition-all duration-300 font-interface focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72] ${
                scrolled
                  ? 'bg-[#20201E] text-[#F7F5F0] hover:bg-[#B39A72] hover:text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#20201E] hover:bg-[#B39A72] hover:text-[#FFFFFF]'
              }`}
            >
              Book a Session
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72] ${
              scrolled ? 'text-[#20201E]' : 'text-white'
            }`}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#20201E]/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#F7F5F0] z-50 p-8 flex flex-col justify-between transform transition-transform duration-500 ease-in-out lg:hidden border-l border-[#D8D2C8] ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div>
          <div className="flex items-center justify-between pb-8 border-b border-[#D8D2C8]">
            <span className="font-editorial text-2xl text-[#20201E] tracking-editorial-wide">
              TS PHOTOGRAPHY
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#20201E] hover:text-[#B39A72] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B39A72]"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="mt-8 flex flex-col space-y-6" aria-label="Mobile Links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-editorial text-2xl text-[#20201E] hover:text-[#B39A72] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-[#D8D2C8]">
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full py-4 bg-[#20201E] text-[#F7F5F0] text-center text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] transition-colors"
          >
            Book Your Session
          </Link>
          <p className="mt-6 text-center text-[11px] text-[#77746F] tracking-wider uppercase">
            Honest moments · Artfully told
          </p>
        </div>
      </div>
    </>
  );
}
