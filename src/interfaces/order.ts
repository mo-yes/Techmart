
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

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface CartItem {
  _id: string;
  product: string;
  price: number;
  count: number;
}

export interface OrderData {
  _id: string;
  id: number;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
  user: string;
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethodType: string;
  shippingAddress: ShippingAddress;
  shippingPrice: number;
  taxPrice: number;
  totalOrderPrice: number;
  __v: number;
}
