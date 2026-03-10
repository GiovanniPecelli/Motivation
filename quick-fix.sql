-- Quick fix: Add specifications column to products table
ALTER TABLE products ADD COLUMN specifications TEXT;

-- Also fix the cart_items table to match new schema
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id);

-- Update existing cart_items to fix column references
-- This will handle the transition from old schema to new schema
