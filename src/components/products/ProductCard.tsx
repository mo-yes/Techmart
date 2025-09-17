"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import { useContext, useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { cartContext } from "@/Context/cartContext";
import { servicesApi } from "@/services";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}
interface WishlistItem {
  _id: string;
}
interface WishlistResponse {
  status: string;
  message: string;
  data: WishlistItem[];
}
export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { handleAddToCart } = useContext(cartContext);

  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // جلب wishlist عند أول تحميل للكومبوننت
  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res:WishlistResponse = await servicesApi.getUserWishlist();
        if (res?.status === "success" && res.data) {
          const ids = res.data.map((p: WishlistItem) => p._id);
          setWishlistIds(ids);
        }
      } catch (err) {
        console.log("wishlist fetch error:", err);
      }
    }
    fetchWishlist();
  }, []);

  // toggle wishlist
async function handleToggleWishlist(productId: string) {
  setAddingToWishlist(true);

  try {
    if (wishlistIds.includes(productId)) {
      // المنتج موجود → نقدر نحذفه
      // هنا لازم تستخدم ID اللي موجود في state
      const idToRemove = wishlistIds.find(id => id === productId);
      if (idToRemove) {
        const data = await servicesApi.removeWishlist(idToRemove);
        toast.success(data.message)
        console.log(data)
        setWishlistIds(prev => prev.filter(id => id !== idToRemove));
      }
    } else {
      // المنتج مش موجود → نضيفه
      const res = await servicesApi.addToWishlist(productId);
      console.log(res)
      toast.success(res.message)
      if (res?.data) {
        // استخدم الـ array اللي بيرجعه السيرفر لتحديث الـ state
        setWishlistIds(res.data);
      }
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

            <Button
              onClick={() => handleAddToCart!(product._id, setIsAddingToCart)}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Add to Cart
            </Button>
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
          isAddingToCart={isAddingToCart}
        />
      </div>
    </div>
  );
}
