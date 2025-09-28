import Image from "next/image";
import Link from "next/link";
import { Brand, Category, Product} from "@/interfaces";
import { Button } from "@/components/ui/button";
import {  Heart,} from "lucide-react";

interface CategorieCardProps {
  category: Category;
  viewMode?: "grid" | "list";
}

export function CategoriesCart({ category, viewMode = "grid" }: CategorieCardProps) {



  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={category.image || "/placeholder.png"}
            alt={category.name}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/categories/${category._id}`}
                className="hover:text-primary transition-colors"
              >
                {category.name.toLocaleUpperCase()}
              </Link>
            </h3>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  <Link
                    href={`/brands/${category._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {"Discover products from " + category.name.toLocaleUpperCase()}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
        {/*Cart */}
        <div className="">
          {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={category.image || "/placeholder.png"}
          alt={category.name || "Category image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="128px"
        />

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Brand Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm text-center mb-2 line-clamp-1 hover:text-primary transition-colors">
          <Link href={`categories/${category._id}`}>{category.name}</Link>
        </h3>

        {/* Category */}
        <p className="text-xs text-muted-foreground mb-2 text-center">
          <Link
            href={`/categories/${category._id}`}
            className="hover:text-primary hover:underline transition-colors text-center"
          >
            {"Discover products from " + category.name.toLocaleUpperCase()}
          </Link>
        </p>
      </div>
        </div>
    </div>
  );
}
