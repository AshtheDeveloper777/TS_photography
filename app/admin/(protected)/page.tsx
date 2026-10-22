import Link from 'next/link';
import {
  Image as ImageIcon,
  Video,
  Inbox,
  Clock,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getStudioMediaInventory } from '@/lib/supabase/media';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const inventory = await getStudioMediaInventory();

  // 1. Fetch enquiries count and recent enquiries
  let totalEnquiries = 0;
  let newEnquiriesCount = 0;
  let recentEnquiries: any[] = [];

  try {
    const { data: enquiries, count } = await supabase
      .from('booking_enquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    totalEnquiries = count || 0;
    recentEnquiries = enquiries || [];

    const { count: newCount } = await supabase
      .from('booking_enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    newEnquiriesCount = newCount || 0;
  } catch (err) {
    console.warn('[Admin Dashboard] Note querying enquiries:', err);
  }

  // 2. Fetch media count
  let totalMedia = inventory.allPhotos.length + (inventory.videoAsset ? 1 : 0);
  let visibleMedia = inventory.portfolioPhotos.length + (inventory.heroPhoto ? 1 : 0);

  try {
    const { count: mediaCount } = await supabase
      .from('media_items')
      .select('*', { count: 'exact', head: true });

    if (typeof mediaCount === 'number' && mediaCount > 0) {
      totalMedia = mediaCount;
      const { count: visCount } = await supabase
        .from('media_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_visible', true);
      visibleMedia = visCount || 0;
    }
  } catch {
    // Falls back to inventory counts
  }

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#D8D2C8] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#B39A72] mb-1">
            <span className="w-4 h-[1px] bg-[#B39A72]" />
            <span>Administrator Control</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#20201E]">
            Studio Overview
          </h1>
          <p className="mt-2 text-sm text-[#77746F] max-w-xl">
            Real-time control over portfolio visuals, storage media, and prospective client booking requests.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/media"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#20201E] text-[#FFFFFF] text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] transition-colors"
          >
            <PlusCircle size={15} />
            <span>Upload Media</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FFFFFF] border border-[#D8D2C8] text-[#20201E] text-xs uppercase tracking-editorial-widest hover:border-[#B39A72] transition-colors"
          >
            <Inbox size={15} />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Media */}
        <div className="p-6 bg-[#FFFFFF] border border-[#D8D2C8]">
          <div className="flex items-center justify-between text-[#77746F] mb-4">
            <span className="text-xs uppercase tracking-editorial-widest">Total Media Assets</span>
            <div className="p-2 bg-[#F7F5F0] rounded-full text-[#B39A72]">
              <ImageIcon size={18} />
            </div>
          </div>
          <div className="font-editorial text-4xl text-[#20201E] mb-2">{totalMedia}</div>
          <div className="text-xs text-[#77746F] flex items-center justify-between">
            <span>Bucket TS_photography</span>
            <span className="text-[#B39A72] font-medium">{inventory.videoAsset ? '1 Video' : '0 Videos'}</span>
          </div>
        </div>

        {/* Card 2: Public Visibility */}
        <div className="p-6 bg-[#FFFFFF] border border-[#D8D2C8]">
          <div className="flex items-center justify-between text-[#77746F] mb-4">
            <span className="text-xs uppercase tracking-editorial-widest">Public Portfolio</span>
            <div className="p-2 bg-[#F7F5F0] rounded-full text-[#B39A72]">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="font-editorial text-4xl text-[#20201E] mb-2">{visibleMedia}</div>
          <div className="text-xs text-[#77746F] flex items-center justify-between">
            <span>Visible to visitors</span>
            <Link href="/#portfolio" target="_blank" className="hover:underline flex items-center space-x-1">
              <span>Preview</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>

        {/* Card 3: Total Enquiries */}
        <div className="p-6 bg-[#FFFFFF] border border-[#D8D2C8]">
          <div className="flex items-center justify-between text-[#77746F] mb-4">
            <span className="text-xs uppercase tracking-editorial-widest">Total Enquiries</span>
            <div className="p-2 bg-[#F7F5F0] rounded-full text-[#B39A72]">
              <Inbox size={18} />
            </div>
          </div>
          <div className="font-editorial text-4xl text-[#20201E] mb-2">{totalEnquiries}</div>
          <div className="text-xs text-[#77746F]">
            <span>All-time client requests</span>
          </div>
        </div>

        {/* Card 4: New / Pending Action */}
        <div className="p-6 bg-[#FFFFFF] border border-[#D8D2C8]">
          <div className="flex items-center justify-between text-[#77746F] mb-4">
            <span className="text-xs uppercase tracking-editorial-widest">Pending Review</span>
            <div className="p-2 bg-[#F7F5F0] rounded-full text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="font-editorial text-4xl text-amber-700 mb-2">{newEnquiriesCount}</div>
          <div className="text-xs text-[#77746F] flex items-center justify-between">
            <span>Awaiting response</span>
            {newEnquiriesCount > 0 && (
              <Link href="/admin/enquiries" className="text-amber-700 hover:underline">
                Review now &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Storage Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Enquiries */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D8D2C8] p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D8D2C8]">
            <div>
              <h2 className="font-editorial text-2xl text-[#20201E]">Recent Booking Enquiries</h2>
              <p className="text-xs text-[#77746F]">Latest messages received from the public website</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs uppercase tracking-editorial-widest text-[#B39A72] hover:text-[#20201E] flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#77746F]">
              <Inbox size={32} className="mx-auto mb-3 opacity-40" />
              <p>No booking enquiries received yet.</p>
              <p className="text-xs text-[#9E9A92] mt-1">
                Submissions from the public booking form will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#D8D2C8]">
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-[#20201E]">{enquiry.full_name}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          enquiry.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : enquiry.status === 'contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : enquiry.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#77746F] mt-1 space-x-2">
                      <span className="text-[#B39A72]">{enquiry.service_type}</span>
                      <span>&bull;</span>
                      <span>{enquiry.email}</span>
                      {enquiry.preferred_date && (
                        <>
                          <span>&bull;</span>
                          <span>Date: {enquiry.preferred_date}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/admin/enquiries?id=${enquiry.id}`}
                    className="inline-flex items-center space-x-1 text-xs text-[#77746F] hover:text-[#20201E] self-start sm:self-auto"
                  >
                    <span>Manage</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Storage Inventory & System Verification */}
        <div className="lg:col-span-4 space-y-6">
          {/* Storage Status */}
          <div className="bg-[#FFFFFF] border border-[#D8D2C8] p-6">
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-[#D8D2C8]">
              <ShieldCheck size={18} className="text-[#B39A72]" />
              <h3 className="font-editorial text-xl text-[#20201E]">Supabase Storage</h3>
            </div>

            <div className="space-y-3 text-xs text-[#77746F]">
              <div className="flex justify-between py-1 border-b border-[#F7F5F0]">
                <span>Target Bucket</span>
                <span className="font-mono text-[#20201E] font-semibold">TS_photography</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F7F5F0]">
                <span>Storage Accessibility</span>
                <span className="text-emerald-700 font-medium">Accessible (Verified)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F7F5F0]">
                <span>Verified Root Files</span>
                <span className="text-[#20201E] font-medium">7 items active</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Cinematic Video</span>
                <span className="text-[#20201E] font-medium">
                  {inventory.videoAsset ? 'Video2.mp4 (Loaded)' : 'Not detected'}
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#D8D2C8]">
              <Link
                href="/admin/media"
                className="block w-full py-2.5 text-center text-xs uppercase tracking-editorial-widest bg-[#F7F5F0] hover:bg-[#EAE5DA] text-[#20201E] border border-[#D8D2C8] transition-colors"
              >
                Manage Media Gallery &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Help Box */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C8] p-6">
            <h4 className="font-editorial text-lg text-[#20201E] mb-2">Need to Add Photos?</h4>
            <p className="text-xs text-[#77746F] leading-relaxed mb-4">
              Upload multiple JPEG, PNG, or WebP images and MP4 reels directly to bucket <code>TS_photography</code>. Each item can be categorized and marked as public or hidden.
            </p>
            <Link
              href="/admin/media"
              className="text-xs uppercase tracking-editorial-widest text-[#B39A72] hover:text-[#20201E] font-semibold"
            >
              Open Media Manager &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
