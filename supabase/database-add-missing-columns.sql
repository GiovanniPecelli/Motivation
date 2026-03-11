-- ========================================
-- AGGIUNGI COLONNE MANCANTI A PRODUCTS
-- ========================================

-- Aggiungi colonna tags (array di stringhe)
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Aggiungi colonna collection
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection TEXT;

-- Crea index per ricerca veloce
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);

-- ========================================
-- FINE
-- ========================================
