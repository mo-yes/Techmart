"use client";
import { useState, useEffect} from "react";
import Image from "next/image";
import { useParams, } from "next/navigation";
import { Product} from "@/interfaces";
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
    const [error, setError] = useState(null);
    const { handleAddToCart } = useCartContext();

    const [isLoading, setIsLoading] = useState(false)

    async function fetchBrandDetails(){
    setLoading(true)
    const data:ProductsResponse = await servicesApi.getProductsByBrand( String(id))
    setLoading(false)
    setBrandProducts(data.data)
    };

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

    if (error || !brandProducts) {
    return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center">
        <p className="text-red-500 mb-4">{error || "Brand not found"}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
        </div>
    );
    }

    return (
    <section className="container mx-auto px-4 py-10">
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10 bg-gray-50 p-5 rounded-xl">
        {/* Example: Replace with actual brand logo and info if available */}
        <div className="w-30 h-30 bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden shadow-md">
          {/* Placeholder: Could use a brand logo if available */}
          <span className="text-3xl font-bold text-black uppercase">
            {brandProducts[0]?.brand?.name || "B"}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            { brandProducts[0]?.brand?.name || "Brand Name"}
          </h1>
          {brandProducts[0]?.brand?.slug && (
            <p className="mt-2 text-gray-600 max-w-2xl">
              {"Discover Amazing Products From =>  "+ brandProducts[0].brand.slug.toLocaleUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          gap-8
        "
        aria-label="Brand Products"
      >
        {brandProducts.map((product) => (
          <article
            key={product._id}
            className="
              group
              bg-white 
              rounded-2xl 
              shadow-sm 
              hover:shadow-lg 
              transition-shadow 
              border 
              border-gray-100 
              flex flex-col
              h-full
              focus-within:ring-2
              focus-within:ring-blue-500
              outline-none
            "
            tabIndex={0}
            aria-labelledby={`product-title-${product._id}`}
          >
            {/* Product Image */}
            <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden bg-gray-50">
              <Image
                src={product.images[0]}
                alt={product.description}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col p-4">
              <h2
                id={`product-title-${product._id}`}
                className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate"
                title={product.description}
              >
                {product.description}
              </h2>
              <Link className=" cursor-pointer" href={`/products/${product.id}`} >
                <p className="text-sm text-gray-500 mt-1 truncate">
                {product.subcategory?.[0]?.name || "—"}
              </p>
              </Link>
              <p className="text-xl font-bold text-blue-600 mt-2" aria-label={`Price: $${product.price}`}>
                ${product.price}
              </p>
              {/* Actions */}
              <div className="flex items-center justify-center  mt-4">
              </div>
              <AddToCartButton 
    productQuantity={product.quantity} 
    handleAddToCart={() => handleAddToCart(product._id, setIsLoading)} 
/>
            </div>
          </article>
        ))}
      </div>
    </section>
    );
}
