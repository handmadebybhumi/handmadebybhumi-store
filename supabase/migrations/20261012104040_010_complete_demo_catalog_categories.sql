/*
# Complete the demo catalog by category

1. New products
- Adds `Cable Knit Cap` in the clothing category with SKU `DEMO-CLT-002`.
- Adds `Winter Wrap` in the clothing category with SKU `DEMO-CLT-003`.
- Each product includes a description, INR price, availability, dimensions, tags, and a persistent image URL.

2. Variants
- Adds colour and size options to both products with different prices, SKUs, stock quantities, and image overrides.

3. Duplicate and safety rules
- Inserts only when the demo SKU does not already exist.
- Does not change or delete any existing product, order, or customer data.
- Demo products remain identifiable by the `DEMO-` SKU prefix.
*/

INSERT INTO products (name, description, price, sale_price, category, images, dimensions, tags, in_stock, stock_quantity, sku, is_published, is_archived, sort_order)
SELECT
  'Cable Knit Cap',
  'A soft, warm cap with a classic textured knit pattern for cool-weather days.',
  420,
  NULL,
  'clothing',
  '["https://images.pexels.com/photos/1644947/pexels-photo-1644947.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]'::jsonb,
  '{"length":22,"width":20,"height":12}'::jsonb,
  '["winter","accessories","gift"]'::jsonb,
  true,
  12,
  'DEMO-CLT-002',
  true,
  false,
  20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DEMO-CLT-002');

INSERT INTO products (name, description, price, sale_price, category, images, dimensions, tags, in_stock, stock_quantity, sku, is_published, is_archived, sort_order)
SELECT
  'Winter Wrap',
  'A generously sized handmade wrap with a soft drape and timeless neutral styling.',
  680,
  620,
  'clothing',
  '["https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]'::jsonb,
  '{"length":180,"width":55,"height":2}'::jsonb,
  '["winter","wrap","gift"]'::jsonb,
  true,
  8,
  'DEMO-CLT-003',
  true,
  false,
  21
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DEMO-CLT-003');

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT
  p.id,
  'Colour',
  '["Cream","Charcoal","Rust"]'::jsonb,
  '{"Cream":420,"Charcoal":440,"Rust":440}'::jsonb,
  '{}'::jsonb,
  '{"Cream":"https://images.pexels.com/photos/7156841/pexels-photo-7156841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Charcoal":"https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Rust":"https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Cream":"DEMO-CLT-002-CREAM","Charcoal":"DEMO-CLT-002-CHARCOAL","Rust":"DEMO-CLT-002-RUST"}'::jsonb,
  '{"Cream":5,"Charcoal":0,"Rust":3}'::jsonb,
  '{"Cream":true,"Charcoal":false,"Rust":true}'::jsonb,
  0
FROM products p
WHERE p.sku = 'DEMO-CLT-002'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.name = 'Colour');

INSERT INTO product_variants (product_id, name, options, option_prices, option_sale_prices, option_images, option_skus, option_stock, option_available, sort_order)
SELECT
  p.id,
  'Colour',
  '["Cream","Burgundy","Forest Green"]'::jsonb,
  '{"Cream":680,"Burgundy":720,"Forest Green":720}'::jsonb,
  '{"Cream":620}'::jsonb,
  '{"Cream":"https://images.pexels.com/photos/7156841/pexels-photo-7156841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Burgundy":"https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Forest Green":"https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  '{"Cream":"DEMO-CLT-003-CREAM","Burgundy":"DEMO-CLT-003-BURGUNDY","Forest Green":"DEMO-CLT-003-GREEN"}'::jsonb,
  '{"Cream":3,"Burgundy":2,"Forest Green":2}'::jsonb,
  '{"Cream":true,"Burgundy":true,"Forest Green":true}'::jsonb,
  0
FROM products p
WHERE p.sku = 'DEMO-CLT-003'
  AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.name = 'Colour');
