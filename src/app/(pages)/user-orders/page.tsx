"use client";

import { useContext, useEffect, useState } from "react";
import { servicesApi } from "@/services";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order, ShippingAddress } from "@/interfaces";
import { cartContext } from "@/Context/cartContext";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { cartId } = useContext(cartContext); 

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response:ShippingAddress = await servicesApi.getUserOrders();
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="shadow">
            <CardHeader>
              <h2 className="font-semibold">Order #{order.id}</h2>
            </CardHeader>
            <CardContent>
              <p>Total: <b>{order.totalOrderPrice} EGP</b></p>
              <p>Payment: {order.paymentMethodType}</p>
              <p>Status: {order.isPaid ? "Paid ✅" : "Not Paid ❌"}</p>
              <p>Delivered: {order.isDelivered ? "Yes 🚚" : "No ❌"}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                Shipping: {order.shippingAddress.city}, {order.shippingAddress.details}
              </p>
              <Button className="mt-2" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
