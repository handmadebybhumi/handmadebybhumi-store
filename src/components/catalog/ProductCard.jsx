import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Ruler, Package } from "lucide-react";

export default function ProductCard({ product }) {
  // Cheapest price across the product's options, so the card matches what the detail page shows
  const optionPrices = (product.variations || []).flatMap(
    (variation) => Object.values(variation.option_prices || {})
  );
  const startingPrice = optionPrices.length > 0 ? Math.min(...optionPrices) : product.price;
  const showFromPrice = optionPrices.length > 0;
  const hasVariants = (product.variations || []).length > 0;

  const detailUrl = `${createPageUrl("ProductDetail")}?id=${product.id}`;

  const addToCart = (e) => {
    // If product has variants, redirect to detail page to choose options
    if (hasVariants) {
      e.preventDefault();
      window.location.href = detailUrl;
      return;
    }

    e.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        images: product.images || [],
        dimensions: product.dimensions,
        quantity: 1,
        selectedVariations: {},
        sku: product.sku || '',
        customization_preference: ""
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const maxDimension = Math.max(
    product.dimensions?.length || 0,
    product.dimensions?.width || 0,
    product.dimensions?.height || 0
  );

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Link to={detailUrl}>
      <Card className="group overflow-hidden border-2 border-transparent hover:border-[#D97757] transition-all duration-300 hover:shadow-xl bg-white">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6]">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-20 h-20 text-[#D97757]/30" />
            </div>
          )}
          {!product.in_stock && (
            <Badge className="absolute top-3 right-3 bg-gray-500">Out of Stock</Badge>
          )}
          {product.in_stock && (
            <Button
              size="sm"
              className="absolute bottom-3 right-3 bg-white text-[#D97757] hover:bg-[#D97757] hover:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
              onClick={addToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {hasVariants ? 'Choose' : 'Add'}
            </Button>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-[#D97757] transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className={`font-bold text-[#D97757] ${showFromPrice ? 'text-lg' : 'text-2xl'}`}>
              {showFromPrice ? `From ₹${startingPrice}` : `₹${product.price}`}
            </span>
            {product.dimensions && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Ruler className="w-3 h-3" />
                <span>{maxDimension}cm</span>
              </div>
            )}
          </div>
          {product.category && (
            <Badge variant="outline" className="mt-3 border-[#D97757] text-[#D97757]">
              {product.category.replace('_', ' ')}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}