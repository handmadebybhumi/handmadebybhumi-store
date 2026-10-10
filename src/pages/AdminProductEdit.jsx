import React, { useState, useEffect } from 'react';
import {
  adminFetchProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminFetchVariantsByProductId,
  adminCreateVariant,
  adminUpdateVariant,
  adminDeleteVariant,
  fetchCategories,
} from '@/lib/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft, Save, Plus, Trash2, Package, X, GripVertical,
  Image as ImageIcon, AlertCircle, CheckCircle, Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  sale_price: '',
  category: 'accessories',
  images: [],
  dimensions: { length: '', width: '', height: '' },
  tags: [],
  in_stock: true,
  stock_quantity: '',
  sku: '',
  is_published: true,
  is_archived: false,
  sort_order: 0,
};

export default function AdminProductEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const isEditing = !!productId;

  const [formData, setFormData] = useState(EMPTY_PRODUCT);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [variants, setVariants] = useState([]);
  const [savedProductId, setSavedProductId] = useState(null);

  // Load product if editing
  const { data: product } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => adminFetchProductById(productId),
    enabled: !!productId,
  });

  // Load variants if editing
  const { data: existingVariants = [] } = useQuery({
    queryKey: ['admin-variants', productId],
    queryFn: () => adminFetchVariantsByProductId(productId),
    enabled: !!productId,
  });

  // Load categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        sale_price: product.sale_price?.toString() || '',
        category: product.category || 'accessories',
        images: product.images || [],
        dimensions: {
          length: product.dimensions?.length?.toString() || '',
          width: product.dimensions?.width?.toString() || '',
          height: product.dimensions?.height?.toString() || '',
        },
        tags: product.tags || [],
        in_stock: product.in_stock ?? true,
        stock_quantity: product.stock_quantity?.toString() || '',
        sku: product.sku || '',
        is_published: product.is_published ?? true,
        is_archived: product.is_archived ?? false,
        sort_order: product.sort_order || 0,
      });
    }
  }, [product]);

  useEffect(() => {
    if (existingVariants.length > 0) {
      setVariants(existingVariants.map((v) => ({
        id: v.id,
        name: v.name || '',
        options: v.options || [],
        option_prices: v.option_prices || {},
        option_images: v.option_images || {},
        option_skus: v.option_skus || {},
        option_stock: v.option_stock || {},
        sort_order: v.sort_order || 0,
        _optionsText: (v.options || []).join(', '),
      })));
    }
  }, [existingVariants]);

  // Auto-save variants after product is created/updated
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price: parseFloat(data.price) || 0,
        sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
        stock_quantity: data.stock_quantity ? parseInt(data.stock_quantity) : null,
        dimensions: {
          length: data.dimensions.length ? parseFloat(data.dimensions.length) : null,
          width: data.dimensions.width ? parseFloat(data.dimensions.width) : null,
          height: data.dimensions.height ? parseFloat(data.dimensions.height) : null,
        },
        sort_order: parseInt(data.sort_order) || 0,
      };

      let resultId;
      if (isEditing) {
        const result = await adminUpdateProduct(productId, payload);
        resultId = productId;
      } else {
        const result = await adminCreateProduct(payload);
        resultId = result.id;
      }

      // Save variants
      for (const variant of variants) {
        const variantPayload = {
          product_id: resultId,
          name: variant.name,
          options: variant._optionsText
            ? variant._optionsText.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          option_prices: variant.option_prices || {},
          option_images: variant.option_images || {},
          option_skus: variant.option_skus || {},
          option_stock: variant.option_stock || {},
          sort_order: variant.sort_order || 0,
        };

        if (variant.id) {
          await adminUpdateVariant(variant.id, variantPayload);
        } else if (variantPayload.name && variantPayload.options.length > 0) {
          await adminCreateVariant(variantPayload);
        }
      }

      return resultId;
    },
    onSuccess: (resultId) => {
      setSavedProductId(resultId);
      setSuccess(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin-variants', productId] });
      setTimeout(() => {
        navigate(createPageUrl('AdminProducts'));
      }, 1200);
    },
    onError: (err) => {
      setError(err.message || 'Failed to save product.');
      setSuccess(false);
    },
  });

  const handleField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDimension = (dim, value) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dim]: value },
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addImage = () => {
    const url = imageUrl.trim();
    if (url && !formData.images.includes(url)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
    setImageUrl('');
  };

  const removeImage = (url) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const moveImage = (index, dir) => {
    const newImages = [...formData.images];
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Variant management
  const addVariant = () => {
    setVariants((prev) => [...prev, {
      name: '',
      options: [],
      option_prices: {},
      option_images: {},
      option_skus: {},
      option_stock: {},
      sort_order: prev.length,
      _optionsText: '',
    }]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateVariantOptionField = (vIndex, option, fieldKey, value) => {
    setVariants((prev) => {
      const updated = [...prev];
      const variant = { ...updated[vIndex] };
      const fieldMap = {
        price: 'option_prices',
        image: 'option_images',
        sku: 'option_skus',
        stock: 'option_stock',
      };
      const key = fieldMap[fieldKey];
      variant[key] = { ...variant[key], [option]: value };
      updated[vIndex] = variant;
      return updated;
    });
  };

  const removeVariant = (index) => {
    setVariants((prev) => {
      const removed = prev[index];
      if (removed.id) {
        adminDeleteVariant(removed.id).catch(() => {});
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Parse options from comma-separated text into options array
  const getVariantOptions = (variant) => {
    return variant._optionsText
      ? variant._optionsText.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('A valid price is required.');
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl('AdminProducts'))}
        className="mb-4 text-[#D97757] hover:text-[#C55E3F] hover:bg-[#FFF8F0]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <h1 className="text-3xl font-bold text-[#8B6F47] mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Product saved successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#8B6F47]">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleField('name', e.target.value)}
                className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                placeholder="e.g., Crochet Teddy Bear"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleField('description', e.target.value)}
                className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                rows={4}
                placeholder="Describe your handmade item..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => handleField('category', val)}
                >
                  <SelectTrigger className="mt-1 border-2 border-gray-200 focus:border-[#D97757]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sku">SKU (Optional)</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleField('sku', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="e.g., HBB-TEDDY-001"
                />
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} className="bg-[#FFF8F0] text-[#8B6F47] border border-[#D97757]/30">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#8B6F47]">Pricing & Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (INR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => handleField('price', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="450"
                />
              </div>
              <div>
                <Label htmlFor="sale_price">Sale Price (Optional)</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sale_price}
                  onChange={(e) => handleField('sale_price', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="350"
                />
              </div>
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => handleField('stock_quantity', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="10"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dim_length">Length (cm)</Label>
                <Input
                  id="dim_length"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.length}
                  onChange={(e) => handleDimension('length', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="dim_width">Width (cm)</Label>
                <Input
                  id="dim_width"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimension('width', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="dim_height">Height (cm)</Label>
                <Input
                  id="dim_height"
                  type="number"
                  step="0.1"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimension('height', e.target.value)}
                  className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                  placeholder="25"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                checked={formData.in_stock}
                onCheckedChange={(checked) => handleField('in_stock', checked)}
              />
              <Label className="cursor-pointer">Available for purchase (In Stock)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#8B6F47]">Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImage();
                  }
                }}
                className="border-2 border-gray-200 focus:border-[#D97757]"
                placeholder="Paste image URL (https://...)"
              />
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6]">
                      <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    {index === 0 && (
                      <Badge className="absolute top-1 left-1 bg-[#D97757] text-white text-xs">Main</Badge>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === formData.images.length - 1}
                      >
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white hover:bg-red-500/50"
                        onClick={() => removeImage(url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No images yet. Add image URLs above.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Variants */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-[#8B6F47] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D97757]" />
                Product Variants
              </CardTitle>
              <Button type="button" variant="outline" onClick={addVariant} className="border-[#D97757] text-[#D97757] hover:bg-[#FFF8F0]">
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  No variants. The base price and images will be used for all options.
                  Add a variant (e.g., "Color") to offer different prices per option.
                </p>
              </div>
            ) : (
              variants.map((variant, vIndex) => {
                const options = getVariantOptions(variant);
                return (
                  <div key={vIndex} className="border-2 border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid md:grid-cols-2 gap-3">
                        <div>
                          <Label>Variant Name (e.g., Color, Size)</Label>
                          <Input
                            value={variant.name}
                            onChange={(e) => updateVariant(vIndex, 'name', e.target.value)}
                            className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                            placeholder="Color"
                          />
                        </div>
                        <div>
                          <Label>Options (comma-separated)</Label>
                          <Input
                            value={variant._optionsText}
                            onChange={(e) => updateVariant(vIndex, '_optionsText', e.target.value)}
                            className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                            placeholder="Brown, Cream, Pink"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(vIndex)}
                        className="text-gray-400 hover:text-red-600 mt-6"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {options.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Per-option overrides (leave blank to use base price/image):</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 font-medium text-gray-600">Option</th>
                                <th className="text-left py-2 px-2 font-medium text-gray-600">Price (INR)</th>
                                <th className="text-left py-2 px-2 font-medium text-gray-600">SKU</th>
                                <th className="text-left py-2 px-2 font-medium text-gray-600">Stock</th>
                                <th className="text-left py-2 px-2 font-medium text-gray-600">Image URL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {options.map((option) => (
                                <tr key={option} className="border-b border-gray-100">
                                  <td className="py-2 px-2 font-medium text-gray-800">{option}</td>
                                  <td className="py-2 px-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={variant.option_prices?.[option] || ''}
                                      onChange={(e) => updateVariantOptionField(vIndex, option, 'price', e.target.value)}
                                      className="h-8 border-gray-200 focus:border-[#D97757] w-24"
                                      placeholder="Base"
                                    />
                                  </td>
                                  <td className="py-2 px-2">
                                    <Input
                                      value={variant.option_skus?.[option] || ''}
                                      onChange={(e) => updateVariantOptionField(vIndex, option, 'sku', e.target.value)}
                                      className="h-8 border-gray-200 focus:border-[#D97757] w-28"
                                      placeholder="—"
                                    />
                                  </td>
                                  <td className="py-2 px-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      value={variant.option_stock?.[option] || ''}
                                      onChange={(e) => updateVariantOptionField(vIndex, option, 'stock', e.target.value)}
                                      className="h-8 border-gray-200 focus:border-[#D97757] w-20"
                                      placeholder="—"
                                    />
                                  </td>
                                  <td className="py-2 px-2">
                                    <Input
                                      value={variant.option_images?.[option] || ''}
                                      onChange={(e) => updateVariantOptionField(vIndex, option, 'image', e.target.value)}
                                      className="h-8 border-gray-200 focus:border-[#D97757] w-40"
                                      placeholder="Base image"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-[#8B6F47]">Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => handleField('is_published', checked)}
              />
              <Label className="cursor-pointer">
                Published {formData.is_published ? '(visible on storefront)' : '(hidden from storefront)'}
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_archived}
                onCheckedChange={(checked) => handleField('is_archived', checked)}
              />
              <Label className="cursor-pointer">
                Archived {formData.is_archived ? '(removed from store, not deletable)' : '(active)'}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(createPageUrl('AdminProducts'))}
            className="border-2 border-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-[#D97757] hover:bg-[#C55E3F] text-white px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
