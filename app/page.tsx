import { getStudioMediaInventory } from '@/lib/supabase/media';
import { studioConfig } from '@/lib/config/studio';
import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import SelectedPortfolio from '@/components/selected-portfolio';
import CinematicVideoSection from '@/components/cinematic-video-section';
import ServicesSection from '@/components/services-section';
import AboutSection from '@/components/about-section';
import PrinciplesSection from '@/components/principles-section';
import BookingSection from '@/components/booking-section';
import Footer from '@/components/footer';

// Revalidate every 60 seconds so newly uploaded files in TS_photography appear automatically
export const revalidate = 60;

export default async function HomePage() {
  const inventory = await getStudioMediaInventory();

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#20201E]">
      {/* Editorial Navigation */}
      <Navigation hasVideo={Boolean(inventory.videoAsset)} />

      {/* Hero Section */}
      <Hero
        heroPhoto={inventory.heroPhoto}
        bucketAccessible={inventory.bucketAccessible}
      />

      {/* Selected Portfolio Grid */}
      <SelectedPortfolio
        photos={inventory.portfolioPhotos}
        bucketAccessible={inventory.bucketAccessible}
      />

      {/* Dedicated Cinematic Video Section (detected from TS_photography) */}
      {inventory.videoAsset && (
        <CinematicVideoSection
          video={inventory.videoAsset}
          posterImage={inventory.heroPhoto?.url}
        />
      )}

      {/* Photography Services */}
      <ServicesSection
        services={studioConfig.services}
        coverPhotos={inventory.allPhotos}
      />

      {/* About the Studio */}
      <AboutSection
        headline={studioConfig.aboutHeadline}
        introCopy={studioConfig.aboutIntroCopy}
        customImageUrl={studioConfig.aboutImageUrl}
        photo={inventory.portfolioPhotos[0] || inventory.heroPhoto}
      />

      {/* The TS Experience Principles */}
      <PrinciplesSection principles={studioConfig.principles} />

      {/* Contact & Booking Enquiries */}
      <BookingSection
        services={studioConfig.services}
        contact={studioConfig.contact}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
