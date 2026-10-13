/*
# Add variants to more demo and genuine products

1. Products receiving variants
- Strawberry Keychain (DEMO-KEY-001) — Colour options
- Mini Owl Charm (DEMO-KEY-002) — Colour options
- Heart Keychain Set (DEMO-KEY-003) — Colour options
- Mini Coin Purse (DEMO-BAG-003) — Colour options
- Striped Market Bag (DEMO-BAG-002) — Size options
- Sunflower Brooch (DEMO-FLW-001) — Size options
- Daisy Hair Clip Set (DEMO-FLW-003) — Colour options
- Bunny Amigurumi (DEMO-TOY-001) — Colour options
- Whale Plushie (DEMO-TOY-002) — Size options
- Dream Catcher Wall Hanging (DEMO-HOM-002) — Colour options

2. Variant details
- Each variant includes realistic colour/size options.
- Selected options have different prices, SKUs, stock quantities, and image URLs.
- Some options are marked unavailable to test the blocking behaviour.

3. Safety
- Uses NOT EXISTS checks to avoid duplicate variant rows.
- Does not modify existing products, variants, orders, or customer data.
- Genuine products (NULL SKU) are not modified.
*/

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["Red","Blue","Yellow"]'::jsonb,
  '{"Red":90,"Blue":90,"Yellow":100}'::jsonb, '{}'::jsonb,
  '{"Red":"https://images.pexels.com/photos/37328223/pexels-photo-37328223.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Blue":"https://images.pexels.com/photos/7297165/pexels-photo-7297165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Yellow":"https://images.pexels.com/photos/7177578/pexels-photo-7177578.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Red":"DEMO-KEY-001-RED","Blue":"DEMO-KEY-001-BLUE","Yellow":"DEMO-KEY-001-YELLOW"}'::jsonb,
  '{"Red":5,"Blue":0,"Yellow":3}'::jsonb,
  '{"Red":true,"Blue":false,"Yellow":true}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-KEY-001'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["Brown","Grey","Teal"]'::jsonb,
  '{"Brown":110,"Grey":110,"Teal":120}'::jsonb, '{}'::jsonb,
  '{"Brown":"https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Grey":"https://images.pexels.com/photos/7156841/pexels-photo-7156841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Teal":"https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Brown":"DEMO-KEY-002-BROWN","Grey":"DEMO-KEY-002-GREY","Teal":"DEMO-KEY-002-TEAL"}'::jsonb,
  '{"Brown":4,"Grey":3,"Teal":2}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-KEY-002'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["Red","Pink","Purple"]'::jsonb,
  '{"Red":200,"Pink":200,"Purple":220}'::jsonb, '{"Pink":180}'::jsonb,
  '{"Red":"https://images.pexels.com/photos/14763992/pexels-photo-14763992.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Pink":"https://images.pexels.com/photos/34967468/pexels-photo-34967468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Purple":"https://images.pexels.com/photos/7738663/pexels-photo-7738663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Red":"DEMO-KEY-003-RED","Pink":"DEMO-KEY-003-PINK","Purple":"DEMO-KEY-003-PURPLE"}'::jsonb,
  '{"Red":3,"Pink":5,"Purple":2}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-KEY-003'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["Cream","Mint","Lavender"]'::jsonb,
  '{"Cream":180,"Mint":190,"Lavender":190}'::jsonb, '{}'::jsonb,
  '{"Cream":"https://images.pexels.com/photos/7177578/pexels-photo-7177578.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Mint":"https://images.pexels.com/photos/7297165/pexels-photo-7297165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Lavender":"https://images.pexels.com/photos/7738663/pexels-photo-7738663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Cream":"DEMO-BAG-003-CREAM","Mint":"DEMO-BAG-003-MINT","Lavender":"DEMO-BAG-003-LAVENDER"}'::jsonb,
  '{"Cream":4,"Mint":3,"Lavender":2}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-BAG-003'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Size', '["Small","Medium","Large"]'::jsonb,
  '{"Small":450,"Medium":500,"Large":550}'::jsonb, '{}'::jsonb,
  '{"Small":"https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Medium":"https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Large":"https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Small":"DEMO-BAG-002-S","Medium":"DEMO-BAG-002-M","Large":"DEMO-BAG-002-L"}'::jsonb,
  '{"Small":3,"Medium":4,"Large":2}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-BAG-002'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Size', '["Small (4cm)","Large (7cm)"]'::jsonb,
  '{"Small (4cm)":120,"Large (7cm)":160}'::jsonb, '{}'::jsonb,
  '{"Small (4cm)":"https://images.pexels.com/photos/1214202/pexels-photo-1214202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Large (7cm)":"https://images.pexels.com/photos/14763992/pexels-photo-14763992.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Small (4cm)":"DEMO-FLW-001-S","Large (7cm)":"DEMO-FLW-001-L"}'::jsonb,
  '{"Small (4cm)":6,"Large (7cm)":4}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-FLW-001'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["White","Yellow","Pink"]'::jsonb,
  '{"White":150,"Yellow":150,"Pink":160}'::jsonb, '{}'::jsonb,
  '{"White":"https://images.pexels.com/photos/1214202/pexels-photo-1214202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Yellow":"https://images.pexels.com/photos/7467236/pexels-photo-7467236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Pink":"https://images.pexels.com/photos/34967468/pexels-photo-34967468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"White":"DEMO-FLW-003-WHITE","Yellow":"DEMO-FLW-003-YELLOW","Pink":"DEMO-FLW-003-PINK"}'::jsonb,
  '{"White":4,"Yellow":3,"Pink":3}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-FLW-003'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["Cream","Brown","Grey"]'::jsonb,
  '{"Cream":500,"Brown":520,"Grey":520}'::jsonb, '{}'::jsonb,
  '{"Cream":"https://images.pexels.com/photos/12109904/pexels-photo-12109904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Brown":"https://images.pexels.com/photos/37328223/pexels-photo-37328223.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Grey":"https://images.pexels.com/photos/7738663/pexels-photo-7738663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Cream":"DEMO-TOY-001-CREAM","Brown":"DEMO-TOY-001-BROWN","Grey":"DEMO-TOY-001-GREY"}'::jsonb,
  '{"Cream":3,"Brown":2,"Grey":0}'::jsonb,
  '{"Cream":true,"Brown":true,"Grey":false}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-TOY-001'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Size', '["Small (15cm)","Medium (25cm)"]'::jsonb,
  '{"Small (15cm)":420,"Medium (25cm)":520}'::jsonb, '{}'::jsonb,
  '{"Small (15cm)":"https://images.pexels.com/photos/21967198/pexels-photo-21967198.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Medium (25cm)":"https://images.pexels.com/photos/7738663/pexels-photo-7738663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Small (15cm)":"DEMO-TOY-002-S","Medium (25cm)":"DEMO-TOY-002-M"}'::jsonb,
  '{"Small (15cm)":4,"Medium (25cm)":3}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-TOY-002'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT p.id, 'Colour', '["Cream","Teal","Rose"]'::jsonb,
  '{"Cream":400,"Teal":420,"Rose":420}'::jsonb, '{}'::jsonb,
  '{"Cream":"https://images.pexels.com/photos/7156841/pexels-photo-7156841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Teal":"https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Rose":"https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Cream":"DEMO-HOM-002-CREAM","Teal":"DEMO-HOM-002-TEAL","Rose":"DEMO-HOM-002-ROSE"}'::jsonb,
  '{"Cream":3,"Teal":2,"Rose":2}'::jsonb, '{}'::jsonb, 0
FROM products p WHERE p.sku = 'DEMO-HOM-002'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);
