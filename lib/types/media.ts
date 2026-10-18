export type MediaType = 'image' | 'video';

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  mimeType?: string;
  size?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  title?: string;
  caption?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  category?: string;
}

export interface StudioMediaInventory {
  heroPhoto: MediaAsset | null;
  portfolioPhotos: MediaAsset[];
  allPhotos: MediaAsset[];
  videoAsset: MediaAsset | null;
  totalPhotosCount: number;
  totalVideosCount: number;
  isConfigured: boolean;
  bucketAccessible: boolean;
  statusMessage?: string;
}

export interface PhotographyService {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  active: boolean;
  order: number;
  suggestedAspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface StudioPrinciple {
  number: string;
  title: string;
  description: string;
}

export interface StudioStory {
  id: string;
  title: string;
  category: string;
  description: string;
  date?: string;
  location?: string;
  featuredImage?: string;
}

export interface StudioTestimonial {
  id: string;
  clientName: string;
  quote: string;
  category?: string;
  year?: string;
}

export interface StudioConfig {
  name: string;
  tagline: string;
  heroHeadline: string;
  heroSupportingText: string;
  heroSubLabel: string;
  aboutHeadline: string;
  aboutIntroCopy: string;
  aboutImageUrl?: string;
  services: PhotographyService[];
  principles: StudioPrinciple[];
  stories: StudioStory[];
  testimonials: StudioTestimonial[];
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    instagram?: string;
    instagramUrl?: string;
  };
}
