"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import toast from "react-hot-toast";
import { servicesApi } from "@/services";
import { useCartContext } from "@/Context/cartContext";
import { CreateOrderResponse, OrderData } from "@/interfaces";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutForm, checkoutSchema } from "@/schemas/checkout.schema";


export default function CheckoutPage() {
  const { cartId } = useCartContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [onLinePay, setOnLinePay] = useState(false);
  const [, setOrderData] = useState<OrderData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  {/* ✅ Cash Order */}
  const handleCashOrder = async (data: CheckoutForm) => {
    if (!cartId) return toast.error("Cart not found");

    setLoading(true);
    try {
      const response: CreateOrderResponse = await servicesApi.createCashOrder(cartId, data);
      setOrderData(response.data);
      toast.success("Cash order created");
      router.push(`/allorders/${response.data._id}`);
    } catch (err) {
      console.log("🚀 ~ handleCashOrder ~ err:", err);
      toast.error("Failed to create Cash Order");
    } finally {
      setLoading(false);
    }
  };

  {/* ✅ Online Order */}
  const handleOnlineOrder = async (data: CheckoutForm) => {
    if (!cartId) return toast.error("Cart not found");

    setOnLinePay(true);
    try {
      const redirectUrl =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const response = await servicesApi.createOnlineOrder(cartId, data, redirectUrl);

      const sessionUrl = response?.session?.url || response?.url || response?.data?.url;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        toast.error("No payment URL returned");
      }
    } catch (err) {
      console.log("🚀 ~ handleOnlineOrder ~ err:", err);
      toast.error("Failed to create Online Order");
    } finally {
      setOnLinePay(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold">Shipping Information</h2>
        </CardHeader>

        <form onSubmit={handleSubmit(handleCashOrder)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="details">Address Details</Label>
              <Input id="details" {...register("details")} />
              {errors.details && (
                <p className="text-red-500 text-sm">{errors.details.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-4">
            <div className=" flex items-center gap-6 mx-auto justify-between my-3">
              <Button type="submit" disabled={loading} className=" bg-green-600">
              {loading ? "Loading..." : "Pay Cash"}
            </Button>

            <Button
              type="button"
              onClick={handleSubmit(handleOnlineOrder)}
              disabled={onLinePay}
              className=" bg-blue-600"
            >
              {onLinePay ? "Loading..." : "Pay Online"}
            </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
