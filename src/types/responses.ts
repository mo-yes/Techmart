import { Product, Brand, Category, ApiResponse, CartData, Subcategory } from '@/interfaces';

export type ProductsResponse = ApiResponse<Product>;
export type BrandsResponse = ApiResponse<Brand>;
export type CategoriesResponse = ApiResponse<Category>;
export type SubcategoriesResponse = ApiResponse<Subcategory>;

// Single item responses
export type SingleBrandResponse = {
  data: Brand;
}

export type SingleCategoryResponse = {
  data: Category;
}

export type SingleSubcategoryResponse = {
  data: Subcategory;
}

export type SingleProductResponse = {
  data: Product;
}


export type AddToCartResponse = {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData<Product>;
};