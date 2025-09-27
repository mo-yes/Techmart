import * as z from 'zod';

export const registerFormSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),

  email: z.string()
    .email({ message: "Enter a valid email address" }),

  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/, { 
      message: "Password must include uppercase, lowercase, number, and special character" 
    }),

  rePassword: z.string()
    .min(1, { message: "Confirm Password is required" }),

    phone: z.string()
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Enter a valid Egyptian phone number" }),

}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"], // الرسالة هتظهر عند rePassword
})

 export type RegisterSchema = z.infer<typeof registerFormSchema>;

export const formState = {
  success:false,
  error:{},
  message:null
};

  export type FormStateType = {
  success:boolean,
  error:{
    name?: string[];
    email?: string[];
    password?: string[];
    rePassword?: string[];
    phone?: string[];
  },
  message:string | null ;
};