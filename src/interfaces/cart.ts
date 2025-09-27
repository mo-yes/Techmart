import { Brand } from "./brand";
import { Category, Subcategory } from "./category";
import { Product } from "./product";


export interface AddToCartResponse {
    state:string,
    message:string,
    numOfCartItems:number,
    cartId:string,
    data:CartData<string>
};

export interface GetToCartResponse {
    state:string,
    message:string,
    numOfCartItems:number,
    cartId:string,
    data:CartData<InnerCartProduct>
};

export interface CartData <T>{
    _id: string;
    cartOwner: string;
    products: CartProduct<T>[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalCartPrice: number;
};

export interface CartProduct <T>{
    count: number;
    _id: string;
    product: T;
    price: number;
};

export interface InnerCartProduct {
    subcategory: Subcategory[];
    _id: string;
    title: string;
    quantity: number;
    imageCover: string;
    category: Category;
    brand: Brand;
    ratingsAverage: number;
    id: string;
};

export interface RemoveCartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data:CartData<string>
}

export interface ClearCartResponse {
  status: string;
}

// responses.ts
export interface FetchWishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface ToggleWishlistResponse {
  status: string;
  message: string;
  data: string[]; // just product IDs
}


export interface WishlistResponse{
  status:string,
  message:string,
  data:string | number
}

interface UpdateCartSuccess {
  status: "success";
  product: CartProduct<Product>;
}

interface UpdateCartError {
  status: "error";
  error: {
    statusMsg: string;
    message: string;
  };
}

export type UpdateCartResponse = UpdateCartSuccess | UpdateCartError;


