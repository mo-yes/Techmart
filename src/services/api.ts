import {
  AddressesResponse,
  AddressResponse,
  AddToCartResponse,
  CartProduct,
  ClearCartResponse,
  CreateOrderResponse,
  FetchWishlistResponse,
  Product,
  RemoveCartResponse,
  ShippingAddress,
  ToggleWishlistResponse,
  UpdateCartResponse,
} from "@/interfaces";
import { getUserToken } from "@/lib/server-utils";

import {
  BrandsResponse,
  CategoriesResponse,
  ProductsResponse,
  SingleCategoryResponse,
  SingleProductResponse,
} from "@/types";

class ServicesApi {
  #baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  async #getHeaders(): Promise<Record<string, string>> {
  const token = await getUserToken();
  return {
    "Content-Type": "application/json",
    token: token ? String(token) : "",
  };
}

  /* Products */
  async getAllProducts(): Promise<ProductsResponse> {
    return await fetch(this.#baseUrl + "api/v1/products").then((res) =>
      res.json()
    );
  }

  async getProductDetails(id: string): Promise<SingleProductResponse> {
    return await fetch(this.#baseUrl + "api/v1/products/" + id).then((res) =>
      res.json()
    );
  }

  async addProductToCart(productId: string): Promise<AddToCartResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers,
    }).then((res) => res.json());
  }

  async removeCartProduct(productId: string): Promise<RemoveCartResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
      headers,
      method: "DELETE",
    }).then((res) => res.json());
  }

  async clearCart(): Promise<ClearCartResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/cart/", {
      headers,
      method: "DELETE",
    }).then((res) => res.json());
  }

  async updateCount(
    productId: string,
    count: number
  ): Promise<UpdateCartResponse> {
    try {
      const headers = await this.#getHeaders();
      const res = await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
        method: "PUT",
        body: JSON.stringify({ count }),
        headers,
      });

      const response: {
        status: "success" | "error";
        data?: { products: CartProduct<Product>[] };
        product?: CartProduct<Product>;
        error?: { statusMsg: string; message: string };
      } = await res.json();

      if (response.status === "success") {
        if (response.product) {
          return { status: "success", product: response.product };
        }

        if (response.data?.products) {
          const updatedProduct = response.data.products.find(
            (p) => p.product._id === productId
          );
          if (updatedProduct) {
            return { status: "success", product: updatedProduct };
          }
        }

        return {
          status: "error",
          error: {
            statusMsg: "fail",
            message: "Product not found in response",
          },
        };
      }

      return {
        status: "error",
        error: response.error ?? { statusMsg: "fail", message: "Unknown error" },
      };
    } catch (err) {
      return {
        status: "error",
        error: { statusMsg: "fail", message: (err as Error).message },
      };
    }
  }

  /* Brands */
  async getAllBrands(): Promise<BrandsResponse> {
    return await fetch(this.#baseUrl + "api/v1/brands").then((res) =>
      res.json()
    );
  }

  async getBrandDetails(id: string): Promise<BrandsResponse> {
    return await fetch(this.#baseUrl + "api/v1/brands/" + id).then((res) =>
      res.json()
    );
  }

  async getProductsByBrand(brandId: string): Promise<ProductsResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/products?brand=" + brandId
    ).then((res) => res.json());
  }

  /* Categories */
  async getAllCategories(): Promise<CategoriesResponse> {
    return await fetch(this.#baseUrl + "api/v1/categories").then((res) =>res.json());
  }

  async getCategorieDetails(id: string): Promise<SingleCategoryResponse> {
    return await fetch(this.#baseUrl + "api/v1/categories/" + id).then((res) =>res.json());
  }

/* Wishlist */
async addToWishlist(productId: string): Promise<ToggleWishlistResponse> {
  const headers = await this.#getHeaders();
  return await fetch(this.#baseUrl + "api/v1/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
    headers,
  }).then((res) => res.json());
}

async removeWishlist(id: string): Promise<ToggleWishlistResponse> {
  const headers = await this.#getHeaders();
  return await fetch(this.#baseUrl + "api/v1/wishlist/" + id, {
    method: "DELETE",
    headers,
  }).then((res) => res.json());
}

async getUserWishlist(): Promise<FetchWishlistResponse> {
  const headers = await this.#getHeaders();
  return await fetch(this.#baseUrl + "api/v1/wishlist", {
    headers,
  }).then((res) => res.json());
}

  /* Addresses */
  async addAddresses(data: {
    name: string;
    details: string;
    phone: string;
    city: string;
  }): Promise<AddressesResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/addresses", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
    }).then((res) => res.json());
  }

  async getAddresses(): Promise<AddressesResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/addresses", {
      method: "GET",
      headers,
    }).then((res) => res.json());
  }

  async removeAddress(id: string): Promise<AddressesResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + `api/v1/addresses/${id}`, {
      method: "DELETE",
      headers,
    }).then((res) => res.json());
  }

  async getSpecificAddress(id: string): Promise<AddressResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + `api/v1/addresses/${id}`, {
      method: "GET",
      headers,
    }).then((res) => res.json());
  }

  /* Orders */
  async createCashOrder(cartId: string, shippingAddress: ShippingAddress) {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/orders/" + cartId, {
      method: "POST",
      headers,
      body: JSON.stringify({ shippingAddress }),
    }).then((res) => res.json());
  }

  async createOnlineOrder(
    cartId: string,
    shippingAddress: ShippingAddress,
    redirectUrl: string = "http://localhost:3000"
  ) {
    const headers = await this.#getHeaders();
    return await fetch(
      this.#baseUrl +
        "api/v1/orders/checkout-session/" +
        cartId +
        `?url=${redirectUrl}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ shippingAddress }),
      }
    ).then((res) => res.json());
  }

  async getOrderById(orderId: string): Promise<CreateOrderResponse> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/orders/" + orderId, {
      headers,
    }).then((res) => res.json());
  }

  async getUserOrders(userId: string): Promise<ShippingAddress> {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/orders/user/" + userId, {
      headers,
    }).then((res) => res.json());
  }

  /* Auth */
  async login(email: string, password: string) {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/auth/signin", {
      body: JSON.stringify({ email, password }),
      headers,
      method: "POST",
    }).then((res) => res.json());
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
  }) {
    const headers = await this.#getHeaders();
    return await fetch(this.#baseUrl + "api/v1/auth/signup", {
      body: JSON.stringify(data),
      headers,
      method: "POST",
    }).then((res) => res.json());
  }
}

export const servicesApi = new ServicesApi();
