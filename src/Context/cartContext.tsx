"use client";
import { servicesApi } from "@/services";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

type CartContextType = {
  cartCount?: number;
  setCartCount?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  cartId?: string | null;
  handleAddToCart?: (
    productId: string,
    setIsAddingToCart: (val: boolean) => void
  ) => Promise<void>;
};


export const cartContext = createContext<CartContextType>({});

export default function CartContextProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [cartId, setCartId] = useState<string | null>(null)

    async function getCart() {
        setIsLoading(true);
        const response = await servicesApi.getCartProducts();
        
        setCartId(response.cartId)
        setIsLoading(false);
        
        setCartCount(response.numOfCartItems);
    };

    async function handleAddToCart(productId: string, setIsAddingToCart: boolean) {
        setIsAddingToCart(true);
        const data = await servicesApi.addProductToCart(productId);
        setCartCount(data.numOfCartItems);
        setIsAddingToCart(false);
        
        setCartId(data.cartId)
        toast.success(data.message, {
            position: "bottom-right",
        });
    }

    useEffect(() => {
        getCart();
    }, []);

    return (
        <cartContext.Provider value={{ cartCount, setCartCount, isLoading, handleAddToCart , cartId }}>
            {children}
        </cartContext.Provider>
    );
};
