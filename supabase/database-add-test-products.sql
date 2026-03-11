-- ========================================
-- AGGIUNGI PRODOTTI DI TEST
-- ========================================

-- Inserisci prodotti di test con varianti
INSERT INTO products (title, description, price, category, is_active, created_by) VALUES
('Original Motivation', 'T-shirt classica con logo originale', 39.99, 't-shirts', true, '14aa5699-8c67-4e77-af19-3bea07abed39'),
('Motivation Pro', 'Versione premium con materiali superiori', 59.99, 't-shirts', true, '14aa5699-8c67-4e77-af19-3bea07abed39'),
('Motivation Sport', 'Perfetta per attività sportive', 49.99, 't-shirts', true, '14aa5699-8c67-4e77-af19-3bea07abed39');

-- Inserisci varianti per ogni prodotto
-- Original Motivation
INSERT INTO product_variants (product_id, color, color_hex, stock_s, stock_m, stock_l, stock_xl, images) VALUES
((SELECT id FROM products WHERE title = 'Original Motivation' LIMIT 1), 'Nero', '#000000', 10, 15, 12, 8, ARRAY['https://picsum.photos/seed/shirt1/400/400.jpg']),
((SELECT id FROM products WHERE title = 'Original Motivation' LIMIT 1), 'Bianco', '#FFFFFF', 8, 12, 10, 6, ARRAY['https://picsum.photos/seed/shirt2/400/400.jpg']),
((SELECT id FROM products WHERE title = 'Original Motivation' LIMIT 1), 'Grigio', '#808080', 5, 8, 6, 4, ARRAY['https://picsum.photos/seed/shirt3/400/400.jpg']);

-- Motivation Pro
INSERT INTO product_variants (product_id, color, color_hex, stock_s, stock_m, stock_l, stock_xl, images) VALUES
((SELECT id FROM products WHERE title = 'Motivation Pro' LIMIT 1), 'Nero', '#000000', 5, 10, 8, 5, ARRAY['https://picsum.photos/seed/pro1/400/400.jpg']),
((SELECT id FROM products WHERE title = 'Motivation Pro' LIMIT 1), 'Blu', '#0000FF', 3, 8, 6, 4, ARRAY['https://picsum.photos/seed/pro2/400/400.jpg']);

-- Motivation Sport
INSERT INTO product_variants (product_id, color, color_hex, stock_s, stock_m, stock_l, stock_xl, images) VALUES
((SELECT id FROM products WHERE title = 'Motivation Sport' LIMIT 1), 'Rosso', '#FF0000', 12, 20, 15, 10, ARRAY['https://picsum.photos/seed/sport1/400/400.jpg']),
((SELECT id FROM products WHERE title = 'Motivation Sport' LIMIT 1), 'Bianco', '#FFFFFF', 8, 15, 12, 8, ARRAY['https://picsum.photos/seed/sport2/400/400.jpg']),
((SELECT id FROM products WHERE title = 'Motivation Sport' LIMIT 1), 'Blu', '#0000FF', 10, 18, 15, 12, ARRAY['https://picsum.photos/seed/sport3/400/400.jpg']);

-- ========================================
-- FINE
-- ========================================
