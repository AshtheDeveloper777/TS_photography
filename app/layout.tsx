import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#F7F5F0',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'TS PHOTOGRAPHY · Honest Moments, Artfully Told',
  description:
    'TS Photography is a professional photography studio capturing weddings, portraits, pre-weddings, events, and editorial commercial stories with honest emotion and artful perspectives.',
  keywords: [
    'TS Photography',
    'editorial photography',
    'wedding photographer',
    'portrait photography',
    'luxury portfolio',
    'fine art photography',
    'pre-wedding shoot',
  ],
  openGraph: {
    title: 'TS PHOTOGRAPHY · Honest Moments, Artfully Told',
    description:
      'Honest moments. Artful perspectives. Timeless photographs. Explore the selected portfolio of TS Photography.',
    type: 'website',
    locale: 'en_US',
    siteName: 'TS Photography',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TS PHOTOGRAPHY',
    description: 'Honest moments. Artful perspectives. Timeless photographs.',
  },
};

import QuickContactBar from '@/components/quick-contact-bar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#F7F5F0] text-[#20201E] antialiased selection:bg-[#B39A72] selection:text-[#FFFFFF]">
        {children}
        <QuickContactBar />
      </body>
    </html>
  );
}
