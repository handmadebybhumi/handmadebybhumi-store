import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ProductCard from "../catalog/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function RelatedProducts({ currentProductId, category, recommendedProductIds }) {
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date'),
    initialData: [],
  });

  // First try to show recommended products if specified
  let relatedProducts = [];
  
  if (recommendedProductIds && recommendedProductIds.length > 0) {
    relatedProducts = allProducts.filter(product => 
      recommendedProductIds.includes(product.id) && 
      product.id !== currentProductId &&
      product.in_stock
    ).slice(0, 5);
  }
  
  // If no recommended products or less than 3, fill with category-based products
  if (relatedProducts.length < 3) {
    const categoryProducts = allProducts.filter(product => 
      product.id !== currentProductId && 
      product.category === category &&
      product.in_stock &&
      !recommendedProductIds?.includes(product.id)
    );
    
    const needed = 5 - relatedProducts.length;
    relatedProducts = [...relatedProducts, ...categoryProducts.slice(0, needed)];
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-[#8B6F47] mb-6">You May Also Like</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}