-- ========================================
-- AGGIUNGI COLONNA TAGS A PRODUCTS
-- ========================================

-- Aggiungi colonna tags (array di stringhe)
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Crea index per ricerca veloce
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- ========================================
-- FINE
-- ========================================
