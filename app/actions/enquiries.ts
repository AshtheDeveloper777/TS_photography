'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth/admin';

export interface EnquiryActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

const VALID_STATUSES = new Set(['new', 'reviewed', 'contacted', 'confirmed', 'closed', 'archived']);

export async function updateEnquiryStatus(
  id: string,
  status: string
): Promise<EnquiryActionResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized. Admin credentials required.' };
  }

  if (!VALID_STATUSES.has(status)) {
    return { success: false, error: `Invalid status: ${status}` };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    const { error } = await supabase
      .from('booking_enquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/admin/enquiries');

    return {
      success: true,
      message: `Enquiry status updated to "${status}".`,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update status',
    };
  }
}

export async function deleteEnquiry(id: string): Promise<EnquiryActionResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized.' };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    const { error } = await supabase
      .from('booking_enquiries')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/admin/enquiries');

    return { success: true, message: 'Enquiry deleted successfully.' };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete enquiry',
    };
  }
}
