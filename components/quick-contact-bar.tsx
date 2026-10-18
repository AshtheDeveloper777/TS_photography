'use client';

import { Mail, MessageSquare } from 'lucide-react';
import InstagramIcon from '@/components/icons/instagram';
import { studioConfig } from '@/lib/config/studio';

export default function QuickContactBar() {
  const { email, whatsapp, instagramUrl } = studioConfig.contact;

  return (
    <aside
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3"
      aria-label="Quick Studio Contacts"
    >
      <div className="flex items-center space-x-2 bg-[#20201E]/95 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-2xl">
        {/* WhatsApp Shortcut */}
        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
            aria-label="Chat with TS Photography on WhatsApp"
            title="Chat on WhatsApp"
          >
            <MessageSquare size={18} />
          </a>
        )}

        {/* Email Shortcut */}
        {email && (
          <a
            href={`mailto:${email}?subject=Photography%20Session%20Enquiry%20-%20TS%20Photography`}
            className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#20201E] flex items-center justify-center hover:scale-105 transition-transform hover:bg-[#B39A72] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
            aria-label="Email TS Photography"
            title="Send Email"
          >
            <Mail size={18} />
          </a>
        )}

        {/* Instagram Shortcut */}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B39A72]"
            aria-label="Follow TS Photography on Instagram"
            title="Instagram Profile"
          >
            <InstagramIcon size={18} />
          </a>
        )}
      </div>
    </aside>
  );
}
