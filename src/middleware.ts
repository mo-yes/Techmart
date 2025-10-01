import { getToken } from 'next-auth/jwt'
import { NextResponse , NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token" 
    : "next-auth.session-token";      

    const token =await getToken({req:request , cookieName, secret: process.env.NEXTAUTH_SECRET});
    const {pathname , search} = request.nextUrl;

    const authRoute = ['/auth/login', '/auth/register'];

    const protectRout = ['/cart', '/profile', '/allorders', '/checkout']

    if(token && authRoute.includes(pathname)){
        return NextResponse.redirect(new URL("/",request.url));
    }

    if(!token && protectRout.includes(pathname)){
    const loginUrl = new URL("/auth/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname + search);    // <=={/* CALLBACK URL*/}

    return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/cart", "/profile", "/allorders", "/checkout", "/auth/:path*"],
}

