import { servicesApi } from "@/services"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
const handler = NextAuth({
  providers: [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: "Email", type: "email", placeholder: "Your-Email@Exampl.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const res = await servicesApi.login(credentials?.email ?? "", credentials?.password ?? "")
      if(res.message == "success"){
        // const decoded = JSON.parse(atob(res.token.split(".")[1]));
        const user = {id:res.user.email , name:res.user.name , email:res.user.email , role:res.user.role , token:res.token }
        return user
      }else{
        return null
      }
      
    }
  })
],
pages:{
    signIn:"/auth/login"
},
callbacks:{
    async session({ session, token }) {
  session.token = token.token as string
  session.user = token.user as {
    name: string
    email: string
    role: string
  }
  return session
}
,
    async jwt({ token, user }) {
  if (user) {
    token.token = user.token
    token.user = {
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
  return token
}

},
secret:process.env.AUTH_SECRET ,
session:{
    strategy: 'jwt'
}
})

export { handler as GET, handler as POST }