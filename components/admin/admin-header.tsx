'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Inbox,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { signOutAdmin } from '@/app/actions/auth';

interface AdminHeaderProps {
  userEmail?: string;
}

export default function AdminHeader({ userEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Media Management', href: '/admin/media', icon: ImageIcon },
    { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#D8D2C8] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Portal Badge */}
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-3">
              <span className="font-editorial text-2xl text-[#20201E] tracking-editorial-wide">
                TS PHOTOGRAPHY
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-editorial-widest bg-[#F7F5F0] border border-[#D8D2C8] text-[#B39A72]">
                Admin
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 pl-4 border-l border-[#D8D2C8]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 text-xs uppercase tracking-editorial-widest transition-colors ${
                      isActive
                        ? 'text-[#20201E] font-medium border-b-2 border-[#B39A72] bg-[#F7F5F0]'
                        : 'text-[#77746F] hover:text-[#20201E] hover:bg-[#F7F5F0]/60'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: User info, View Site, Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {userEmail && (
              <div className="flex items-center space-x-1.5 text-xs text-[#77746F] border-r border-[#D8D2C8] pr-4">
                <ShieldCheck size={14} className="text-[#B39A72]" />
                <span className="truncate max-w-[180px]">{userEmail}</span>
              </div>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-[#77746F] hover:text-[#20201E] transition-colors"
              title="Open public website in a new tab"
            >
              <span>View Site</span>
              <ExternalLink size={13} />
            </Link>

            <form action={signOutAdmin}>
              <button
                type="submit"
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#F7F5F0] hover:bg-[#EAE5DA] text-[#20201E] text-xs uppercase tracking-editorial-widest border border-[#D8D2C8] transition-colors"
                title="Sign out of admin session"
              >
                <LogOut size={13} />
                <span>Exit</span>
              </button>
            </form>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#20201E] hover:text-[#B39A72] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#D8D2C8] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-xs uppercase tracking-editorial-widest ${
                    isActive
                      ? 'bg-[#F7F5F0] text-[#20201E] font-medium border-l-2 border-[#B39A72]'
                      : 'text-[#77746F] hover:bg-[#F7F5F0]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#D8D2C8] flex flex-col space-y-2 text-xs">
            {userEmail && (
              <div className="flex items-center space-x-1.5 text-[#77746F] px-3 py-1">
                <ShieldCheck size={14} className="text-[#B39A72]" />
                <span className="truncate">{userEmail}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-3 pt-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center space-x-1 text-[#77746F] hover:text-[#20201E]"
              >
                <span>View Public Site</span>
                <ExternalLink size={13} />
              </Link>
              <form action={signOutAdmin}>
                <button
                  type="submit"
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
