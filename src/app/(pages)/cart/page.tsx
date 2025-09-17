
import { servicesApi } from "@/services";
import React from "react";
import InnerCart from "./InnerCart";

export default async function Cart() {
  
  async function fetchCartProducts() {
    const response = await servicesApi.getCartProducts();
    return response;
  };


  const response = await fetchCartProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <InnerCart cartData={response} />
    </div>
  );
}
