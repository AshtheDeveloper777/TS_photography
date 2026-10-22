import { ReactNode } from 'react';

export const metadata = {
  title: 'Studio Admin — TS Photography',
  description: 'Administrator portal for managing portfolio media and customer booking enquiries.',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#20201E] font-interface antialiased selection:bg-[#B39A72] selection:text-white">
      {children}
    </div>
  );
}
