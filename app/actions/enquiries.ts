'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth/admin';

export interface EnquiryActionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

const VALID_STATUSES = new Set(['new', 'reviewed', 'contacted', 'confirmed', 'closed', 'archived']);

/**
 * Updates any field on a booking enquiry (status, service_type, preferred_date, location).
 * Confirms that the database actually modified the row before reporting success.
 */
export async function updateEnquiry(
  id: string,
  updates: {
    status?: string;
    service_type?: string;
    preferred_date?: string | null;
    location?: string | null;
  }
): Promise<EnquiryActionResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized. Admin credentials required.' };
  }

  if (updates.status && !VALID_STATUSES.has(updates.status)) {
    return { success: false, error: `Invalid status: ${updates.status}` };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    const { data, error } = await supabase
      .from('booking_enquiries')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Admin Enquiry Update] Error:', error);
      return { success: false, error: `Database error: ${error.message}` };
    }

    if (!data || data.length === 0) {
      console.warn('[Admin Enquiry Update] 0 rows modified for id:', id);
      return {
        success: false,
        error:
          'Database update rejected (0 rows modified). Please ensure the UPDATE RLS policy and status check constraints have been executed in your Supabase SQL editor.',
      };
    }

    revalidatePath('/admin');
    revalidatePath('/admin/enquiries');

    return {
      success: true,
      message: 'Enquiry updated successfully.',
      data: data[0],
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update enquiry',
    };
  }
}

/**
 * Backwards-compatible status updater calling updateEnquiry.
 */
export async function updateEnquiryStatus(
  id: string,
  status: string
): Promise<EnquiryActionResult> {
  const res = await updateEnquiry(id, { status });
  if (res.success) {
    return {
      ...res,
      message: `Enquiry status updated to "${status}".`,
    };
  }
  return res;
}

/**
 * Deletes an enquiry from the database.
 */
export async function deleteEnquiry(id: string): Promise<EnquiryActionResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized.' };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    const { data, error } = await supabase
      .from('booking_enquiries')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Delete rejected by database (0 rows removed). Check Supabase RLS delete policies.',
      };
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
