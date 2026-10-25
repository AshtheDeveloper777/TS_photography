'use client';

import { useState, useEffect, useActionState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import InstagramIcon from '@/components/icons/instagram';
import { submitBookingEnquiry, BookingFormState } from '@/app/actions/booking';
import { PhotographyService } from '@/lib/types/media';

interface BookingSectionProps {
  services: PhotographyService[];
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    instagram?: string;
    instagramUrl?: string;
  };
}

const initialState: BookingFormState = {};

function BookingFormInner({
  services,
  contact,
}: BookingSectionProps) {
  const [state, formAction, isPending] = useActionState(submitBookingEnquiry, initialState);
  const searchParams = useSearchParams();
  const selectRef = useRef<HTMLSelectElement | null>(null);

  const activeServices = services.filter((s) => s.active);

  // Helper to map incoming slug or title to exact select value
  const resolveServiceTitle = (paramValue?: string | null): string => {
    if (!paramValue) return '';
    const cleanParam = decodeURIComponent(paramValue).trim().toLowerCase();

    // Check slug matches
    const bySlug = activeServices.find((s) => s.slug.toLowerCase() === cleanParam);
    if (bySlug) return bySlug.title;

    // Check title matches
    const byTitle = activeServices.find((s) => s.title.toLowerCase() === cleanParam);
    if (byTitle) return byTitle.title;

    // Check 'other'
    if (cleanParam.includes('other')) {
      return 'Other';
    }

    // Partial matches (e.g. 'wedding' matches 'Wedding Photography')
    const partial = activeServices.find(
      (s) => s.title.toLowerCase().includes(cleanParam) || s.slug.toLowerCase().includes(cleanParam)
    );
    if (partial) return partial.title;

    return '';
  };

  const [selectedService, setSelectedService] = useState<string>(() => {
    const fromQuery = searchParams?.get('service');
    return resolveServiceTitle(fromQuery);
  });

  const [isHighlighted, setIsHighlighted] = useState(false);

  // 1. Listen for searchParams changes (e.g. back/forward navigation or refresh)
  useEffect(() => {
    const serviceParam = searchParams?.get('service');
    if (serviceParam) {
      const resolved = resolveServiceTitle(serviceParam);
      if (resolved) {
        setSelectedService(resolved);
        triggerHighlight();
      }
    }
  }, [searchParams]);

  // 2. Also listen for client custom event or hash changes (e.g. /#contact?service=...)
  useEffect(() => {
    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ service?: string }>;
      if (customEvent.detail?.service) {
        const resolved = resolveServiceTitle(customEvent.detail.service);
        if (resolved) {
          setSelectedService(resolved);
          triggerHighlight();
          // Scroll smoothly to contact section
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      const paramIndex = hash.indexOf('?');
      if (paramIndex !== -1) {
        const queryPart = hash.substring(paramIndex + 1);
        const params = new URLSearchParams(queryPart);
        const s = params.get('service');
        if (s) {
          const resolved = resolveServiceTitle(s);
          if (resolved) {
            setSelectedService(resolved);
            triggerHighlight();
          }
        }
      }
    };

    window.addEventListener('ts-select-service', handleCustomSelect);
    window.addEventListener('hashchange', handleHashChange);
    // Check hash on initial load
    handleHashChange();

    return () => {
      window.removeEventListener('ts-select-service', handleCustomSelect);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeServices]);

  const triggerHighlight = () => {
    setIsHighlighted(true);
    setTimeout(() => setIsHighlighted(false), 2000);
  };

  const whatsappUrl =
    contact.whatsapp ||
    'https://wa.me/916369911759?text=Hi%20TS%20Photography!%20I\'m%20interested%20in%20booking%20a%20photography%20session.%20Could%20you%20please%20share%20more%20details%3F';

  const emailAddress = contact.email || 'tholkappiyana07@gmail.com';
  const instagramHandle = contact.instagram || '@ts_photo_graphy_56';
  const instagramProfileUrl = contact.instagramUrl || 'https://www.instagram.com/ts_photo_graphy_56/';

  return (
    <section
      id="contact"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#F7F5F0] border-b border-[#D8D2C8]"
      aria-label="Contact and Booking Enquiries"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Heading, Supporting Text, and Three Clean Contact Options */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="w-6 h-[1px] bg-[#B39A72]" />
                <span className="text-[11px] uppercase tracking-editorial-widest text-[#77746F] font-interface">
                  Inquiries &amp; Commissions
                </span>
              </div>

              <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#20201E] font-normal leading-tight mb-6">
                Let&rsquo;s Create <br />
                <span className="italic font-light">Something Meaningful.</span>
              </h2>

              <p className="text-sm md:text-base text-[#77746F] font-interface leading-relaxed font-light mb-10 max-w-md">
                Whether you&rsquo;re planning a wedding, a portrait session, a special event, or another photography project, we&rsquo;d love to hear your ideas.
              </p>

              {/* Three Clean Contact Options */}
              <div className="space-y-6 pt-2 pb-8">
                {/* 1. Email */}
                <div className="p-5 bg-[#FFFFFF] border border-[#D8D2C8] flex items-start space-x-4 group hover:border-[#B39A72] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#F7F5F0] border border-[#D8D2C8] flex items-center justify-center text-[#B39A72] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-editorial-widest text-[#77746F] block mb-1">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="font-interface text-sm font-medium text-[#20201E] hover:text-[#B39A72] transition-colors block break-all"
                    >
                      {emailAddress}
                    </a>
                    <span className="text-[11px] text-[#9E9A92] mt-1 block">
                      Opens your mail application
                    </span>
                  </div>
                </div>

                {/* 2. WhatsApp */}
                <div className="p-5 bg-[#FFFFFF] border border-[#D8D2C8] flex items-start space-x-4 group hover:border-[#B39A72] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#F7F5F0] border border-[#D8D2C8] flex items-center justify-center text-[#B39A72] shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-editorial-widest text-[#77746F] block mb-1">
                      WhatsApp Messaging
                    </span>
                    <span className="font-interface text-sm font-medium text-[#20201E] block mb-1">
                      +91 6369911759
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-editorial-wide text-[#B39A72] hover:underline inline-block mt-1"
                    >
                      Start Conversation &rarr;
                    </a>
                  </div>
                </div>

                {/* 3. Instagram */}
                <div className="p-5 bg-[#FFFFFF] border border-[#D8D2C8] flex items-start space-x-4 group hover:border-[#B39A72] transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#F7F5F0] border border-[#D8D2C8] flex items-center justify-center text-[#B39A72] shrink-0">
                    <InstagramIcon size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase tracking-editorial-widest text-[#77746F] block mb-1">
                      Instagram Stories &amp; DM
                    </span>
                    <span className="font-interface text-sm font-medium text-[#20201E] block mb-1">
                      {instagramHandle}
                    </span>
                    <a
                      href={instagramProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-editorial-wide text-[#B39A72] hover:underline inline-block mt-1"
                    >
                      Follow &amp; Message &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Commitment Note */}
            <div className="pt-6 border-t border-[#D8D2C8] text-xs text-[#77746F] font-interface">
              <span className="block font-medium text-[#20201E] mb-1">Response Timeframe</span>
              <span>We reply to all inquiries within 24 to 48 business hours with tailored availability and investment information.</span>
            </div>
          </div>

          {/* Right Column: Direct Booking Enquiry Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D8D2C8] p-8 md:p-12 shadow-sm">
            <div className="mb-8 pb-6 border-b border-[#D8D2C8]">
              <h3 className="font-editorial text-2xl md:text-3xl text-[#20201E]">
                Book a Session
              </h3>
              <p className="text-xs md:text-sm text-[#77746F] mt-2 font-interface">
                Share a few details about your desired session. We will get back to you with custom recommendations.
              </p>
            </div>

            {/* Success State Notification */}
            {state?.success ? (
              <div
                className="p-8 bg-[#F7F5F0] border border-[#B39A72] text-center space-y-4"
                role="alert"
                aria-live="polite"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFFFFF] border border-[#B39A72] text-[#B39A72] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-editorial text-2xl text-[#20201E]">
                  Enquiry Received
                </h4>
                <p className="text-sm text-[#77746F] font-interface max-w-md mx-auto leading-relaxed">
                  {state.message}
                </p>
                <div className="pt-4 border-t border-[#D8D2C8] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#20201E] hover:text-[#B39A72] uppercase tracking-editorial-wider underline underline-offset-4"
                  >
                    Send Quick Note on WhatsApp &rarr;
                  </a>
                </div>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                {/* General Submission Error */}
                {state?.message && !state?.success && (
                  <div
                    className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-3"
                    role="alert"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{state.message}</span>
                  </div>
                )}

                {/* Honeypot hidden input for spam protection */}
                <input
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                  >
                    Your Name <span className="text-[#B39A72]">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="e.g. John Doe"
                    className={`w-full px-4 py-3 bg-[#F7F5F0] border ${
                      state.fieldErrors?.fullName ? 'border-red-400' : 'border-[#D8D2C8]'
                    } text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors`}
                  />
                  {state.fieldErrors?.fullName && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {state.fieldErrors.fullName}
                    </span>
                  )}
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                    >
                      Email Address <span className="text-[#B39A72]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 bg-[#F7F5F0] border ${
                        state.fieldErrors?.email ? 'border-red-400' : 'border-[#D8D2C8]'
                      } text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors`}
                    />
                    {state.fieldErrors?.email && (
                      <span className="text-xs text-red-600 mt-1 block">
                        {state.fieldErrors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                    >
                      Phone Number <span className="text-[#77746F] text-[10px]">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D8D2C8] text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors"
                    />
                  </div>
                </div>

                {/* Photography Service Selection with dynamic prefill & highlight */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="serviceType"
                      className="block text-xs uppercase tracking-editorial-widest text-[#20201E] font-interface"
                    >
                      Photography Service <span className="text-[#B39A72]">*</span>
                    </label>
                    {selectedService && (
                      <span className="text-[11px] text-[#B39A72] uppercase tracking-wider font-medium">
                        Selected: {selectedService}
                      </span>
                    )}
                  </div>
                  <select
                    ref={selectRef}
                    id="serviceType"
                    name="serviceType"
                    required
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={`w-full px-4 py-3 bg-[#F7F5F0] border ${
                      state.fieldErrors?.serviceType
                        ? 'border-red-400'
                        : isHighlighted
                        ? 'border-[#B39A72] ring-2 ring-[#B39A72]/30'
                        : selectedService
                        ? 'border-[#20201E]'
                        : 'border-[#D8D2C8]'
                    } text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-all`}
                  >
                    <option value="" disabled>
                      Select an active service...
                    </option>
                    {activeServices.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                    <option value="Other">Other / Custom Project</option>
                  </select>
                  {state.fieldErrors?.serviceType && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {state.fieldErrors.serviceType}
                    </span>
                  )}
                </div>

                {/* Preferred Date & Event / Shoot Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                    >
                      Preferred Date <span className="text-[#77746F] text-[10px]">(optional)</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D8D2C8] text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                    >
                      Event or Shoot Location <span className="text-[#77746F] text-[10px]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g. Chennai, Madurai, or Venue"
                      className="w-full px-4 py-3 bg-[#F7F5F0] border border-[#D8D2C8] text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                  >
                    Message / Session Vision <span className="text-[#B39A72]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about the moments, approximate timeline, ceremony or aesthetic you want to capture..."
                    className={`w-full px-4 py-3 bg-[#F7F5F0] border ${
                      state.fieldErrors?.message ? 'border-red-400' : 'border-[#D8D2C8]'
                    } text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors resize-y`}
                  />
                  {state.fieldErrors?.message && (
                    <span className="text-xs text-red-600 mt-1 block">
                      {state.fieldErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-[#20201E] text-[#FFFFFF] text-xs uppercase tracking-editorial-widest font-interface hover:bg-[#B39A72] transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Your Enquiry...</span>
                      </>
                    ) : (
                      <span>Send Booking Enquiry</span>
                    )}
                  </button>
                  <p className="mt-3 text-[11px] text-[#77746F] text-center">
                    Submitting this form sends an inquiry to the studio. Your session will be confirmed separately after reviewing details and availability.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BookingSection(props: BookingSectionProps) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-[#77746F] bg-[#F7F5F0]">
          Loading booking section...
        </div>
      }
    >
      <BookingFormInner {...props} />
    </Suspense>
  );
}
