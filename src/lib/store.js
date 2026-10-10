import { supabase } from '@/lib/supabaseClient';

// ─── Products ───────────────────────────────────────────────────────────────

export async function fetchProducts({ search = '', category = 'all' } = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .limit(100);

  if (search && search.trim()) {
    const term = search.trim();
    // Use ilike for case-insensitive search on name and description
    query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  } else if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchProductsByCategory(category, excludeId = null) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .eq('is_archived', false)
    .eq('category', category)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(10);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_published', true)
    .eq('is_archived', false)
    .in('id', ids)
    .eq('in_stock', true)
    .limit(5);
  if (error) throw error;
  return data || [];
}

// ─── Product Variants ───────────────────────────────────────────────────────

export async function fetchVariantsByProductId(productId) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

// Fetch variants for multiple products in one call
export async function fetchVariantsForProducts(productIds) {
  if (!productIds || productIds.length === 0) return {};
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  // Group by product_id
  const grouped = {};
  (data || []).forEach((v) => {
    if (!grouped[v.product_id]) grouped[v.product_id] = [];
    grouped[v.product_id].push(v);
  });
  return grouped;
}

// ─── Admin: Products ────────────────────────────────────────────────────────

export async function adminFetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminCreateProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: productData.name,
      description: productData.description || '',
      price: productData.price,
      sale_price: productData.sale_price || null,
      category: productData.category || 'accessories',
      images: productData.images || [],
      dimensions: productData.dimensions || {},
      tags: productData.tags || [],
      in_stock: productData.in_stock ?? true,
      stock_quantity: productData.stock_quantity ?? null,
      sku: productData.sku || '',
      is_published: productData.is_published ?? true,
      is_archived: productData.is_archived ?? false,
      sort_order: productData.sort_order || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminUpdateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: updates.name,
      description: updates.description || '',
      price: updates.price,
      sale_price: updates.sale_price || null,
      category: updates.category || 'accessories',
      images: updates.images || [],
      dimensions: updates.dimensions || {},
      tags: updates.tags || [],
      in_stock: updates.in_stock ?? true,
      stock_quantity: updates.stock_quantity ?? null,
      sku: updates.sku || '',
      is_published: updates.is_published,
      is_archived: updates.is_archived,
      sort_order: updates.sort_order || 0,
    })
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── Admin: Product Variants ────────────────────────────────────────────────

export async function adminFetchVariantsByProductId(productId) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function adminCreateVariant(variantData) {
  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: variantData.product_id,
      name: variantData.name,
      options: variantData.options || [],
      option_images: variantData.option_images || {},
      option_prices: variantData.option_prices || {},
      option_skus: variantData.option_skus || {},
      option_stock: variantData.option_stock || {},
      sort_order: variantData.sort_order || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminUpdateVariant(id, updates) {
  const { data, error } = await supabase
    .from('product_variants')
    .update({
      name: updates.name,
      options: updates.options || [],
      option_images: updates.option_images || {},
      option_prices: updates.option_prices || {},
      option_skus: updates.option_skus || {},
      option_stock: updates.option_stock || {},
      sort_order: updates.sort_order || 0,
    })
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminDeleteVariant(id) {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function adminDeleteVariantsByProductId(productId) {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('product_id', productId);
  if (error) throw error;
}

// ─── Categories ─────────────────────────────────────────────────────────────

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      customer_pincode: orderData.customer_pincode,
      customer_instagram: orderData.customer_instagram || '',
      delivery_address: orderData.delivery_address,
      customer_note: orderData.customer_note || '',
      subtotal: orderData.subtotal,
      packing_charge: orderData.packing_charge,
      delivery_charge: orderData.delivery_charge,
      total: orderData.total,
      status: 'pending',
      payment_status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createOrderItems(orderId, items) {
  const rows = items.map((item) => ({
    order_id: orderId,
    product_id: item.product_id || null,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
    variations: item.variations || {},
    dimensions: item.dimensions || {},
    customization_preference: item.customization_preference || '',
    line_total: item.price * item.quantity,
  }));

  const { data, error } = await supabase
    .from('order_items')
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

// ─── Reviews ────────────────────────────────────────────────────────────────

export async function fetchReviewsByProductId(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createReview(reviewData) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: reviewData.product_id,
      customer_name: reviewData.customer_name,
      customer_email: reviewData.customer_email,
      rating: reviewData.rating,
      review_text: reviewData.review_text || '',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Wishlist ───────────────────────────────────────────────────────────────

export async function createWishlistRequest(data) {
  const { data: result, error } = await supabase
    .from('wishlist_requests')
    .insert({
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      instagram_handle: data.instagram_handle || '',
      item_name: data.item_name,
      description: data.description || '',
    })
    .select()
    .single();
  if (error) throw error;
  return result;
}
