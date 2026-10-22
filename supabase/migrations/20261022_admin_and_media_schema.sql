-- ============================================================================
-- TS PHOTOGRAPHY — ADMIN DASHBOARD, MEDIA CRUD & BOOKING ENQUIRIES MIGRATION
-- ============================================================================

-- 1. Ensure booking_enquiries table exists and supports complete lifecycle statuses
CREATE TABLE IF NOT EXISTS public.booking_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_type TEXT NOT NULL,
    preferred_date TEXT,
    location TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
);

-- Update status constraint to include full admin workflow: new, contacted, confirmed, closed, archived
ALTER TABLE public.booking_enquiries DROP CONSTRAINT IF EXISTS booking_enquiries_status_check;
ALTER TABLE public.booking_enquiries
    ADD CONSTRAINT booking_enquiries_status_check
    CHECK (status IN ('new', 'reviewed', 'contacted', 'confirmed', 'closed', 'archived'));

-- Length constraints
ALTER TABLE public.booking_enquiries DROP CONSTRAINT IF EXISTS full_name_length_check;
ALTER TABLE public.booking_enquiries
    ADD CONSTRAINT full_name_length_check CHECK (char_length(full_name) BETWEEN 2 AND 150);

ALTER TABLE public.booking_enquiries DROP CONSTRAINT IF EXISTS email_length_check;
ALTER TABLE public.booking_enquiries
    ADD CONSTRAINT email_length_check CHECK (char_length(email) BETWEEN 5 AND 200);

ALTER TABLE public.booking_enquiries DROP CONSTRAINT IF EXISTS message_length_check;
ALTER TABLE public.booking_enquiries
    ADD CONSTRAINT message_length_check CHECK (char_length(message) >= 10);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_created_at ON public.booking_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_status ON public.booking_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_email ON public.booking_enquiries(email);

-- Enable RLS for booking_enquiries
ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors and authenticated users to insert booking enquiries
DROP POLICY IF EXISTS "Allow public insert to booking_enquiries" ON public.booking_enquiries;
CREATE POLICY "Allow public insert to booking_enquiries"
ON public.booking_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated admin/staff users to view customer enquiries
DROP POLICY IF EXISTS "Allow staff to view enquiries" ON public.booking_enquiries;
CREATE POLICY "Allow staff to view enquiries"
ON public.booking_enquiries
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated admin/staff users to update enquiry status
DROP POLICY IF EXISTS "Allow staff to update enquiry status" ON public.booking_enquiries;
CREATE POLICY "Allow staff to update enquiry status"
ON public.booking_enquiries
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated admin/staff users to delete enquiries if needed
DROP POLICY IF EXISTS "Allow staff to delete enquiries" ON public.booking_enquiries;
CREATE POLICY "Allow staff to delete enquiries"
ON public.booking_enquiries
FOR DELETE
TO authenticated
USING (true);


-- 2. Create media_items table for Storage metadata and portfolio management
CREATE TABLE IF NOT EXISTS public.media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_path TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Other',
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast gallery and filter retrieval
CREATE INDEX IF NOT EXISTS idx_media_items_is_visible ON public.media_items(is_visible);
CREATE INDEX IF NOT EXISTS idx_media_items_media_type ON public.media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_category ON public.media_items(category);
CREATE INDEX IF NOT EXISTS idx_media_items_sort_order ON public.media_items(sort_order ASC, created_at DESC);

-- Enable RLS for media_items
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Public can SELECT visible media only (for public portfolio and homepage)
DROP POLICY IF EXISTS "Allow public select visible media" ON public.media_items;
CREATE POLICY "Allow public select visible media"
ON public.media_items
FOR SELECT
TO anon, authenticated
USING (is_visible = true);

-- Authenticated staff/admins can SELECT all media (including hidden items)
DROP POLICY IF EXISTS "Allow staff select all media" ON public.media_items;
CREATE POLICY "Allow staff select all media"
ON public.media_items
FOR SELECT
TO authenticated
USING (true);

-- Authenticated staff/admins can INSERT new media metadata
DROP POLICY IF EXISTS "Allow staff insert media" ON public.media_items;
CREATE POLICY "Allow staff insert media"
ON public.media_items
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated staff/admins can UPDATE media metadata
DROP POLICY IF EXISTS "Allow staff update media" ON public.media_items;
CREATE POLICY "Allow staff update media"
ON public.media_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated staff/admins can DELETE media records
DROP POLICY IF EXISTS "Allow staff delete media" ON public.media_items;
CREATE POLICY "Allow staff delete media"
ON public.media_items
FOR DELETE
TO authenticated
USING (true);


-- 3. Create admin_users table for explicit authorization
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read admin_users" ON public.admin_users;
CREATE POLICY "Allow authenticated read admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);


-- 4. Storage Bucket Configuration for 'TS_photography'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'TS_photography',
    'TS_photography',
    true,
    52428800, -- 50MB per file
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Ensure public can read files in storage.objects
DROP POLICY IF EXISTS "Allow public read access to TS_photography" ON storage.objects;
CREATE POLICY "Allow public read access to TS_photography"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'TS_photography');

-- Ensure authenticated staff can insert, update, and delete files in TS_photography
DROP POLICY IF EXISTS "Allow staff manage TS_photography" ON storage.objects;
CREATE POLICY "Allow staff manage TS_photography"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'TS_photography')
WITH CHECK (bucket_id = 'TS_photography');


-- 5. Seed the verified root-level files into media_items (preserving all existing media)
INSERT INTO public.media_items (storage_path, filename, title, description, category, media_type, is_visible, sort_order)
VALUES
    ('sunset1.jpeg', 'sunset1.jpeg', 'Dusk Horizon', 'Dramatic twilight fine art landscape photograph.', 'Fine Art', 'image', true, 1),
    ('img1.jpeg', 'img1.jpeg', 'Editorial Portrait', 'Natural light character study with subtle tones.', 'Portrait', 'image', true, 2),
    ('s1.jpeg', 's1.jpeg', 'Candid Moments I', 'Celebration and candid ceremony documentation.', 'Wedding', 'image', true, 3),
    ('s2.jpeg', 's2.jpeg', 'Candid Moments II', 'Unscripted emotional connection and authentic joy.', 'Wedding', 'image', true, 4),
    ('sunset2.jpeg', 'sunset2.jpeg', 'Golden Hour Splendour', 'Warm atmospheric couple and pre-wedding portrait.', 'Pre-Wedding', 'image', true, 5),
    ('WhatsApp Image 2026-10-18 at 4.16.45 PM.jpeg', 'WhatsApp Image 2026-10-18 at 4.16.45 PM.jpeg', 'The Studio Artist', 'Founder Tholkappiyan A behind the lens.', 'Studio', 'image', true, 6),
    ('Video2.mp4', 'Video2.mp4', 'Cinematic Highlight Reel', 'High-definition wedding and event cinema preview.', 'Cinema', 'video', true, 7)
ON CONFLICT (storage_path) DO NOTHING;
