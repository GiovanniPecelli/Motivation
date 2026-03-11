-- ========================================
-- AGGIUNGI COLONNA IS_FEATURED A PRODUCTS
-- ========================================

-- Aggiungi colonna is_featured (boolean)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Crea index per ricerca veloce
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

-- ========================================
-- FINE
-- ========================================
