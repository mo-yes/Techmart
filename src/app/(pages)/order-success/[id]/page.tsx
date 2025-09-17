"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { servicesApi } from "@/services";
import { Order } from "@/interfaces";
import Loading from "@/app/loading";

export default function AllOrdersPage() {
  const { id } = useParams(); 
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      const response = await servicesApi.getOrderById(id as string);
      setOrder(response.data);
    }
    if (id) fetchOrder();
  }, [id]);

  if (!order) return <Loading />;

  return (
    <div className="max-w-lg mx-auto my-10">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-green-600">
            Order Success 🎉
          </h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Total Price:</b> {order.totalOrderPrice} EGP</p>
          <p><b>Payment:</b> {order.paymentMethodType}</p>
          <p><b>Paid:</b> {order.isPaid ? "Yes" : "No"}</p>
          <p><b>Delivered:</b> {order.isDelivered ? "Yes" : "No"}</p>
          <p><b>City:</b> {order.shippingAddress.city}</p>
          <p><b>Phone:</b> {order.shippingAddress.phone}</p>
          <p><b>Address:</b> {order.shippingAddress.details}</p>
        </CardContent>
      </Card>
    </div>
  );
}
