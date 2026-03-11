-- ========================================
-- AGGIUNGI IMMAGINI COLLEZIONI
-- ========================================

-- Add image columns to collections table
ALTER TABLE collections ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for display order
CREATE INDEX IF NOT EXISTS idx_collections_display_order ON collections(display_order);

-- Update collections with sample images
UPDATE collections 
SET 
  image_url = 'https://picsum.photos/seed/collection1/400/300.jpg',
  banner_url = 'https://picsum.photos/seed/banner1/1200/400.jpg'
WHERE name = 'Estate 2024';

UPDATE collections 
SET 
  image_url = 'https://picsum.photos/seed/collection2/400/300.jpg',
  banner_url = 'https://picsum.photos/seed/banner2/1200/400.jpg'
WHERE name = 'Inverno 2024';

-- ========================================
-- ESEGUI QUESTO SCRIPT IN SUPABASE SQL EDITOR
-- ========================================
