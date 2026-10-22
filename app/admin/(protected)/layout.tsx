import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { verifyAdmin } from '@/lib/auth/admin';
import AdminHeader from '@/components/admin/admin-header';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await verifyAdmin();

  if (!auth.authorized) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
      <AdminHeader userEmail={auth.user?.email} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-[#D8D2C8] bg-[#FFFFFF] py-6 text-center text-xs text-[#77746F]">
        <span>TS Photography Administrator Portal &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
