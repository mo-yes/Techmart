"use server";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";


export async function getUserToken(){
    const cockieStore =await cookies()
    const encodedToken = cockieStore.get('next-auth.session-token')?.value || 
    cockieStore.get('__Secure-next-auth.callback-url')?.value
    const decodedToken = await decode({token: encodedToken , secret:process.env.AUTH_SECRET!})
    return decodedToken?.token;
}