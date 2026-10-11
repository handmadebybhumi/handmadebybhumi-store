/*
# Add demo products and new categories for catalog testing

## Purpose
Adds new categories (keychains, flowers, gifts) and demo products across all
categories for testing the storefront and admin workflows.

## Demo product identification
- All demo products use SKU prefix "DEMO-"
- All demo products are is_published = false (draft, not visible on storefront)
- All demo products have is_archived = false

## Removal
To remove all demo products later without affecting genuine products:
  DELETE FROM products WHERE sku LIKE 'DEMO-%';
This will not affect genuine products (which have NULL or non-DEMO SKUs) or
historical order items (which store price snapshots, not references).
*/

-- 1. Add new categories
INSERT INTO categories (name, label) VALUES
  ('keychains', 'Keychains & Charms'),
  ('flowers', 'Flowers & Accessories'),
  ('gifts', 'Gifts & Custom-Made')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert demo products (all unpublished/draft, SKU prefix DEMO-)
INSERT INTO products (id, name, description, price, sale_price, category, sku, images, dimensions, tags, in_stock, stock_quantity, is_published, is_archived, sort_order) VALUES

-- Bags category
(
  'd0000001-0000-0000-0000-000000000001',
  'Daisy Crossbody Bag',
  'A charming crossbody bag with daisy flower motifs. Lightweight and perfect for casual outings. Features an adjustable strap and a secure button closure.',
  750.00, null, 'bags', 'DEMO-BAG-001',
  '["https://images.pexels.com/photos/7177578/pexels-photo-7177578.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 20, "width": 15, "height": 5}'::jsonb,
  '["bag","crossbody","daisy","floral"]'::jsonb,
  true, 8, false, false, 0
),
(
  'd0000002-0000-0000-0000-000000000002',
  'Striped Market Bag',
  'A roomy reusable market bag with colorful stripes. Stretchy and durable, ideal for grocery runs or beach trips. Folds flat for easy storage.',
  450.00, 380.00, 'bags', 'DEMO-BAG-002',
  '["https://images.pexels.com/photos/6462892/pexels-photo-6462892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 35, "width": 30, "height": 0}'::jsonb,
  '["bag","market","striped","reusable"]'::jsonb,
  true, 12, false, false, 0
),
(
  'd0000003-0000-0000-0000-000000000003',
  'Mini Coin Purse',
  'A tiny zippered coin purse perfect for loose change, keys, or small accessories. Fits easily into any bag or pocket.',
  180.00, null, 'bags', 'DEMO-BAG-003',
  '["https://images.pexels.com/photos/7297165/pexels-photo-7297165.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 10, "width": 8, "height": 2}'::jsonb,
  '["purse","coin","mini","zipper"]'::jsonb,
  true, 20, false, false, 0
),

-- Flowers & Accessories category
(
  'd0000004-0000-0000-0000-000000000004',
  'Sunflower Brooch',
  'A cheerful sunflower brooch that brightens up any jacket, bag, or hat. Handcrafted with detailed petals and a centered button.',
  120.00, null, 'flowers', 'DEMO-FLW-001',
  '["https://images.pexels.com/photos/7467236/pexels-photo-7467236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 6, "width": 6, "height": 1}'::jsonb,
  '["flower","brooch","sunflower","pin"]'::jsonb,
  true, 15, false, false, 0
),
(
  'd0000005-0000-0000-0000-000000000005',
  'Rose Bouquet (3 stems)',
  'A lasting handmade rose bouquet that never wilts. Each set includes three roses in your choice of colour. Perfect for gifting or home decoration.',
  350.00, null, 'flowers', 'DEMO-FLW-002',
  '["https://images.pexels.com/photos/34967468/pexels-photo-34967468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 25, "width": 15, "height": 5}'::jsonb,
  '["flower","rose","bouquet","gift"]'::jsonb,
  true, 6, false, false, 0
),
(
  'd0000006-0000-0000-0000-000000000006',
  'Daisy Hair Clip Set',
  'A set of 3 daisy hair clips in pastel colours. Gentle grip that does not damage hair. Suitable for all ages.',
  150.00, null, 'flowers', 'DEMO-FLW-003',
  '["https://images.pexels.com/photos/1214202/pexels-photo-1214202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 5, "width": 5, "height": 1}'::jsonb,
  '["flower","daisy","hair","clip","set"]'::jsonb,
  true, 18, false, false, 0
),

-- Keychains & Charms category
(
  'd0000007-0000-0000-0000-000000000007',
  'Strawberry Keychain',
  'A cute strawberry keychain perfect for keys, bags, or backpacks. Detailed leaves and seeds give it a lifelike look.',
  90.00, null, 'keychains', 'DEMO-KEY-001',
  '["https://images.pexels.com/photos/1212048/pexels-photo-1212048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 6, "width": 4, "height": 3}'::jsonb,
  '["keychain","strawberry","cute","charm"]'::jsonb,
  true, 25, false, false, 0
),
(
  'd0000008-0000-0000-0000-000000000008',
  'Mini Owl Charm',
  'An adorable mini owl charm with big round eyes. Attach to keys, zipper pulls, or use as a bag decoration.',
  110.00, null, 'keychains', 'DEMO-KEY-002',
  '["https://images.pexels.com/photos/37602721/pexels-photo-37602721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 5, "width": 4, "height": 4}'::jsonb,
  '["keychain","owl","charm","mini"]'::jsonb,
  true, 15, false, false, 0
),
(
  'd0000009-0000-0000-0000-000000000009',
  'Heart Keychain Set (3 pcs)',
  'A set of 3 heart-shaped keychains in red, pink, and cream. Great as party favours, small gifts, or stocking stuffers.',
  200.00, null, 'keychains', 'DEMO-KEY-003',
  '["https://images.pexels.com/photos/14852082/pexels-photo-14852082.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 5, "width": 5, "height": 2}'::jsonb,
  '["keychain","heart","set","gift","favour"]'::jsonb,
  true, 10, false, false, 0
),

-- Home Decor category
(
  'd0000010-0000-0000-0000-000000000010',
  'Storage Basket (Medium)',
  'A sturdy round storage basket perfect for organizing yarn, toiletries, or household items. Holds its shape well and has built-in handles.',
  550.00, null, 'home_decor', 'DEMO-HOM-001',
  '["https://images.pexels.com/photos/13083077/pexels-photo-13083077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 20, "width": 20, "height": 18}'::jsonb,
  '["basket","storage","home","organizer"]'::jsonb,
  true, 7, false, false, 0
),
(
  'd0000011-0000-0000-0000-000000000011',
  'Dream Catcher Wall Hanging',
  'A boho-style dream catcher with delicate webbing and feathered tails. Adds a cozy, handmade touch to any wall.',
  400.00, null, 'home_decor', 'DEMO-HOM-002',
  '["https://images.pexels.com/photos/31352326/pexels-photo-31352326.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 25, "width": 25, "height": 40}'::jsonb,
  '["dreamcatcher","wall","hanging","boho","decor"]'::jsonb,
  true, 5, false, false, 0
),
(
  'd0000012-0000-0000-0000-000000000012',
  'Cushion Cover (Square)',
  'A textured square cushion cover with a woven pattern. Fits a 16-inch insert (not included). Removable with button closure.',
  320.00, null, 'home_decor', 'DEMO-HOM-003',
  '["https://images.pexels.com/photos/9290601/pexels-photo-9290601.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 40, "width": 40, "height": 2}'::jsonb,
  '["cushion","cover","pillow","home","decor"]'::jsonb,
  true, 9, false, false, 0
),

-- Wearables / Accessories / Clothing category
(
  'd0000013-0000-0000-0000-000000000013',
  'Infinity Scarf',
  'A warm and soft infinity scarf that wraps comfortably around the neck. No loose ends to worry about. Perfect for winter layering.',
  380.00, null, 'clothing', 'DEMO-WBL-001',
  '["https://images.pexels.com/photos/8219320/pexels-photo-8219320.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 150, "width": 20, "height": 1}'::jsonb,
  '["scarf","infinity","winter","wearable"]'::jsonb,
  true, 10, false, false, 0
),
(
  'd0000014-0000-0000-0000-000000000014',
  'Ear Warmer Headband',
  'A thick ear warmer headband that keeps ears cozy without messing up your hair. Stretchy and comfortable for all-day wear.',
  220.00, null, 'accessories', 'DEMO-WBL-002',
  '["https://images.pexels.com/photos/6723884/pexels-photo-6723884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 50, "width": 10, "height": 2}'::jsonb,
  '["headband","ear warmer","winter","accessory"]'::jsonb,
  true, 14, false, false, 0
),
(
  'd0000015-0000-0000-0000-000000000015',
  'Fingerless Gloves',
  'Fingerless gloves that keep hands warm while leaving fingertips free for texting, crafting, or typing. Ribbed cuff for a snug fit.',
  280.00, null, 'accessories', 'DEMO-WBL-003',
  '["https://images.pexels.com/photos/29981496/pexels-photo-29981496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 22, "width": 10, "height": 1}'::jsonb,
  '["gloves","fingerless","winter","accessory"]'::jsonb,
  true, 11, false, false, 0
),

-- Toys category
(
  'd0000016-0000-0000-0000-000000000016',
  'Bunny Amigurumi',
  'A soft and cuddly bunny amigurumi toy. Safe for babies and toddlers — no small parts. Makes a wonderful Easter or birthday gift.',
  500.00, null, 'toys', 'DEMO-TOY-001',
  '["https://images.pexels.com/photos/12109904/pexels-photo-12109904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 20, "width": 12, "height": 15}'::jsonb,
  '["toy","amigurumi","bunny","baby","gift"]'::jsonb,
  true, 6, false, false, 0
),
(
  'd0000017-0000-0000-0000-000000000017',
  'Whale Plushie',
  'A friendly whale plushie with a smiling face and a fluffy belly. Perfect as a nursery decoration or a child''s companion.',
  420.00, null, 'toys', 'DEMO-TOY-002',
  '["https://images.pexels.com/photos/7738663/pexels-photo-7738663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 22, "width": 15, "height": 12}'::jsonb,
  '["toy","whale","plushie","nursery","baby"]'::jsonb,
  true, 8, false, false, 0
),

-- Gifts & Custom-Made category
(
  'd0000018-0000-0000-0000-000000000018',
  'Personalized Name Keychain',
  'A custom keychain made with any name or word of your choice. Choose your colours and font style. Perfect as a personalized gift.',
  150.00, null, 'gifts', 'DEMO-GFT-001',
  '["https://images.pexels.com/photos/3631685/pexels-photo-3631685.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 8, "width": 4, "height": 1}'::jsonb,
  '["keychain","custom","personalized","name","gift"]'::jsonb,
  true, null, false, false, 0
),
(
  'd0000019-0000-0000-0000-000000000019',
  'Gift Hamper (Assorted)',
  'A curated gift hamper with a selection of small handmade items — keychain, coaster, and flower brooch. Colours and items vary by availability. Wrapped in a gift box.',
  650.00, null, 'gifts', 'DEMO-GFT-002',
  '["https://images.pexels.com/photos/4841374/pexels-photo-4841374.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 25, "width": 20, "height": 15}'::jsonb,
  '["gift","hamper","assorted","box","set"]'::jsonb,
  true, 4, false, false, 0
),
(
  'd0000020-0000-0000-0000-000000000020',
  'Custom Couple Keychain Set',
  'A set of two interlocking heart keychains, one for each person. Choose matching or contrasting colours. A thoughtful anniversary or friendship gift.',
  250.00, null, 'gifts', 'DEMO-GFT-003',
  '["https://images.pexels.com/photos/10673679/pexels-photo-10673679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
  '{"length": 6, "width": 5, "height": 2}'::jsonb,
  '["keychain","couple","heart","custom","gift","set"]'::jsonb,
  true, 10, false, false, 0
);
