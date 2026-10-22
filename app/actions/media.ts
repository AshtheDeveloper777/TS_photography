'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdmin } from '@/lib/auth/admin';

const BUCKET_NAME = 'TS_photography';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm']);

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const VERIFIED_ROOT_FILES = [
  { name: 'sunset1.jpeg', title: 'Dusk Horizon', category: 'Fine Art', type: 'image' },
  { name: 'img1.jpeg', title: 'Editorial Portrait', category: 'Portrait', type: 'image' },
  { name: 's1.jpeg', title: 'Candid Moments I', category: 'Wedding', type: 'image' },
  { name: 's2.jpeg', title: 'Candid Moments II', category: 'Wedding', type: 'image' },
  { name: 'sunset2.jpeg', title: 'Golden Hour Splendour', category: 'Pre-Wedding', type: 'image' },
  { name: 'WhatsApp Image 2026-10-18 at 4.16.45 PM.jpeg', title: 'The Studio Artist', category: 'Studio', type: 'image' },
  { name: 'Video2.mp4', title: 'Cinematic Highlight Reel', category: 'Cinema', type: 'video' },
];

function sanitizeFilename(originalName: string): string {
  const parts = originalName.split('.');
  const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
  const name = parts.join('.')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${name}_${timestamp}_${randomSuffix}.${ext}`;
}

export interface MediaOperationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

/**
 * Upload one or multiple media files to Supabase Storage and register metadata.
 */
export async function uploadMediaItem(formData: FormData): Promise<MediaOperationResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized. Admin credentials required.' };
  }

  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const category = (formData.get('category') as string)?.trim() || 'Other';
  const isVisible = formData.get('isVisible') === 'true' || formData.get('isVisible') === 'on';

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: 'Please choose a valid photo or video file to upload.' };
  }

  const mimeType = file.type;
  const isImage = ALLOWED_IMAGE_TYPES.has(mimeType);
  const isVideo = ALLOWED_VIDEO_TYPES.has(mimeType);

  if (!isImage && !isVideo) {
    return {
      success: false,
      error: `Unsupported file format (${mimeType}). Allowed formats: JPEG, PNG, WebP, and MP4.`,
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return { success: false, error: 'Image exceeds the maximum allowed size of 15MB.' };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return { success: false, error: 'Video exceeds the maximum allowed size of 50MB.' };
  }

  const storageClient = createAdminClient() || (await createServerSupabaseClient());
  const uniqueStoragePath = sanitizeFilename(file.name);

  try {
    const fileBuffer = await file.arrayBuffer();

    // 1. Upload to Supabase Storage bucket
    const { error: uploadError } = await storageClient.storage
      .from(BUCKET_NAME)
      .upload(uniqueStoragePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('[Admin Media Upload] Storage error:', uploadError);
      return { success: false, error: `Storage upload failed: ${uploadError.message}` };
    }

    // 2. Insert metadata into media_items table
    const fallbackTitle =
      title ||
      file.name
        .substring(0, file.name.lastIndexOf('.'))
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const { data: dbData, error: dbError } = await storageClient
      .from('media_items')
      .insert([
        {
          storage_path: uniqueStoragePath,
          filename: file.name,
          title: fallbackTitle,
          description: description || null,
          category,
          media_type: isVideo ? 'video' : 'image',
          is_visible: isVisible,
          file_size: file.size,
          mime_type: mimeType,
        },
      ])
      .select()
      .maybeSingle();

    if (dbError) {
      console.warn('[Admin Media Upload] Database note:', dbError.message);
      // Even if table insert fails, the file is safely in storage
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin');
    revalidatePath('/admin/media');

    return {
      success: true,
      message: `Successfully uploaded "${file.name}".`,
      data: dbData,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return { success: false, error: msg };
  }
}

/**
 * Update media metadata (title, description, category, visibility).
 */
export async function updateMediaItem(
  id: string,
  updates: {
    title?: string;
    description?: string;
    category?: string;
    is_visible?: boolean;
    sort_order?: number;
  }
): Promise<MediaOperationResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized.' };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    const payload: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('media_items')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin');
    revalidatePath('/admin/media');

    return { success: true, message: 'Media metadata updated successfully.' };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
  }
}

/**
 * Safely replace a media file while preserving or updating its metadata reference.
 */
export async function replaceMediaFile(
  mediaId: string,
  formData: FormData
): Promise<MediaOperationResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized.' };
  }

  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: 'Please choose a replacement file.' };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    // 1. Get existing media item
    const { data: item, error: fetchError } = await supabase
      .from('media_items')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (fetchError || !item) {
      return { success: false, error: 'Target media item not found.' };
    }

    const fileBuffer = await file.arrayBuffer();
    const newStoragePath = sanitizeFilename(file.name);

    // 2. Upload replacement file
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newStoragePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Failed to upload replacement: ${uploadError.message}` };
    }

    // 3. Remove previous file from storage (if not one of the original verified files)
    const isOriginalSeed = VERIFIED_ROOT_FILES.some((v) => v.name === item.storage_path);
    if (!isOriginalSeed && item.storage_path !== newStoragePath) {
      await supabase.storage.from(BUCKET_NAME).remove([item.storage_path]);
    }

    // 4. Update database record
    const { error: dbError } = await supabase
      .from('media_items')
      .update({
        storage_path: newStoragePath,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', mediaId);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/media');

    return { success: true, message: 'Media replaced successfully.' };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Replace failed' };
  }
}

/**
 * Delete a media item: removes both the Storage object and the database record.
 */
export async function deleteMediaItem(
  mediaId: string,
  storagePath: string
): Promise<MediaOperationResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized.' };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    // 1. Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (storageError) {
      console.warn('[Admin Media Delete] Storage delete warning:', storageError.message);
    }

    // 2. Delete from media_items table
    const { error: dbError } = await supabase
      .from('media_items')
      .delete()
      .eq('id', mediaId);

    if (dbError) {
      return {
        success: false,
        error: `Database delete failed: ${dbError.message}. Storage object may have been removed.`,
      };
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin');
    revalidatePath('/admin/media');

    return { success: true, message: 'Media item deleted successfully.' };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

/**
 * Syncs the verified root files into media_items table so they are manageable in admin.
 */
export async function syncStorageInventory(): Promise<MediaOperationResult> {
  const auth = await verifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: 'Unauthorized.' };
  }

  const supabase = createAdminClient() || (await createServerSupabaseClient());

  try {
    let inserted = 0;
    for (const v of VERIFIED_ROOT_FILES) {
      const { data: existing } = await supabase
        .from('media_items')
        .select('id')
        .eq('storage_path', v.name)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from('media_items').insert([
          {
            storage_path: v.name,
            filename: v.name,
            title: v.title,
            category: v.category,
            media_type: v.type,
            is_visible: true,
            sort_order: inserted + 1,
          },
        ]);
        if (!error) inserted++;
      }
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/media');

    return {
      success: true,
      message: `Sync completed. ${inserted} existing media items registered.`,
    };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Sync failed' };
  }
}
