"use client"
import { Button, Separator } from '@/components';
import CartProduct from '@/components/products/CartProduct';
import { useCartContext } from '@/Context/cartContext';
import { formatPrice } from '@/helpers/currency';
import { GetToCartResponse } from '@/interfaces'
import { servicesApi } from '@/services';
import { getUserCart } from '@/services/cart.services';
import { Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, {  useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface InnerCartProps{
    cartData: GetToCartResponse;
}

export default function InnerCart({cartData}:InnerCartProps) {
    const [innerCartData, setInnerCartData] = useState<GetToCartResponse>(cartData);
    const [isLoadingRemoveCart, setIsLoadingRemoveCart] = useState(false);
    const { setCartCount } = useCartContext();


    useEffect(()=>{
        setCartCount!(innerCartData.numOfCartItems)
    },[innerCartData , setCartCount])

        async function handleRemoveCartItem(productId:string , setIsLoadingRemoveProduct:(value:boolean)=>void){
            setIsLoadingRemoveProduct(true)
        await servicesApi.removeCartProduct(productId)
        setIsLoadingRemoveProduct(false)
        toast.success("Product Deleted successfully",{
            position:"bottom-right"
        });
        const nweResponse = await getUserCart()
        setInnerCartData(nweResponse);
    };

    async function handleClearCart(){
        setIsLoadingRemoveCart(true);
        await servicesApi.clearCart();
        setIsLoadingRemoveCart(false);
        toast.success("Your Card Removed successfully",{
            position:"bottom-right"
        });
        const nweResponse = await getUserCart()
        setInnerCartData(nweResponse);
    };

    return (
    <>
        {/* Header */}
        <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        {innerCartData.numOfCartItems > 0 &&  <p className="text-muted-foreground">
        {innerCartData.numOfCartItems} item
        {innerCartData.numOfCartItems > 1 ? "s" : ""} in your cart
        </p>}
        </header>

        {innerCartData.numOfCartItems > 0 
        ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
        <div className="space-y-4">
        {innerCartData.data.products.map((item) => (<CartProduct handleRemoveCartItem={handleRemoveCartItem} key={item._id} item={item} /> ))}
        </div>

        {/* Clear Cart */}
            <div className="mt-6">
            <Button disabled={isLoadingRemoveCart} onClick={handleClearCart} variant="destructive" >
            {isLoadingRemoveCart ? <Loader2 className='animate-spin mr-2' /> : <Trash2 className="h-4 w-4 mr-2 " />}
            Clear Cart
            </Button>
            </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
        <div className="border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
            <div className="flex justify-between">
                <span>Subtotal ({innerCartData.numOfCartItems} items)</span>
                <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
            </div>
            <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
                </div>
            </div>

            <Separator className="my-4"  />

            <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
            </div>

            <Link href={"/checkout"}>
            <Button className="w-full" size="lg">
                Proceed to Checkout
            </Button>
            </Link>

            <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/products">Continue Shopping</Link>
            </Button>
            </div>
        </div>
        </div>
        :
        <div className=' text-center'>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">No Product in your cart</h2>
        <Button variant="default" className="w-fit mt-2" asChild>
        <Link href="/products">Shopping Now</Link>
        </Button>
        </div> }
    </>
    )
}
