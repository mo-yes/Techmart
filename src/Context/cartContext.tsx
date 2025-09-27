"use client";
import { servicesApi } from "@/services";
import { getUserCart } from "@/services/cart.services";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import toast from "react-hot-toast";

type CartContextType = {
  cartCount: number;
  setCartCount: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  cartId: string | null;
  handleAddToCart: (
    productId: string,
    setIsAddingToCart: (val: boolean) => void
  ) => Promise<void>;
};

export const cartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const ctx = useContext(cartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within CartContextProvider");
  }
  return ctx;
}

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  async function getCart() {
    try {
      setIsLoading(true);
      const response = await getUserCart();
      setCartId(response.cartId);
      setCartCount(response.numOfCartItems);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddToCart(
    productId: string,
    setIsAddingToCart: (val: boolean) => void
  ) {
    setIsAddingToCart(true);
    const data = await servicesApi.addProductToCart(productId);

    setCartCount(data.numOfCartItems);
    setCartId(data.cartId);

    setIsAddingToCart(false);
    toast.success(data.message, {
      position: "bottom-right",
    });
  }

  useEffect(() => {
    getCart();
  }, []);

  return (
    <cartContext.Provider
      value={{ cartCount, setCartCount, isLoading, handleAddToCart, cartId }}
    >
      {children}
    </cartContext.Provider>
  );
}
