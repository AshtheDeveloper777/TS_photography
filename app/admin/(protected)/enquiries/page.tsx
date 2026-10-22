import { createServerSupabaseClient } from '@/lib/supabase/server';
import EnquiriesManager, { BookingEnquiry } from '@/components/admin/enquiries-manager';

export const dynamic = 'force-dynamic';

export default async function AdminEnquiriesPage() {
  const supabase = await createServerSupabaseClient();

  let enquiries: BookingEnquiry[] = [];

  try {
    const { data, error } = await supabase
      .from('booking_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      enquiries = data as BookingEnquiry[];
    }
  } catch (err) {
    console.warn('[Admin Enquiries Page] Error fetching enquiries:', err);
  }

  return <EnquiriesManager initialEnquiries={enquiries} />;
}
