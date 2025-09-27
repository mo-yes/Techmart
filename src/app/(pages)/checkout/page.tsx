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

export default function CheckoutPage() {
  const { cartId } = useCartContext();

  const [loading, setLoading] = useState(false);
  const [onLinePay, setOnLinePay] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({ details: "", phone: "", city: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🟢 كاش


const handleCashOrder = async () => {
  if (!cartId) return toast.error("Cart not found");
  setLoading(true);
  try {
    const response: CreateOrderResponse = await servicesApi.createCashOrder(cartId, form);
    setOrderData(response.data);
    toast.success("Cash order created");
    router.push(`/allorders/${response.data._id}`);
  } catch (err) {
    toast.error("Failed to create Cash Order");
  } finally {
    setLoading(false);
  }
};


  const handleOnlineOrder = async () => {
    if (!cartId) return toast.error("Cart not found");
    setOnLinePay(true);
    try {
      const redirectUrl =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const response = await servicesApi.createOnlineOrder(cartId, form, redirectUrl);

      const sessionUrl = response?.session?.url || response?.url || response?.data?.url;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        toast.error("No payment URL returned");
      }
    } catch (err) {
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

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="details">Address Details</Label>
            <Input
              id="details"
              name="details"
              value={form.details}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button onClick={handleCashOrder} disabled={loading} className="w-1/2 bg-green-600">
            {loading ? "Loading..." : "Pay Cash"}
          </Button>
          <Button onClick={handleOnlineOrder} disabled={onLinePay} className="w-1/2 bg-blue-600">
            {onLinePay ? "Loading..." : "Pay Online"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
