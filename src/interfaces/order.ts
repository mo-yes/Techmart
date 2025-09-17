export interface CartItem {
  _id: string;
  product: string;
  price: number;
  count: number;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface Order {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  user: string;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: string;      
  quantity: number;
  price: number;
  _id: string;
}

export interface Order {
  _id: string;
  id: number;
  cartItems: CartItem[];
  user: string;
  shippingAddress: ShippingAddress;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  totalOrderPrice: number;
  shippingPrice: number;
  taxPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderResponse {
  status: "success" | "fail";
  data: Order;
}
