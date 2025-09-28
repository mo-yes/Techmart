"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { servicesApi } from "@/services";
import { Order, CreateOrderResponse } from "@/interfaces";
import Loading from "@/app/loading";

export default function SuccessOrdersPage() {
  const { id } = useParams(); 
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      const response: CreateOrderResponse = await servicesApi.getOrderById(id as string);
      setOrder(response.data);
    }
    if (id) fetchOrder();
  }, [id]);

  if (!order) return <Loading />;

  return (
    <section className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <Card className="max-w-lg w-full shadow-xl border border-green-200 animate-fadeIn">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-green-600 animate-bounce">
            Order Success 🎉
          </h2>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-700">
          <p className="animate-fadeInUp delay-100"><b>Order ID:</b> {order._id}</p>
          <p className="animate-fadeInUp delay-200"><b>Total Price:</b> {order.totalOrderPrice} EGP</p>
          <p className="animate-fadeInUp delay-300"><b>Payment:</b> {order.paymentMethodType}</p>
          <p className="animate-fadeInUp delay-400"><b>Paid:</b> {order.isPaid ? "Yes" : "No"}</p>
          <p className="animate-fadeInUp delay-500"><b>Delivered:</b> {order.isDelivered ? "Yes" : "No"}</p>
          <p className="animate-fadeInUp delay-600"><b>City:</b> {order.shippingAddress.city}</p>
          <p className="animate-fadeInUp delay-700"><b>Phone:</b> {order.shippingAddress.phone}</p>
          <p className="animate-fadeInUp delay-800"><b>Address:</b> {order.shippingAddress.details}</p>
        </CardContent>
      </Card>
    </section>
  );
}
