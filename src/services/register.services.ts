"use server";

import { FormStateType, registerFormSchema } from "@/schemas/register-schema";

export async function handleRegister(formState:FormStateType,formData:FormData){

    const formValues = {
    name:formData.get('name') ,
    email:formData.get('email'),
    password:formData.get('password'),
    rePassword:formData.get('rePassword'),
    phone:formData.get('phone'),
};

const parsedData = registerFormSchema.safeParse(formValues)
    // console.log("🚀 ~ handleRegister ~ parsedData:", parsedData.error?.flatten().fieldErrors)
    if(!parsedData.success){
        return {
  success:false,
  error:parsedData.error?.flatten().fieldErrors,
  message:null
}
    }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/auth/signup`,
            {method:'POST',
            headers:{"Content-type" : "application/json"},
            body:JSON.stringify(formValues)});

            const data = await res.json()
            if(!res.ok){
                return {
  success:false,
  error:{},
  message:data.message,
}
            }
            return {
  success:true,
  error:{},
  message:'success',
}
    } catch (error) {
        console.log("🚀 ~ handleRegister ~ error:", error)
        
    }
}