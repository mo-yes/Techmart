"use client";
import { formatPrice } from '@/helpers/currency'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import { CartProduct as CartProductI , InnerCartProduct } from '@/interfaces'
import { servicesApi } from '@/services';
import toast from 'react-hot-toast';

interface CartProductProps{
    item:CartProductI <InnerCartProduct>;
    handleRemoveCartItem:(
        productId:string,
        setIsLoadingRemoveProduct: (value:boolean)=> void
    )=> void;
};
export default function CartProduct({item , handleRemoveCartItem}:CartProductProps) {
    const [isLoadingRemoveProduct, setIsLoadingRemoveProduct] = useState(false);
    const [isCartCount, setIsCartCount] = useState<number>(item.count);
    const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout>()

    async function handleUpdateCount(newCount: number) {
    if (newCount < 1) {
    toast.error("Can't reduce below 1 ❌");
    return;
    }
    setIsCartCount(newCount);
    clearTimeout(timeOutId);

    const id = setTimeout(async () => {
    const response = await servicesApi.updateCount(item.product._id, newCount);

    if (response.status === "success" && response.product) {
    setIsCartCount(response?.product?.count);
    toast.success("Update Count Product Successfully ✅");
    } else if (response.status === "error"){
    toast.error("Failed to update product count ❌");
    }
    }, 1000);
    setTimeOutId(id);
};

    return (
    <>
                <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
                {/* product image */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    className="object-cover rounded-md"
                    sizes="80px"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {/* product title */}
                <h3 className="font-semibold line-clamp-2">
                    <Link
                    href={`/products/${item.product.id}`}
                    className="hover:text-primary transition-colors"
                    >
                    {item.product.title}
                    </Link>
                </h3>

                {/* product name */}
                <p className="text-sm text-muted-foreground">
                    {item.product.brand?.name}
                </p>

                {/* product price */}
                <p className="font-semibold text-primary mt-2">
                    {formatPrice(item.price)}
                </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                {/* remove button */}
                <Button disabled={isLoadingRemoveProduct} onClick={()=>
                    handleRemoveCartItem(item.product._id ,  setIsLoadingRemoveProduct)}  
                    variant="destructive" size="sm">
                {isLoadingRemoveProduct ? <Loader2 className=' animate-spin' /> : <Trash2 className="h-4 w-4" />}
                </Button>

                    {/* quantity control */}
                    <div className="flex items-center gap-2">
                    {/* decrement */}
                    <Button onClick={()=>
                        handleUpdateCount(isCartCount - 1)} variant="outline" size="sm">
                    <Minus className="h-4 w-4" />
                    </Button>

                    {/* show count */}
                    <span className="w-8 text-center">{isCartCount}</span>

                     {/* increment */}
                    <Button onClick={()=>
                        handleUpdateCount(isCartCount + 1)} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                    </Button>
                    </div>
                </div>
                </div>
    </>
    )
}
