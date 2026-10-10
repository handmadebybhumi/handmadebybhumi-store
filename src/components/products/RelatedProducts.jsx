import React from "react";
import { fetchProductsByCategory, fetchProductsByIds, fetchVariantsForProducts } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../catalog/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function RelatedProducts({ currentProductId, category, recommendedProductIds }) {
  // Fetch recommended products by their IDs
  const { data: recommended = [] } = useQuery({
    queryKey: ['recommended-products', recommendedProductIds],
    queryFn: () => fetchProductsByIds(recommendedProductIds || []),
    enabled: !!(recommendedProductIds && recommendedProductIds.length > 0),
  });

  // Fetch category-based products
  const { data: categoryProducts = [], isLoading } = useQuery({
    queryKey: ['category-products', category, currentProductId],
    queryFn: () => fetchProductsByCategory(category, currentProductId),
    enabled: !!category,
  });

  // Combine: recommended first, then fill with category products
  const recommendedFiltered = (recommended || []).filter(
    (p) => p.id !== currentProductId
  );

  let relatedProducts = recommendedFiltered.slice(0, 5);

  if (relatedProducts.length < 3) {
    const needed = 5 - relatedProducts.length;
    const recommendedIds = recommendedFiltered.map((p) => p.id);
    const fillers = (categoryProducts || [])
      .filter((p) => !recommendedIds.includes(p.id))
      .slice(0, needed);
    relatedProducts = [...relatedProducts, ...fillers];
  }

  // Fetch variants for the related products so ProductCard can show "From ₹" pricing
  const relatedIds = relatedProducts.map((p) => p.id);
  const { data: variantsMap = {} } = useQuery({
    queryKey: ['product-variants-batch', relatedIds],
    queryFn: () => fetchVariantsForProducts(relatedIds),
    enabled: relatedIds.length > 0,
  });

  const productsWithVariants = relatedProducts.map((p) => ({
    ...p,
    variations: variantsMap[p.id] || [],
  }));

  if (productsWithVariants.length === 0 && !isLoading) {
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
          {productsWithVariants.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
