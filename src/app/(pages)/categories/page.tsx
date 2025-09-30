"use client";
import { useState, useEffect } from "react";
import { Category} from "@/interfaces";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { CategoriesResponse} from "@/types";
import { cn } from "@/lib/utils";
import { servicesApi } from "@/services";
import { CategoriesCart } from "@/components/Categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  async function fetchCategories(){
    setLoading(true)
    const data: CategoriesResponse = await servicesApi.getAllCategories()
    setLoading(false)
    setCategories(data.data)
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <header className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          Discover amazing products from our collection
        </p>
      </div>

      <section className="flex items-center mb-10 justify-end p-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Products Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1"
        )}
      >
        {categories.map((categorie) => (
          <CategoriesCart
            key={categorie._id}
            category={categorie}
            viewMode={viewMode}
          />
        ))}
      </div>
    </header>
  ); 
}
