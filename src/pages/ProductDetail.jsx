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

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedPrice,
      images: product.images || [],
      dimensions: product.dimensions,
      quantity: quantity,
      selectedVariations: selectedVariations,
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
  const variationImage = variations
    .map(variation => variation.option_images?.[selectedVariations[variation.name]])
    .find(Boolean);

  const gallery = variationImage && !images.includes(variationImage)
    ? [variationImage, ...images]
    : images;

  const mainImage = selectedImage || gallery[0] || null;

  // Price belonging to the currently selected options, falling back to the base price
  let selectedPrice = product.price;
  variations.forEach(variation => {
    const optionPrice = variation.option_prices?.[selectedVariations[variation.name]];
    if (typeof optionPrice === 'number') {
      selectedPrice = optionPrice;
    }
  });

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
            {!product.in_stock && (
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
            <p className="text-4xl font-bold text-[#D97757]">₹{selectedPrice}</p>
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
                {variation.options?.map((option) => (
                  <Button
                    key={option}
                    variant={selectedVariations[variation.name] === option ? "default" : "outline"}
                    onClick={() => handleVariationSelect(variation.name, option)}
                    className={
                      selectedVariations[variation.name] === option
                        ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white'
                        : 'border-2 border-gray-200 hover:border-[#D97757] hover:bg-[#FFF8F0]'
                    }
                  >
                    {option}
                  </Button>
                ))}
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
            disabled={!product.in_stock}
            className="w-full bg-[#D97757] hover:bg-[#C55E3F] text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
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
