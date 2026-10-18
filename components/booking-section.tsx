'use client';

import { useActionState } from 'react';
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

export default function BookingSection({
  services,
  contact,
}: BookingSectionProps) {
  const [state, formAction, isPending] = useActionState(submitBookingEnquiry, initialState);

  const activeServices = services.filter((s) => s.active);

  const whatsappUrl =
    contact.whatsapp ||
    'https://wa.me/916369911759?text=Hi%20TS%20Photography!%20I\'m%20interested%20in%20booking%20a%20photography%20session.%20Could%20you%20please%20share%20more%20details%3F';

  const emailAddress = contact.email || 'tholkappiyana07@gmail.com';
  const instagramHandle = contact.instagram || '@ts_photo_grapgy_56';
  const instagramProfileUrl = contact.instagramUrl || 'https://www.instagram.com/ts_photo_grapgy_56/';

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
                      className="inline-flex items-center space-x-1 text-xs uppercase tracking-wider text-[#B39A72] hover:text-[#20201E] font-medium transition-colors"
                    >
                      <span>Chat on WhatsApp &rarr;</span>
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
                      Instagram Portfolio
                    </span>
                    <span className="font-interface text-sm font-medium text-[#20201E] block mb-1">
                      {instagramHandle}
                    </span>
                    <a
                      href={instagramProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs uppercase tracking-wider text-[#B39A72] hover:text-[#20201E] font-medium transition-colors"
                    >
                      <span>Follow Our Work &rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D8D2C8] text-xs text-[#77746F]">
              <p className="italic font-editorial text-base text-[#20201E] mb-1">
                TS Photography Studio
              </p>
              <p>Founded by Tholkappiyan A and student collaborators.</p>
            </div>
          </div>

          {/* Right Column: Functional Booking Enquiry Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] p-8 md:p-12 border border-[#D8D2C8] shadow-editorial">
            {state.success ? (
              /* Success Confirmation */
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#B39A72]/15 border border-[#B39A72]/40 flex items-center justify-center text-[#B39A72]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-editorial text-3xl text-[#20201E]">
                  Enquiry Received
                </h3>
                <p className="text-sm text-[#77746F] max-w-md mx-auto leading-relaxed">
                  Thank you for contacting TS Photography! Your enquiry has been received. We&rsquo;ll get back to you as soon as possible.
                </p>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[#20201E] text-white text-xs uppercase tracking-editorial-widest hover:bg-[#B39A72] transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Booking Form */
              <form action={formAction} className="space-y-6">
                <div>
                  <h3 className="font-editorial text-2xl text-[#20201E] mb-1">
                    Book a Photography Session
                  </h3>
                  <p className="text-xs text-[#77746F] font-interface">
                    Fill in your details below and we will connect with you to tailor your session.
                  </p>
                </div>

                {state.message && !state.success && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{state.message}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from users, catches automated spam bots) */}
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
                    Full Name <span className="text-[#B39A72]">*</span>
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

                {/* Photography Service Selection */}
                <div>
                  <label
                    htmlFor="serviceType"
                    className="block text-xs uppercase tracking-editorial-widest text-[#20201E] mb-2 font-interface"
                  >
                    Photography Service <span className="text-[#B39A72]">*</span>
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    defaultValue=""
                    className={`w-full px-4 py-3 bg-[#F7F5F0] border ${
                      state.fieldErrors?.serviceType ? 'border-red-400' : 'border-[#D8D2C8]'
                    } text-[#20201E] text-sm focus:outline-none focus:border-[#20201E] transition-colors`}
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
                    Submitting this form does not commit you to a booking. We will get back to you as soon as possible.
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
