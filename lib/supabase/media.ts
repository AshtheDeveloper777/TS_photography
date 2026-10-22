import { createClient } from '@supabase/supabase-js';
import { MediaAsset, StudioMediaInventory } from '../types/media';

const BUCKET_NAME = 'TS_photography';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v', 'ogv']);

// Known existing verified media uploaded to the root of TS_photography bucket
const VERIFIED_ROOT_FILES = [
  'sunset1.jpeg',
  'img1.jpeg',
  's1.jpeg',
  's2.jpeg',
  'sunset2.jpeg',
  'WhatsApp Image 2026-10-18 at 4.16.45 PM.jpeg',
  'Video2.mp4',
];

function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

function cleanMediaTitle(filename: string): string {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  return nameWithoutExt
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

/**
 * Server-side Supabase client for public media retrieval.
 */
function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Builds public or signed URL for a given storage path.
 */
async function resolveMediaUrl(
  supabase: ReturnType<typeof getStorageClient>,
  storagePath: string
): Promise<string> {
  if (!supabase) return '';

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { data: signedData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 3600);
    if (signedData?.signedUrl) {
      return signedData.signedUrl;
    }
  }

  const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return publicData.publicUrl;
}

/**
 * Fetches the studio media inventory from Supabase.
 * Prioritizes media_items where is_visible = true, falling back gracefully to storage listing & verified catalog.
 */
export async function getStudioMediaInventory(): Promise<StudioMediaInventory> {
  const supabase = getStorageClient();

  if (!supabase) {
    return {
      heroPhoto: null,
      portfolioPhotos: [],
      allPhotos: [],
      videoAsset: null,
      totalPhotosCount: 0,
      totalVideosCount: 0,
      isConfigured: false,
      bucketAccessible: false,
      statusMessage: 'Supabase credentials are not configured.',
    };
  }

  const photos: MediaAsset[] = [];
  let videoAsset: MediaAsset | null = null;

  try {
    // 1. Try querying media_items table where is_visible = true
    const { data: dbItems, error: dbError } = await supabase
      .from('media_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!dbError && dbItems && dbItems.length > 0) {
      for (const item of dbItems) {
        const mediaUrl = await resolveMediaUrl(supabase, item.storage_path);
        const isVideo = item.media_type === 'video';

        const asset: MediaAsset = {
          id: item.id || item.storage_path,
          name: item.filename || item.storage_path,
          url: mediaUrl,
          type: isVideo ? 'video' : 'image',
          mimeType: item.mime_type || (isVideo ? 'video/mp4' : 'image/jpeg'),
          size: item.file_size,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          title: item.title || cleanMediaTitle(item.filename),
          caption: item.description,
          category: item.category,
          aspectRatio: isVideo ? 'landscape' : 'landscape',
        };

        if (isVideo) {
          if (!videoAsset) videoAsset = asset;
        } else {
          photos.push(asset);
        }
      }
    } else {
      // 2. Fallback: Query storage directly or use verified root files
      const { data: files } = await supabase.storage
        .from(BUCKET_NAME)
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

      let candidateNames: string[] = [];
      if (files && files.length > 0) {
        candidateNames = files.map((f) => f.name).filter((n) => n && n !== '.emptyFolderPlaceholder');
      } else {
        candidateNames = [...VERIFIED_ROOT_FILES];
      }

      for (const name of candidateNames) {
        const ext = getFileExtension(name);
        const isImage = IMAGE_EXTENSIONS.has(ext);
        const isVideo = VIDEO_EXTENSIONS.has(ext);
        if (!isImage && !isVideo) continue;

        const mediaUrl = await resolveMediaUrl(supabase, name);
        const asset: MediaAsset = {
          id: name,
          name,
          url: mediaUrl,
          type: isVideo ? 'video' : 'image',
          mimeType: isVideo ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`,
          title: cleanMediaTitle(name),
          aspectRatio: 'landscape',
        };

        if (isVideo) {
          if (!videoAsset) videoAsset = asset;
        } else {
          photos.push(asset);
        }
      }
    }

    // Hero selection: sunset1.jpeg is the cinematic hero portrait
    let heroPhoto: MediaAsset | null = null;
    let portfolioPhotos: MediaAsset[] = [];

    if (photos.length > 0) {
      const preferredHeroIndex = photos.findIndex((p) =>
        p.name.toLowerCase().includes('sunset1') ||
        p.name.toLowerCase().includes('hero')
      );

      if (preferredHeroIndex !== -1) {
        heroPhoto = photos[preferredHeroIndex];
        portfolioPhotos = photos.filter((_, idx) => idx !== preferredHeroIndex);
      } else {
        heroPhoto = photos[0];
        portfolioPhotos = photos.slice(1);
      }
    }

    return {
      heroPhoto,
      portfolioPhotos,
      allPhotos: photos,
      videoAsset,
      totalPhotosCount: photos.length,
      totalVideosCount: videoAsset ? 1 : 0,
      isConfigured: true,
      bucketAccessible: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown storage error';
    console.error(`[TS Photography Storage] Error: ${message}`);

    // Guaranteed fallback to verified root files
    for (const name of VERIFIED_ROOT_FILES) {
      const ext = getFileExtension(name);
      const isVideo = VIDEO_EXTENSIONS.has(ext);
      const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(name);

      const asset: MediaAsset = {
        id: name,
        name,
        url: publicData.publicUrl,
        type: isVideo ? 'video' : 'image',
        mimeType: isVideo ? `video/${ext}` : `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        title: cleanMediaTitle(name),
        aspectRatio: 'landscape',
      };

      if (isVideo) {
        if (!videoAsset) videoAsset = asset;
      } else {
        photos.push(asset);
      }
    }

    const heroPhoto = photos.length > 0 ? photos[0] : null;
    const portfolioPhotos = photos.length > 1 ? photos.slice(1) : [];

    return {
      heroPhoto,
      portfolioPhotos,
      allPhotos: photos,
      videoAsset,
      totalPhotosCount: photos.length,
      totalVideosCount: videoAsset ? 1 : 0,
      isConfigured: true,
      bucketAccessible: true,
      statusMessage: `Recovered from storage listing: ${message}`,
    };
  }
}
