import { createServerSupabaseClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

const DEFAULT_ADMIN_EMAILS = [
  'tholkappiyana07@gmail.com',
  'admin@tsphotography.com',
  'tholkappiyan@tsphotography.com',
];

export interface AdminVerificationResult {
  authorized: boolean;
  user: User | null;
  reason?: 'unauthenticated' | 'unauthorized' | 'error';
  message?: string;
}

/**
 * Validates that the current request is from an explicitly authorized administrator.
 * Protects admin routes and server actions against unauthorized access.
 */
export async function verifyAdmin(): Promise<AdminVerificationResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        authorized: false,
        user: null,
        reason: 'unauthenticated',
        message: 'You must be signed in to access the administrator dashboard.',
      };
    }

    const email = user.email?.trim().toLowerCase() || '';

    // Check configured ADMIN_EMAILS environment variable
    const envAdmins = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const allowedEmails = new Set([
      ...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()),
      ...envAdmins,
    ]);

    // 1. Check metadata role
    if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
      return { authorized: true, user };
    }

    // 2. Check email whitelist
    if (allowedEmails.has(email)) {
      return { authorized: true, user };
    }

    // 3. Query admin_users table if available
    try {
      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (adminRecord && adminRecord.role === 'admin') {
        return { authorized: true, user };
      }
    } catch {
      // Table may not yet be created or accessible
    }

    return {
      authorized: false,
      user,
      reason: 'unauthorized',
      message: `Access denied. The account (${user.email}) is not authorized for administrator access.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown verification error';
    return {
      authorized: false,
      user: null,
      reason: 'error',
      message: errorMsg,
    };
  }
}
