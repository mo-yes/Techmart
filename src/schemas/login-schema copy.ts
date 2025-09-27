import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

 export type LoginSchema = z.infer<typeof loginFormSchema>;