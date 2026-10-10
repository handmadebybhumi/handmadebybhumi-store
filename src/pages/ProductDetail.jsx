import React, { useState, useEffect } from "react";
import { fetchProductById, fetchVariantsByProductId, fetchProductsByCategory, fetchProductsByIds } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ShoppingCart, Ruler, Package, Plus, Minus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

import ReviewSection from "../components/reviews/ReviewSection";
import RelatedProducts from "../components/products/RelatedProducts";

export default function ProductDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [customizationPreference, setCustomizationPreference] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId
  });

  const { data: variants = [] } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: () => fetchVariantsByProductId(productId),
    enabled: !!productId
  });

  useEffect(() => {
    if (variants && variants.length > 0) {
      const initial = {};
      variants.forEach(variation => {
        if (variation.options && variation.options.length > 0) {
          initial[variation.name] = variation.options[0];
        }
      });
      setSelectedVariations(initial);
    } else {
      setSelectedVariations({});
    }
  }, [variants]);

  // Determine the selected variant's image (if any variant overrides images)
  const selectedVariantImage = variations
    .map(variation => variation.option_images?.[selectedVariations[variation.name]])
    .find(Boolean);

  // Determine the selected variant's SKU (if any variant overrides SKUs)
  const selectedVariantSku = (() => {
    let sku = product.sku || '';
    for (const variation of variations) {
      const optionSku = variation.option_skus?.[selectedVariations[variation.name]];
      if (optionSku) sku = optionSku;
    }
    return sku || '';
  })();

  // Check stock availability for the currently selected variant options
  const isVariantInStock = (() => {
    if (!product.in_stock) return false;
    for (const variation of variations) {
      const selectedOption = selectedVariations[variation.name];
      if (selectedOption && variation.option_stock) {
        const optionStock = variation.option_stock[selectedOption];
        if (typeof optionStock === 'number' && optionStock === 0) return false;
      }
    }
    return true;
  })();

  const addToCart = () => {
    if (!isVariantInStock) return;

    // Use variant-specific image if available, falling back to product images
    const itemImages = selectedVariantImage
      ? [selectedVariantImage, ...(product.images || []).filter(img => img !== selectedVariantImage)]
      : (product.images || []);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedPrice,
      images: itemImages,
      dimensions: product.dimensions,
      quantity: quantity,
      selectedVariations: selectedVariations,
      sku: selectedVariantSku,
      customization_preference: customizationPreference
    };
    
    const existingIndex = cart.findIndex(
      item => item.id === product.id && 
      JSON.stringify(item.selectedVariations) === JSON.stringify(selectedVariations) &&
      item.customization_preference === customizationPreference
    );
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    navigate(createPageUrl("Cart"));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Button onClick={() => navigate(createPageUrl("Home"))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];

  const variations = variants || [];

  // Photo belonging to the currently selected options (e.g. a specific colour)
  const variationImage = selectedVariantImage;

  const gallery = variationImage && !images.includes(variationImage)
    ? [variationImage, ...images]
    : images;

  const mainImage = selectedImage || gallery[0] || null;

  // Price belonging to the currently selected options, falling back to the base price
  let selectedPrice = parseFloat(product.price);
  variations.forEach(variation => {
    const optionPrice = variation.option_prices?.[selectedVariations[variation.name]];
    if (typeof optionPrice === 'number') {
      selectedPrice = optionPrice;
    }
  });

  // Show sale price if available and no variant override is active
  const hasVariantPriceOverride = variations.some(v => {
    const opt = v.option_prices?.[selectedVariations[v.name]];
    return typeof opt === 'number';
  });
  const displayPrice = (!hasVariantPriceOverride && product.sale_price) ? parseFloat(product.sale_price) : selectedPrice;

  const handleVariationSelect = (variationName, option) => {
    setSelectedVariations(prev => ({ ...prev, [variationName]: option }));
    setSelectedImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="mb-6 text-[#D97757] hover:text-[#C55E3F] hover:bg-[#FFF8F0]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] shadow-lg mb-4">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-32 h-32 text-[#D97757]/30" />
              </div>
            )}
            {!isVariantInStock && (
              <Badge className="absolute top-4 right-4 bg-gray-500 text-white">
                Out of Stock
              </Badge>
            )}
          </div>
          
          {/* Image Thumbnails */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === image 
                      ? 'border-[#D97757] shadow-md' 
                      : 'border-gray-200 hover:border-[#D97757]/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            {product.category && (
              <Badge className="mb-3 bg-[#D97757] text-white">
                {product.category.replace('_', ' ')}
              </Badge>
            )}
            <h1 className="text-4xl font-bold text-[#8B6F47] mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-[#D97757]">₹{displayPrice}</p>
              {!hasVariantPriceOverride && product.sale_price && (
                <span className="text-xl text-gray-400 line-through">₹{parseFloat(product.price)}</span>
              )}
            </div>
            {selectedVariantSku && (
              <p className="text-sm text-gray-500 mt-1">SKU: {selectedVariantSku}</p>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          )}

          {/* Dimensions */}
          {product.dimensions && (
            <Card className="mb-6 border-2 border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="w-5 h-5 text-[#D97757]" />
                  <h3 className="font-semibold text-gray-900">Dimensions</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-semibold text-gray-900">{product.dimensions.length} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Width</p>
                    <p className="font-semibold text-gray-900">{product.dimensions.width} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-semibold text-gray-900">{product.dimensions.height} cm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variations */}
          {variations.map((variation, index) => (
            <div key={index} className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {variation.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {variation.options?.map((option) => {
                  const optionStock = variation.option_stock?.[option];
                  const isOutOfStock = typeof optionStock === 'number' && optionStock === 0;
                  const isSelected = selectedVariations[variation.name] === option;
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? "default" : "outline"}
                      disabled={isOutOfStock}
                      onClick={() => handleVariationSelect(variation.name, option)}
                      className={
                        isSelected
                          ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white'
                          : isOutOfStock
                            ? 'border-2 border-gray-200 text-gray-300 cursor-not-allowed line-through'
                            : 'border-2 border-gray-200 hover:border-[#D97757] hover:bg-[#FFF8F0]'
                      }
                    >
                      {option}
                      {isOutOfStock && ' (Out)'}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Customization Preference */}
          <div className="mb-6">
            <Label htmlFor="customization" className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              Customization Preference (Optional)
              <Info className="w-4 h-4 text-gray-400" />
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              We'll try our best to follow your customization preferences!
            </p>
            <Textarea
              id="customization"
              value={customizationPreference}
              onChange={(e) => setCustomizationPreference(e.target.value)}
              placeholder="E.g., 'Please use darker shades' or 'Add a bow on top'"
              className="border-2 border-gray-200 focus:border-[#D97757]"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border-2 border-gray-200 hover:border-[#D97757]"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="border-2 border-gray-200 hover:border-[#D97757]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            onClick={addToCart}
            disabled={!isVariantInStock}
            className="w-full bg-[#D97757] hover:bg-[#C55E3F] text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isVariantInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={productId} />

      {/* Related Products */}
      {product.category && (
        <RelatedProducts 
          currentProductId={productId} 
          category={product.category}
          recommendedProductIds={product.recommended_product_ids}
        />
      )}
    </div>
  );
}
