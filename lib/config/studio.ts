import { StudioConfig } from '../types/media';

export const studioConfig: StudioConfig = {
  name: 'TS PHOTOGRAPHY',
  tagline: 'Honest moments. Artful perspectives. Timeless photographs.',
  heroHeadline: 'Every Frame Tells a Story.',
  heroSupportingText: 'Honest moments. Artful perspectives. Timeless photographs.',
  heroSubLabel: 'TS PHOTOGRAPHY · YOUR MOMENTS, BEAUTIFULLY TOLD',

  aboutHeadline: 'Capturing Truth Behind the Lens.',
  aboutIntroCopy:
    'Founded by Tholkappiyan A alongside a dedicated cohort of passionate student collaborators, TS Photography is driven by an earnest commitment to visual artistry. We view each session as a collaborative creative pursuit, bringing thoughtful direction, honest emotion, and meticulous attention to every nuance.',
  aboutImageUrl:
    'https://hdoejjtkbxyjloezpqhn.supabase.co/storage/v1/object/public/TS_photography/WhatsApp%20Image%202026-10-18%20at%204.16.45%20PM.jpeg',

  // 8 Configurable Services (can be activated, deactivated, renamed, reordered)
  services: [
    {
      id: 'srv-wedding',
      slug: 'wedding-photography',
      title: 'Wedding Photography',
      shortDesc: 'Unobtrusive, heartfelt documentation of your vows, celebrations, and intimate connections.',
      detailedDesc: 'Full-day and multi-day coverage designed to capture the genuine spirit of your wedding without stiff poses.',
      active: true,
      order: 1,
      suggestedAspectRatio: 'landscape',
    },
    {
      id: 'srv-prewedding',
      slug: 'pre-wedding-photography',
      title: 'Pre-Wedding Photography',
      shortDesc: 'Artful couple sessions in natural landscapes or architectural settings celebrating your partnership.',
      detailedDesc: 'Relaxed sessions tailored to your shared story, creating effortless, editorial portraits ahead of your celebration.',
      active: true,
      order: 2,
      suggestedAspectRatio: 'portrait',
    },
    {
      id: 'srv-portrait',
      slug: 'portrait-photography',
      title: 'Portrait Photography',
      shortDesc: 'Character-driven individual, editorial, and creative portraits highlighting authentic presence.',
      detailedDesc: 'Nuanced lighting and quiet direction designed to produce commanding, timeless personal portraits.',
      active: true,
      order: 3,
      suggestedAspectRatio: 'portrait',
    },
    {
      id: 'srv-family',
      slug: 'family-photography',
      title: 'Family Photography',
      shortDesc: 'Warm, candid family imagery preserving fleeting milestones and spontaneous connections.',
      detailedDesc: 'Generational stories captured in comfortable settings with warmth, spontaneity, and quiet grace.',
      active: true,
      order: 4,
      suggestedAspectRatio: 'landscape',
    },
    {
      id: 'srv-event',
      slug: 'event-photography',
      title: 'Event Photography',
      shortDesc: 'Cinematic coverage of cultural milestones, private gatherings, and curated celebrations.',
      detailedDesc: 'Comprehensive event visual reporting capturing atmosphere, emotion, and key attendees with refined aesthetics.',
      active: true,
      order: 5,
      suggestedAspectRatio: 'landscape',
    },
    {
      id: 'srv-commercial',
      slug: 'commercial-photography',
      title: 'Commercial Photography',
      shortDesc: 'High-concept brand imagery, campaigns, and lookbooks crafted to elevate visual identity.',
      detailedDesc: 'Structured commercial productions translating creative briefs into compelling visual narratives.',
      active: true,
      order: 6,
      suggestedAspectRatio: 'landscape',
    },
    {
      id: 'srv-product',
      slug: 'product-photography',
      title: 'Product Photography',
      shortDesc: 'Precision still-life, texture-rich editorial displays, and bespoke e-commerce imagery.',
      detailedDesc: 'Art-directed studio and environment compositions celebrating design craftsmanship and tactile quality.',
      active: true,
      order: 7,
      suggestedAspectRatio: 'square',
    },
    {
      id: 'srv-other',
      slug: 'other-services',
      title: 'Other Photography Services',
      shortDesc: 'Custom commissions, architecture, editorial assignments, and bespoke creative projects.',
      detailedDesc: 'Tailored photography assignments developed collaboratively to meet unique creative visions.',
      active: true,
      order: 8,
      suggestedAspectRatio: 'landscape',
    },
  ],

  // 4 Studio Principles (The TS Experience)
  principles: [
    {
      number: '01',
      title: 'Thoughtful Storytelling',
      description:
        'We seek the genuine emotion and unforced gestures that emerge naturally, creating a true reflection of the day.',
    },
    {
      number: '02',
      title: 'Personalised Experiences',
      description:
        'Every session is shaped around your unique vision, rhythm, and aesthetic sensibilities rather than a rigid formula.',
    },
    {
      number: '03',
      title: 'Attention to Detail',
      description:
        'From delicate ambient light to quiet textural details, we cultivate an intentional visual balance in every frame.',
    },
    {
      number: '04',
      title: 'Timeless Visuals',
      description:
        'Our editorial approach and restrained color science ensure your images remain captivating for generations to come.',
    },
  ],

  stories: [],
  testimonials: [],

  // Official Centralized Studio Contact Information
  contact: {
    email: 'tholkappiyana07@gmail.com',
    phone: '+91 6369911759',
    whatsapp: 'https://wa.me/916369911759?text=Hi%20TS%20Photography!%20I\'m%20interested%20in%20booking%20a%20photography%20session.%20Could%20you%20please%20share%20more%20details%3F',
    instagram: '@ts_photo_graphy_56',
    instagramUrl: 'https://www.instagram.com/ts_photo_graphy_56/',
    address: 'TS Photography Studio',
  },
};
