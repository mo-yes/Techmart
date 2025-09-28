"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import { useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { useCartContext } from "@/Context/cartContext";
import { servicesApi } from "@/services";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

interface FetchWishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

interface ToggleWishlistResponse {
  status: string;
  message: string;
  data: string[]; 
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { handleAddToCart } = useCartContext();

  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res: FetchWishlistResponse = await servicesApi.getUserWishlist();
        if (res?.status === "success" && res.data) {
          setWishlistIds(res.data.map((p) => p._id));
        }
      } catch (err) {
        console.log("wishlist fetch error:", err);
      }
    }
    fetchWishlist();
  }, []);

  async function handleToggleWishlist(productId: string) {
    setAddingToWishlist(true);

    try {
      if (wishlistIds.includes(productId)) {
        const res: ToggleWishlistResponse = await servicesApi.removeWishlist(productId);
        toast.success(res.message);
        setWishlistIds(res.data);
      } else {
        const res: ToggleWishlistResponse = await servicesApi.addToWishlist(productId);
        toast.success(res.message);
        setWishlistIds(res.data);
      }
    } catch (err) {
      console.log("wishlist toggle error:", err);
    }

    setAddingToWishlist(false);
  }

  const isInWishlist = wishlistIds.includes(product._id);

  // ----- LIST MODE -----
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/products/${product._id}`}
                className="hover:text-primary transition-colors"
              >
                {product.title}
              </Link>
            </h3>

            <Button
              onClick={() => handleToggleWishlist(product._id)}
              variant="ghost"
              size="sm"
              disabled={addingToWishlist}
            >
              {addingToWishlist ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  fill={isInWishlist ? "currentColor" : "none"}
                  className={`h-4 w-4 ${
                    isInWishlist ? "text-red-500" : "text-gray-400"
                  }`}
                />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Brand:{" "}
                  <Link
                    href={`/brands/${product.brand._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.brand.name}
                  </Link>
                </span>
                <span>
                  Category:{" "}
                  <Link
                    href={`/categories/${product.category._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </span>
              </div>
            </div>

            <div className=" w-auto">
              <AddToCartButton
                productQuantity={product.quantity}
                handleAddToCart={() =>
                  handleAddToCart!(product._id, setIsAddingToCart)
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- GRID MODE -----
  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="128px"
        />

        <Button
          onClick={() => handleToggleWishlist(product._id)}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/70"
          disabled={addingToWishlist}
        >
          {addingToWishlist ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              fill={isInWishlist ? "currentColor" : "none"}
              className={`h-5 w-5 ${
                isInWishlist ? "text-red-500" : "text-gray-400"
              }`}
            />
          )}
        </Button>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          <Link
            href={`/brands/${product.brand._id}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {product.brand.name}
          </Link>
        </p>
        <h3 className="font-semibold text-sm mb-2 line-clamp-1 hover:text-primary transition-colors">
          <Link href={`/products/${product._id}`}>{product.title}</Link>
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderStars(product.ratingsAverage)}</div>
          <span className="text-xs text-muted-foreground">
            ({product.ratingsQuantity})
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          <Link
            href={`/categories/${product.category._id}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {product.category.name}
          </Link>
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.sold} sold
          </span>
        </div>
      </div>

      <div className="p-4">
        <AddToCartButton
          productQuantity={product.quantity}
          handleAddToCart={() =>
            handleAddToCart!(product._id, setIsAddingToCart)
          }
        />
      </div>
    </div>
  );
}
