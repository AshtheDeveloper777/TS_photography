'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { signInAdmin, AuthState } from '@/app/actions/auth';

const initialState: AuthState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInAdmin, initialState);

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col justify-between text-[#20201E]">
      {/* Top Header */}
      <header className="p-6 md:p-10 border-b border-[#D8D2C8] flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#77746F] hover:text-[#20201E] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Studio</span>
        </Link>
        <span className="font-editorial text-xl tracking-editorial-wide text-[#20201E]">
          TS PHOTOGRAPHY
        </span>
        <div className="w-20" /> {/* Balance spacer */}
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#D8D2C8] p-8 md:p-12 shadow-sm">
          {/* Subtle Emblem */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#F7F5F0] border border-[#D8D2C8] flex items-center justify-center text-[#B39A72] mb-4">
              <Lock size={20} />
            </div>
            <span className="text-[10px] uppercase tracking-editorial-widest text-[#77746F] font-interface mb-1">
              Private Access
            </span>
            <h1 className="font-editorial text-3xl md:text-4xl text-[#20201E]">
              Studio Portal
            </h1>
            <p className="mt-2 text-xs text-[#77746F] font-interface leading-relaxed max-w-xs">
              Sign in with your authorized administrator credentials to manage portfolio media and enquiries.
            </p>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Login Form */}
          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
              >
                Administrator Email <span className="text-[#B39A72]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@tsphotography.com"
                className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D8D2C8] text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
              >
                Password <span className="text-[#B39A72]">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D8D2C8] text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-[#20201E] text-[#FFFFFF] text-xs uppercase tracking-editorial-widest font-interface hover:bg-[#B39A72] transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-[#D8D2C8] text-center">
            <p className="text-[11px] text-[#77746F]">
              Restricted area. Public registration is disabled. All authentication activity is monitored.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[#77746F] border-t border-[#D8D2C8]">
        <span>TS Photography &copy; {new Date().getFullYear()} — Fine Art &amp; Editorial Studio</span>
      </footer>
    </div>
  );
}
