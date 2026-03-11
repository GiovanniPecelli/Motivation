-- ========================================
-- CREAZIONE TABELLA COLLECTIONS
-- ========================================

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_collections_name ON collections(name);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON collections(created_at);

-- Add collection column to products table (if not exists)
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection TEXT;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_collections_updated_at 
BEFORE UPDATE ON collections 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ESEGUI QUESTO SCRIPT IN SUPABASE SQL EDITOR
-- ========================================
