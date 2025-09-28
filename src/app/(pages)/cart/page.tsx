
import React from "react";
import InnerCart from "./InnerCart";
import { getUserCart } from "@/services/cart.services";

export default async function Cart() {
  async function fetchCartProducts() {
    const response = await getUserCart()
    return response;
  };


  const response = await fetchCartProducts();

  return (
    <section className="container mx-auto px-4 py-8">
      <InnerCart cartData={response} />
    </section>
  );
}
