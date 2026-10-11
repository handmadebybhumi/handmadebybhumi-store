/*
# Publish demo catalog and extend variant overrides

1. Product visibility
- Publishes only products whose SKU starts with `DEMO-`, so the existing demo catalog appears in the storefront.
- Genuine products are not modified by the visibility update.

2. Variant data
- Adds `option_sale_prices` to `product_variants` for optional sale prices per option.
- Adds `option_available` to `product_variants` for explicit per-option availability.
- Existing variant prices, stock, and relationships are preserved.

3. Demo variant content
- Adds variant SKUs and Pexels image overrides to selected demo variants.
- Uses persistent HTTPS image URLs already supported by the storefront and admin editor.

4. Removal and safety
- Demo products remain identifiable by the `DEMO-` SKU prefix.
- No orders, order items, genuine products, or genuine product images are deleted or overwritten.
*/

ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS option_sale_prices jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS option_available jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE products
SET is_published = true
WHERE sku LIKE 'DEMO-%'
  AND is_archived = false;

UPDATE product_variants
SET
  option_skus = '{"Cream":"DEMO-BAG-001-CREAM","Sage Green":"DEMO-BAG-001-SAGE","Dusty Pink":"DEMO-BAG-001-PINK"}'::jsonb,
  option_images = '{"Cream":"https://images.pexels.com/photos/7177578/pexels-photo-7177578.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Sage Green":"https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Dusty Pink":"https://images.pexels.com/photos/7297165/pexels-photo-7297165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb,
  option_sale_prices = '{"Dusty Pink":750}'::jsonb
WHERE product_id = 'd0000001-0000-0000-0000-000000000001'
  AND name = 'Colour';

UPDATE product_variants
SET
  option_skus = '{"Red":"DEMO-FLW-002-RED","Pink":"DEMO-FLW-002-PINK","White":"DEMO-FLW-002-WHITE","Yellow":"DEMO-FLW-002-YELLOW"}'::jsonb,
  option_images = '{"Red":"https://images.pexels.com/photos/14763992/pexels-photo-14763992.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Pink":"https://images.pexels.com/photos/34967468/pexels-photo-34967468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","White":"https://images.pexels.com/photos/1214202/pexels-photo-1214202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Yellow":"https://images.pexels.com/photos/7467236/pexels-photo-7467236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb
WHERE product_id = 'd0000005-0000-0000-0000-000000000005'
  AND name = 'Colour';

UPDATE product_variants
SET
  option_skus = '{"Small":"DEMO-HOM-001-S","Medium":"DEMO-HOM-001-M","Large":"DEMO-HOM-001-L"}'::jsonb,
  option_images = '{"Small":"https://images.pexels.com/photos/10557895/pexels-photo-10557895.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Medium":"https://images.pexels.com/photos/13083077/pexels-photo-13083077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Large":"https://images.pexels.com/photos/19515730/pexels-photo-19515730.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb
WHERE product_id = 'd0000010-0000-0000-0000-000000000010'
  AND name = 'Size';

UPDATE product_variants
SET
  option_skus = '{"Cream":"DEMO-WBL-001-CREAM","Charcoal":"DEMO-WBL-001-CHARCOAL","Burgundy":"DEMO-WBL-001-BURGUNDY","Forest Green":"DEMO-WBL-001-GREEN"}'::jsonb,
  option_images = '{"Cream":"https://images.pexels.com/photos/7156841/pexels-photo-7156841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Charcoal":"https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Burgundy":"https://images.pexels.com/photos/6463349/pexels-photo-6463349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940","Forest Green":"https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"}'::jsonb
WHERE product_id = 'd0000013-0000-0000-0000-000000000013'
  AND name = 'Colour';

UPDATE product_variants
SET
  option_skus = '{"Small/Medium":"DEMO-WBL-003-SM","Medium/Large":"DEMO-WBL-003-ML"}'::jsonb,
  option_available = '{"Small/Medium":true,"Medium/Large":true}'::jsonb
WHERE product_id = 'd0000015-0000-0000-0000-000000000015'
  AND name = 'Size';

UPDATE product_variants
SET option_available = '{"Cream":true,"Sage Green":true,"Dusty Pink":true}'::jsonb
WHERE product_id = 'd0000001-0000-0000-0000-000000000001'
  AND name = 'Colour';
