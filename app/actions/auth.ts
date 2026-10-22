'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/auth/admin';
import { redirect } from 'next/navigation';

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function signInAdmin(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Verify that the signed-in user is an authorized admin
  const authCheck = await verifyAdmin();
  if (!authCheck.authorized) {
    // Sign them out immediately if they are not authorized
    await supabase.auth.signOut();
    return {
      error: authCheck.message || 'Unauthorized. This account is not an administrator.',
    };
  }

  redirect('/admin');
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
