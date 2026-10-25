'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  User,
  Edit2,
} from 'lucide-react';
import { updateEnquiryStatus, updateEnquiry, deleteEnquiry } from '@/app/actions/enquiries';

export interface BookingEnquiry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone?: string | null;
  service_type: string;
  preferred_date?: string | null;
  location?: string | null;
  message: string;
  status: 'new' | 'reviewed' | 'contacted' | 'confirmed' | 'closed' | 'archived';
}

interface EnquiriesManagerProps {
  initialEnquiries: BookingEnquiry[];
}

const ALL_SERVICES = [
  'Wedding Photography',
  'Pre-Wedding Photography',
  'Portrait Photography',
  'Family Photography',
  'Event Photography',
  'Commercial Photography',
  'Product Photography',
  'Other Photography Services',
  'Other',
];

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; borderClass: string }
> = {
  new: {
    label: 'New',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    borderClass: 'border-l-amber-500',
  },
  reviewed: {
    label: 'Reviewed',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    borderClass: 'border-l-blue-400',
  },
  contacted: {
    label: 'Contacted',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    borderClass: 'border-l-indigo-500',
  },
  confirmed: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    borderClass: 'border-l-emerald-500',
  },
  closed: {
    label: 'Closed',
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
    borderClass: 'border-l-stone-400',
  },
  archived: {
    label: 'Archived',
    badgeClass: 'bg-stone-100 text-stone-500 border-stone-200',
    borderClass: 'border-l-stone-300',
  },
};

export default function EnquiriesManager({ initialEnquiries }: EnquiriesManagerProps) {
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<BookingEnquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync state when server props update or after router revalidation
  useEffect(() => {
    setEnquiries(initialEnquiries);
  }, [initialEnquiries]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Status counts
  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const contactedCount = enquiries.filter((e) => e.status === 'contacted').length;
  const confirmedCount = enquiries.filter((e) => e.status === 'confirmed').length;

  // Filtered enquiries
  const filtered = enquiries.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && e.service_type !== serviceFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = e.full_name.toLowerCase().includes(q);
      const matchEmail = e.email.toLowerCase().includes(q);
      const matchPhone = e.phone?.toLowerCase().includes(q);
      const matchLocation = e.location?.toLowerCase().includes(q);
      const matchMessage = e.message.toLowerCase().includes(q);
      const matchService = e.service_type.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchLocation && !matchMessage && !matchService) {
        return false;
      }
    }

    return true;
  });

  // Unique services in dataset
  const uniqueServices = Array.from(new Set(enquiries.map((e) => e.service_type))).filter(Boolean);

  // Status update
  const handleStatusChange = (enquiryId: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateEnquiryStatus(enquiryId, newStatus);
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus as any } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
        showToast('success', `Status updated to "${newStatus}".`);
      } else {
        showToast('error', res.error || 'Failed to update status in database.');
      }
    });
  };

  // Inquiry / Service type update
  const handleServiceTypeChange = (enquiryId: string, newServiceType: string) => {
    startTransition(async () => {
      const res = await updateEnquiry(enquiryId, { service_type: newServiceType });
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, service_type: newServiceType } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, service_type: newServiceType } : null));
        }
        showToast('success', `Inquiry type updated to "${newServiceType}".`);
      } else {
        showToast('error', res.error || 'Failed to update inquiry type in database.');
      }
    });
  };

  // Delete enquiry
  const handleDeleteEnquiry = (enquiryId: string) => {
    startTransition(async () => {
      const res = await deleteEnquiry(enquiryId);
      if (res.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
        if (selectedEnquiry?.id === enquiryId) setSelectedEnquiry(null);
        setDeleteConfirmId(null);
        showToast('success', 'Enquiry deleted successfully.');
      } else {
        showToast('error', res.error || 'Failed to delete enquiry.');
      }
    });
  };

  // Clean phone number for WhatsApp link
  const getWhatsAppLink = (enquiry: BookingEnquiry) => {
    if (!enquiry.phone) return null;
    const cleanNumber = enquiry.phone.replace(/[^0-9]/g, '');
    const greeting = encodeURIComponent(
      `Hello ${enquiry.full_name}, thank you for reaching out to TS Photography regarding your ${enquiry.service_type} inquiry. We would love to discuss your session details!`
    );
    return `https://wa.me/${cleanNumber}?text=${greeting}`;
  };

  const getEmailLink = (enquiry: BookingEnquiry) => {
    const subject = encodeURIComponent(`TS Photography — ${enquiry.service_type} Session Details`);
    const body = encodeURIComponent(
      `Dear ${enquiry.full_name},\n\nThank you for reaching out to TS Photography. We received your booking inquiry for ${enquiry.service_type}.\n\n`
    );
    return `mailto:${enquiry.email}?subject=${subject}&body=${body}`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 border max-w-md shadow-lg flex items-start space-x-3 transition-all ${
            toast.type === 'success'
              ? 'bg-[#FFFFFF] border-emerald-500 text-[#20201E]'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}
          role="status"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="text-xs font-interface leading-relaxed">{toast.message}</span>
        </div>
      )}

      {/* Header & Status Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#D8D2C8] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-editorial-widest text-[#B39A72] mb-1">
            <span className="w-4 h-[1px] bg-[#B39A72]" />
            <span>Client Communications</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#20201E]">
            Booking Enquiries
          </h1>
          <p className="mt-2 text-sm text-[#77746F] max-w-xl">
            Review prospective client requests, respond directly via email or WhatsApp, and manage confirmation status.
          </p>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="px-3 py-1.5 bg-[#FFFFFF] border border-amber-300 text-amber-900 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{newCount} New</span>
          </div>
          <div className="px-3 py-1.5 bg-[#FFFFFF] border border-indigo-200 text-indigo-900 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>{contactedCount} Contacted</span>
          </div>
          <div className="px-3 py-1.5 bg-[#FFFFFF] border border-emerald-200 text-emerald-900 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{confirmedCount} Confirmed</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77746F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, phone, location, or message..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] placeholder-[#77746F] focus:outline-none focus:border-[#20201E]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none"
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="new">New ({newCount})</option>
            <option value="contacted">Contacted ({contactedCount})</option>
            <option value="confirmed">Confirmed ({confirmedCount})</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Service Filter */}
          {uniqueServices.length > 0 && (
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none"
            >
              <option value="all">All Services</option>
              {uniqueServices.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          )}

          <span className="text-[#77746F] text-xs pl-2">
            Showing {filtered.length} of {enquiries.length}
          </span>
        </div>
      </div>

      {/* Enquiries List / Table */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFFFF] border border-[#D8D2C8] p-8">
          <Inbox size={40} className="mx-auto mb-4 text-[#B39A72] opacity-40" />
          <h3 className="font-editorial text-2xl text-[#20201E] mb-2">No Enquiries Found</h3>
          <p className="text-xs text-[#77746F] max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || serviceFilter !== 'all'
              ? 'No client enquiries match the current filters. Clear your filters to view all entries.'
              : 'No booking enquiries have been submitted yet. Submissions from the public booking form will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#D8D2C8] divide-y divide-[#D8D2C8]">
          {filtered.map((enquiry) => {
            const statusInfo = STATUS_CONFIG[enquiry.status] || STATUS_CONFIG.new;
            const waLink = getWhatsAppLink(enquiry);
            const mailLink = getEmailLink(enquiry);

            return (
              <div
                key={enquiry.id}
                onClick={() => setSelectedEnquiry(enquiry)}
                className={`p-5 md:p-6 hover:bg-[#F7F5F0]/60 transition-colors cursor-pointer border-l-4 ${statusInfo.borderClass} flex flex-col lg:flex-row lg:items-center justify-between gap-4`}
              >
                {/* Client Info & Vision Excerpt */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-medium text-base text-[#20201E]">
                      {enquiry.full_name}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border font-medium ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>

                    {/* Quick Inquiry / Service Type Dropdown in row */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center"
                    >
                      <select
                        value={enquiry.service_type}
                        onChange={(e) => handleServiceTypeChange(enquiry.id, e.target.value)}
                        disabled={isPending}
                        className="text-xs text-[#B39A72] font-medium bg-[#F7F5F0] px-2 py-0.5 border border-[#D8D2C8] hover:border-[#B39A72] focus:outline-none cursor-pointer"
                        title="Click to change inquiry / service type"
                      >
                        {ALL_SERVICES.map((srv) => (
                          <option key={srv} value={srv}>
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact & Meta Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#77746F] mb-2 font-interface">
                    <span className="flex items-center space-x-1">
                      <Mail size={12} className="text-[#B39A72]" />
                      <span>{enquiry.email}</span>
                    </span>
                    {enquiry.phone && (
                      <span className="flex items-center space-x-1">
                        <Phone size={12} className="text-[#B39A72]" />
                        <span>{enquiry.phone}</span>
                      </span>
                    )}
                    {enquiry.preferred_date && (
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} className="text-[#B39A72]" />
                        <span>{enquiry.preferred_date}</span>
                      </span>
                    )}
                    {enquiry.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin size={12} className="text-[#B39A72]" />
                        <span>{enquiry.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Message Snippet */}
                  <p className="text-xs text-[#77746F] line-clamp-2 leading-relaxed">
                    &ldquo;{enquiry.message}&rdquo;
                  </p>
                </div>

                {/* Right Side: Quick Action Links & Status Dropdown */}
                <div className="flex items-center space-x-3 self-start lg:self-center shrink-0 pt-2 lg:pt-0">
                  {/* WhatsApp Quick Link */}
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-[#F7F5F0] hover:bg-emerald-50 text-emerald-700 border border-[#D8D2C8] hover:border-emerald-300 transition-colors"
                      title="Open WhatsApp chat with client"
                    >
                      <MessageSquare size={15} />
                    </a>
                  )}

                  {/* Email Quick Link */}
                  <a
                    href={mailLink}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-[#F7F5F0] hover:bg-[#EAE5DA] text-[#20201E] border border-[#D8D2C8] transition-colors"
                    title="Send Email to client"
                  >
                    <Mail size={15} />
                  </a>

                  {/* Quick Status Select */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      disabled={isPending}
                      className="px-2.5 py-1.5 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none hover:border-[#B39A72] cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* View Details Chevron */}
                  <div className="text-[#77746F]">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-[#20201E]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D8D2C8] max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#D8D2C8]">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] uppercase tracking-editorial-widest text-[#B39A72]">
                    Client Enquiry Details
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border font-medium ${
                      (STATUS_CONFIG[selectedEnquiry.status] || STATUS_CONFIG.new).badgeClass
                    }`}
                  >
                    {selectedEnquiry.status}
                  </span>
                </div>
                <h2 className="font-editorial text-3xl text-[#20201E]">
                  {selectedEnquiry.full_name}
                </h2>
                <span className="text-xs text-[#77746F] block mt-1">
                  Received {formatDate(selectedEnquiry.created_at)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-[#77746F] hover:text-[#20201E]"
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Contact Action Bar */}
            <div className="p-4 bg-[#F7F5F0] border border-[#D8D2C8] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wider text-[#77746F] font-interface">
                Contact Client:
              </span>
              <div className="flex items-center space-x-3">
                {selectedEnquiry.phone && (
                  <>
                    <a
                      href={getWhatsAppLink(selectedEnquiry) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider transition-colors"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#D8D2C8] hover:border-[#20201E] text-[#20201E] text-xs uppercase tracking-wider transition-colors"
                    >
                      <Phone size={13} />
                      <span>Call</span>
                    </a>
                  </>
                )}
                <a
                  href={getEmailLink(selectedEnquiry)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#20201E] hover:bg-[#B39A72] text-white text-xs uppercase tracking-wider transition-colors"
                >
                  <Mail size={13} />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Editable Inquiry / Service Type */}
              <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8]">
                <span className="text-[10px] uppercase tracking-wider text-[#77746F] block mb-1">
                  Inquiry Type / Service
                </span>
                <select
                  value={selectedEnquiry.service_type}
                  onChange={(e) => handleServiceTypeChange(selectedEnquiry.id, e.target.value)}
                  disabled={isPending}
                  className="w-full px-2.5 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs font-editorial text-base text-[#20201E] focus:outline-none hover:border-[#B39A72] cursor-pointer"
                >
                  {ALL_SERVICES.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#77746F] mt-1 block">
                  Select a new category to reassign this inquiry.
                </span>
              </div>

              {/* Status Selector in Modal */}
              <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8]">
                <span className="text-[10px] uppercase tracking-wider text-[#77746F] block mb-1">
                  Inquiry Status
                </span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  disabled={isPending}
                  className="w-full px-2.5 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs text-[#20201E] focus:outline-none hover:border-[#B39A72] cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
                <span className="text-[10px] text-[#77746F] mt-1 block">
                  Current workflow stage of this client request.
                </span>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8]">
                <span className="text-[10px] uppercase tracking-wider text-[#77746F] block mb-1">
                  Preferred Date
                </span>
                <span className="font-interface text-sm text-[#20201E]">
                  {selectedEnquiry.preferred_date || 'No specific date provided'}
                </span>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8]">
                <span className="text-[10px] uppercase tracking-wider text-[#77746F] block mb-1">
                  Email Address
                </span>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="font-interface text-sm text-[#20201E] hover:text-[#B39A72] underline"
                >
                  {selectedEnquiry.email}
                </a>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8]">
                <span className="text-[10px] uppercase tracking-wider text-[#77746F] block mb-1">
                  Phone Number
                </span>
                <span className="font-interface text-sm text-[#20201E]">
                  {selectedEnquiry.phone || 'None specified'}
                </span>
              </div>

              <div className="p-4 bg-[#FFFFFF] border border-[#D8D2C8]">
                <span className="text-[10px] uppercase tracking-wider text-[#77746F] block mb-1">
                  Location / Venue
                </span>
                <span className="font-interface text-sm text-[#20201E]">
                  {selectedEnquiry.location || 'Studio / To be determined'}
                </span>
              </div>
            </div>

            {/* Client Message */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-editorial-widest text-[#20201E] block">
                Session Vision / Requirements
              </span>
              <div className="p-4 bg-[#F7F5F0] border border-[#D8D2C8] text-xs sm:text-sm text-[#20201E] leading-relaxed whitespace-pre-wrap font-interface">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Actions & Delete Row */}
            <div className="pt-4 border-t border-[#D8D2C8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <Trash2 size={13} />
                <span>Delete Enquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-6 py-2.5 bg-[#20201E] text-white text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 bg-[#20201E]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="w-full max-w-md bg-[#FFFFFF] border border-red-300 p-6 md:p-8 space-y-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 text-red-600">
              <AlertCircle size={24} />
              <h3 className="font-editorial text-2xl text-[#20201E]">Delete Enquiry</h3>
            </div>

            <p className="text-xs text-[#77746F] leading-relaxed">
              Are you sure you want to delete this enquiry record? This action will permanently remove it from the studio database.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#F7F5F0] border border-[#D8D2C8] text-xs uppercase tracking-wider text-[#20201E]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEnquiry(deleteConfirmId)}
                disabled={isPending}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-editorial-widest transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
