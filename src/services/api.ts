import { AddressesResponse, AddToCartResponse, ClearCartResponse, GetToCartResponse, Order, RemoveCartResponse, ShippingAddress, UpdateCartResponse, WishlistResponse } from "@/interfaces";
import {  BrandsResponse, CategoriesResponse, ProductsResponse, SingleProductResponse, } from "@/types"

class ServicesApi {
    #baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

    #getHeaders(){
        return {
                "Content-type" : "application/json",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjZjMDM0Y2E0NWFiOWY5MWEwOWIzMCIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU2ODA3MzIzLCJleHAiOjE3NjQ1ODMzMjN9.4ripjI_wZucGPLl9uDWDzgDZfYkwfy1lptydsiaHojs"
        }
    };
        /* Products */
    async getAllProducts(): Promise<ProductsResponse>{
    return await fetch(this.#baseUrl + "api/v1/products").then((res)=>res.json())
    };

    async getProductDetails(id:string):Promise<SingleProductResponse>{
    return await fetch(this.#baseUrl + "api/v1/products/" + id).then((res)=>res.json())
    };

    async addProductToCart(productId: string):Promise <AddToCartResponse> {
        return await fetch(this.#baseUrl + "api/v1/cart", {
            method: 'post',
            body: JSON.stringify({
                productId
            }),
            headers: this.#getHeaders()
        }).then((res)=>res.json())
    };

    async getCartProducts():Promise <GetToCartResponse>{
        return await fetch(this.#baseUrl + "api/v1/cart",{headers:this.#getHeaders()}).then((res)=>res.json())
    };

    async removeCartProduct(productId:string):Promise<RemoveCartResponse>{
        return await fetch(this.#baseUrl + "api/v1/cart/" +productId,{ headers:this.#getHeaders(),method: "delete"
            }).then((res)=>res.json())
    };

    async clearCart():Promise<ClearCartResponse>{
        return await fetch(this.#baseUrl + "api/v1/cart/",{ headers:this.#getHeaders(),method: "delete"
            }).then((res)=>res.json())
    };

    async updateCount(productId: string, count: number): Promise<UpdateCartResponse> {
    const response = await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
    method: "PUT",
    body: JSON.stringify({ count }),
    headers: this.#getHeaders(),
    }).then((res) => res.json());

    if (response.status === "success") {
    const updatedProduct = response.data.products.find(
      (p: any) => p.product._id === productId
    );
    return { status: "success", product: updatedProduct };
    }

    return { status: "error", error: response };
    };

    /* Brands */
    async getAllBrands(): Promise<BrandsResponse>{
    return await fetch(this.#baseUrl + "api/v1/brands").then((res)=>res.json())
    };

    async getBrandDetails(id:string):Promise<BrandsResponse>{
    return await fetch(this.#baseUrl + "api/v1/brands/" + id).then((res)=>res.json())
    };

    async getProductsByBrand(brandId: string): Promise<ProductsResponse> {
    return await fetch(this.#baseUrl + "api/v1/products?brand=" + brandId).then((res)=>res.json())
};

    /* Categories */

    async getAllCategories(): Promise<CategoriesResponse>{
    return await fetch(this.#baseUrl + "api/v1/categories").then((res)=>res.json())
    };

    async getCategorieDetails(id:string):Promise<CategoriesResponse>{
    return await fetch(this.#baseUrl + "api/v1/categories/" + id).then((res)=>res.json())
    };

    /* wishlist */
    async addToWishlist(productId: string):Promise <WishlistResponse> {
        return await fetch(this.#baseUrl + "api/v1/wishlist", {
            method: 'post',
            body: JSON.stringify({
                productId
            }),
            headers: this.#getHeaders()
        }).then((res)=>res.json())
    };

     async removeWishlist(id:string): Promise<WishlistResponse> {
        return await fetch(this.#baseUrl + "api/v1/wishlist/"+id, {method: 'delete',headers: this.#getHeaders()}).then((res)=>res.json())
    };
    
     async getUserWishlist(): Promise<WishlistResponse>{
        return await fetch(this.#baseUrl + "api/v1/wishlist",
            {headers: this.#getHeaders()}).then((res)=>res.json())
    };


    /* Addresses */
    async addAddresses(data: {
    name: string
    details: string
    phone: string
    city: string
}): Promise<AddressesResponse> {
    return await fetch(this.#baseUrl + "api/v1/addresses", {
    method: "POST",
    body: JSON.stringify(data),
    headers: this.#getHeaders(),
    }).then((res) => res.json())
}

    // GET all addresses
async getAddresses(): Promise<AddressesResponse> {
  return await fetch(this.#baseUrl + "api/v1/addresses", {
    method: "GET",
    headers: this.#getHeaders(),
  }).then(res => res.json());
}

// DELETE address by id (افترض أن السيرفر يتوقع id في URL)
async removeAddress(id: string): Promise<AddressesResponse> {
  return await fetch(this.#baseUrl + `api/v1/addresses/${id}`, {
    method: "DELETE",
    headers: this.#getHeaders(),
  }).then(res => res.json());
}

// Get specific address
async getSpecificAddress(id: string): Promise<AddressesResponse> {
  return await fetch(this.#baseUrl + `api/v1/addresses/${id}`, {
    method: "GET",
    headers: this.#getHeaders(),
  }).then(res => res.json());
}

// Orders
async createCashOrder(cartId: string, shippingAddress: ShippingAddress) {
  return await fetch(this.#baseUrl + "api/v1/orders/" + cartId, {
    method: "POST",
    headers: this.#getHeaders(),
    body: JSON.stringify({ shippingAddress }),
  }).then(res => res.json());
}

async createOnlineOrder(
  cartId: string,
  shippingAddress: ShippingAddress,
  redirectUrl: string = "http://localhost:3000"
) {
  return await fetch(
    this.#baseUrl +
      "api/v1/orders/checkout-session/" +
      cartId +
      `?url=${redirectUrl}`,
    {
      method: "POST",
      headers: this.#getHeaders(),
      body: JSON.stringify({ shippingAddress }),
    }
  ).then(res => res.json());
}

async getOrderById(orderId: string): Promise<{status: string; data: Order}> {
  return await fetch(this.#baseUrl + "api/v1/orders/" + orderId, {
    headers: this.#getHeaders(),
  }).then(res => res.json());
}

async getUserOrders(userId: string): Promise<ShippingAddress> {
  return await fetch(this.#baseUrl + "api/v1/orders/user/" + userId, {
    headers: this.#getHeaders(),
  }).then(res => res.json());
}


}

export const servicesApi = new ServicesApi()