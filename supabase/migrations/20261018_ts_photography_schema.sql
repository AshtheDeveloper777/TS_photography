-- ============================================================================
-- TS PHOTOGRAPHY — SUPABASE DATABASE MIGRATION & STORAGE POLICIES
-- ============================================================================

-- 1. Create booking_enquiries table
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
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'archived'))
);

-- Length constraints to prevent database abuse
ALTER TABLE public.booking_enquiries
    ADD CONSTRAINT full_name_length_check CHECK (char_length(full_name) BETWEEN 2 AND 150),
    ADD CONSTRAINT email_length_check CHECK (char_length(email) BETWEEN 5 AND 200),
    ADD CONSTRAINT message_length_check CHECK (char_length(message) >= 10);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_created_at ON public.booking_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_status ON public.booking_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_booking_enquiries_email ON public.booking_enquiries(email);

-- 2. Security & Row Level Security (RLS)
ALTER TABLE public.booking_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous visitors and authenticated users to submit booking enquiries ONLY
DROP POLICY IF EXISTS "Allow public insert to booking_enquiries" ON public.booking_enquiries;
CREATE POLICY "Allow public insert to booking_enquiries"
ON public.booking_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Disallow anonymous reading, updating, or deleting of enquiries
-- Only authenticated studio staff or service_role can view or modify customer enquiries
DROP POLICY IF EXISTS "Allow staff to view enquiries" ON public.booking_enquiries;
CREATE POLICY "Allow staff to view enquiries"
ON public.booking_enquiries
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow staff to update enquiry status" ON public.booking_enquiries;
CREATE POLICY "Allow staff to update enquiry status"
ON public.booking_enquiries
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Supabase Storage Bucket Configuration for 'TS_photography'
-- Ensure the bucket exists
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

-- Storage Policy: Allow public read access to all files in TS_photography
DROP POLICY IF EXISTS "Allow public read access to TS_photography" ON storage.objects;
CREATE POLICY "Allow public read access to TS_photography"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'TS_photography');

-- Storage Policy: Allow authenticated staff to upload/manage media in TS_photography
DROP POLICY IF EXISTS "Allow staff manage TS_photography" ON storage.objects;
CREATE POLICY "Allow staff manage TS_photography"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'TS_photography')
WITH CHECK (bucket_id = 'TS_photography');
