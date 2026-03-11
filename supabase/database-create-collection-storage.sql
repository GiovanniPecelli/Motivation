-- ========================================
-- AGGIUNGI STORAGE PER COLLEZIONI
-- ========================================

-- Create storage bucket for collection images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'collection-images',
  'collection-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload collection images
CREATE POLICY "Users can upload collection images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'collection-images' AND
  auth.role() = 'authenticated'
);

-- Policy to allow authenticated users to read collection images
CREATE POLICY "Users can read collection images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'collection-images'
);

-- Policy to allow users to update their own collection images
CREATE POLICY "Users can update own collection images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'collection-images' AND
  auth.role() = 'authenticated'
);

-- Policy to allow users to delete their own collection images
CREATE POLICY "Users can delete own collection images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'collection-images' AND
  auth.role() = 'authenticated'
);

-- ========================================
-- ESEGUI QUESTO SCRIPT IN SUPABASE SQL EDITOR
-- ========================================
