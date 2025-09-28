"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ProductsResponse } from "@/types";
import { servicesApi } from "@/services";
import AddToCartButton from "@/components/products/AddToCartButton";
import { useCartContext } from "@/Context/cartContext";
import Link from "next/link";

export default function BrandDetailPage() {
  const { id } = useParams();
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAddToCart } = useCartContext();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  async function fetchBrandDetails() {
    try {
      setLoading(true);
      const data: ProductsResponse = await servicesApi.getProductsByBrand(String(id));
      setBrandProducts(data.data);
    } catch (err) {
      setError("Failed to load brand products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrandDetails();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {brandProducts.map((product) => {
        

          return (
            <article key={product._id} className="bg-white rounded-2xl shadow-sm flex flex-col">
              <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden bg-gray-50">
                <Image
                  src={product.images[0]}
                  alt={product.description}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="flex-1 flex flex-col p-4">
                <h2 className="text-lg font-semibold">{product.description}</h2>
                <p className="text-sm text-gray-500">{product.subcategory?.[0]?.name || "—"}</p>
                <p className="text-xl font-bold text-blue-600 mt-2">${product.price}</p>
                <AddToCartButton
                  productQuantity={product.quantity}
                  handleAddToCart={() => handleAddToCart(product._id, setIsAddingToCart)}
                  isAddingToCart={isAddingToCart} // ✅ مهم
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
