import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getStudioMediaInventory } from '@/lib/supabase/media';
import MediaManager, { AdminMediaItem } from '@/components/admin/media-manager';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const supabase = await createServerSupabaseClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  let items: AdminMediaItem[] = [];

  try {
    // 1. Query media_items table ordered by sort_order and created_at
    const { data: dbItems, error } = await supabase
      .from('media_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (!error && dbItems && dbItems.length > 0) {
      items = dbItems.map((row: any) => ({
        id: row.id,
        storage_path: row.storage_path,
        filename: row.filename,
        title: row.title,
        description: row.description,
        category: row.category,
        media_type: row.media_type,
        is_visible: row.is_visible,
        file_size: row.file_size,
        mime_type: row.mime_type,
        created_at: row.created_at,
        updated_at: row.updated_at,
        url: `${supabaseUrl}/storage/v1/object/public/TS_photography/${row.storage_path}`,
      }));
    } else {
      // 2. Fallback to storage discovery & verified catalog
      const inventory = await getStudioMediaInventory();
      const all = [
        ...(inventory.videoAsset ? [inventory.videoAsset] : []),
        ...inventory.allPhotos,
      ];

      items = all.map((asset, index) => ({
        id: asset.name,
        storage_path: asset.name,
        filename: asset.name,
        title: asset.title || asset.name,
        description: asset.caption,
        category: asset.type === 'video' ? 'Cinema' : 'Fine Art',
        media_type: asset.type,
        is_visible: true,
        file_size: asset.size,
        mime_type: asset.mimeType,
        created_at: asset.createdAt || undefined,
        url: asset.url,
      }));
    }
  } catch (err) {
    console.warn('[Admin Media Page] Note querying media:', err);
  }

  return (
    <MediaManager
      initialItems={items}
      supabaseUrl={supabaseUrl}
    />
  );
}
