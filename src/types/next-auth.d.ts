import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name: string
      email: string
      role: string
    } & DefaultSession["user"] 
    token: string
  }

  interface User {
    name: string
    email: string
    role: string
    token: string
  }
}

