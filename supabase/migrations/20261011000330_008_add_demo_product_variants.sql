/*
# Add variants for demo products
Adds colour/size variants to selected demo products for testing variant selection,
pricing, and stock management in the admin and storefront.
*/

-- Daisy Crossbody Bag: Colour variant with price differences
INSERT INTO product_variants (product_id, name, options, option_prices, option_stock, sort_order)
VALUES
('d0000001-0000-0000-0000-000000000001', 'Colour',
  '["Cream", "Sage Green", "Dusty Pink"]'::jsonb,
  '{"Cream": 750, "Sage Green": 800, "Dusty Pink": 800}'::jsonb,
  '{"Cream": 3, "Sage Green": 2, "Dusty Pink": 3}'::jsonb,
  0
),

-- Rose Bouquet: Colour variant
('d0000005-0000-0000-0000-000000000005', 'Colour',
  '["Red", "Pink", "White", "Yellow"]'::jsonb,
  '{"Red": 350, "Pink": 350, "White": 350, "Yellow": 380}'::jsonb,
  '{"Red": 2, "Pink": 2, "White": 1, "Yellow": 1}'::jsonb,
  0
),

-- Storage Basket: Size variant
('d0000010-0000-0000-0000-000000000010', 'Size',
  '["Small", "Medium", "Large"]'::jsonb,
  '{"Small": 400, "Medium": 550, "Large": 700}'::jsonb,
  '{"Small": 4, "Medium": 3, "Large": 2}'::jsonb,
  0
),

-- Cushion Cover: Colour variant
('d0000012-0000-0000-0000-000000000012', 'Colour',
  '["Beige", "Gray", "Terracotta"]'::jsonb,
  '{"Beige": 320, "Gray": 320, "Terracotta": 350}'::jsonb,
  '{"Beige": 4, "Gray": 3, "Terracotta": 2}'::jsonb,
  0
),

-- Cushion Cover: Size variant
('d0000012-0000-0000-0000-000000000012', 'Size',
  '["14 inch", "16 inch", "18 inch"]'::jsonb,
  '{"14 inch": 280, "16 inch": 320, "18 inch": 380}'::jsonb,
  '{"14 inch": 3, "16 inch": 4, "18 inch": 2}'::jsonb,
  1
),

-- Infinity Scarf: Colour variant
('d0000013-0000-0000-0000-000000000013', 'Colour',
  '["Cream", "Charcoal", "Burgundy", "Forest Green"]'::jsonb,
  '{"Cream": 380, "Charcoal": 380, "Burgundy": 400, "Forest Green": 400}'::jsonb,
  '{"Cream": 3, "Charcoal": 3, "Burgundy": 2, "Forest Green": 2}'::jsonb,
  0
),

-- Ear Warmer Headband: Colour variant
('d0000014-0000-0000-0000-000000000014', 'Colour',
  '["Beige", "Brown", "Black", "Pink"]'::jsonb,
  '{"Beige": 220, "Brown": 220, "Black": 220, "Pink": 240}'::jsonb,
  '{"Beige": 4, "Brown": 4, "Black": 3, "Pink": 3}'::jsonb,
  0
),

-- Fingerless Gloves: Size variant
('d0000015-0000-0000-0000-000000000015', 'Size',
  '["Small/Medium", "Medium/Large"]'::jsonb,
  '{"Small/Medium": 280, "Medium/Large": 280}'::jsonb,
  '{"Small/Medium": 6, "Medium/Large": 5}'::jsonb,
  0
),

-- Personalized Name Keychain: Colour variant
('d0000018-0000-0000-0000-000000000018', 'Colour',
  '["Rainbow", "Pastel", "Earth Tones"]'::jsonb,
  '{"Rainbow": 150, "Pastel": 150, "Earth Tones": 150}'::jsonb,
  '{"Rainbow": null, "Pastel": null, "Earth Tones": null}'::jsonb,
  0
),

-- Custom Couple Keychain Set: Colour variant
('d0000020-0000-0000-0000-000000000020', 'Colour Combination',
  '["Red + Pink", "Black + White", "Blue + Gray", "Custom Mix"]'::jsonb,
  '{"Red + Pink": 250, "Black + White": 250, "Blue + Gray": 250, "Custom Mix": 280}'::jsonb,
  '{"Red + Pink": 3, "Black + White": 3, "Blue + Gray": 2, "Custom Mix": 2}'::jsonb,
  0
);
