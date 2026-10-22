import { studioConfig } from '@/lib/config/studio';
import Navigation from '@/components/navigation';
import BookingSection from '@/components/booking-section';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Book a Session — TS Photography',
  description:
    'Schedule your bespoke wedding, portrait, pre-wedding, or commercial photography session with TS Photography.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#20201E] pt-20">
      <Navigation />
      <BookingSection
        services={studioConfig.services}
        contact={studioConfig.contact}
      />
      <Footer />
    </main>
  );
}
