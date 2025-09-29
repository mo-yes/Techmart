// src/app/(pages)/cart/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import InnerCart from "./InnerCart";
import { getUserCart } from "@/services/cart.services";

export default async function Cart() {
  const response = await getUserCart();

  return (
    <section className="container mx-auto px-4 py-8">
      <InnerCart cartData={response} />
    </section>
  );
}
