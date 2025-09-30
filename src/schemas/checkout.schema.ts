import { z } from "zod";

export const checkoutSchema = z.object({
  details: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits"),
  city: z.string().min(2, "City must be at least 2 characters"),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
