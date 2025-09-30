"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProductsResponse } from "@/types";
import { servicesApi } from "@/services";
import { ProductCard } from "@/components";

export default function BrandDetailPage() {
  const { id } = useParams(); 
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const fetchBrandDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data: ProductsResponse = await servicesApi.getProductsByBrand(String(id));
      setBrandProducts(data.data);
    } catch (err) {
      console.log("🚀 ~ fetchBrandDetails ~ err:", err);
      setError("Failed to load brand products.");
    } finally {
      setLoading(false);
    }
  },[id])

  // Run fetch on mount
  useEffect(() => {
    fetchBrandDetails();
  }, [fetchBrandDetails]);

  // Loading state UI
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error or empty state UI
  if (error || !brandProducts.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error || "Brand not found"}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Responsive grid for products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {brandProducts.map((product) => (
          <ProductCard key={product._id} product={product} viewMode="grid" />
        ))}
      </div>
    </section>
  );
}
