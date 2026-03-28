import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from "jsonwebtoken"
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/signup'
    const token = request.cookies.get('token')?.value || ''
    // console.log(token)
    if (!token) {
        if (!isPublicPath) {
            return NextResponse.redirect(new URL('/login', request.nextUrl))
        }
        return NextResponse.next()
    }
    const user = jwt.verify(token, process.env.TOKEN_SECRET!) as any
    console.log(user.username);

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/profile/' + user.username, request.nextUrl))
    }
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}
 
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/profile',
  ],
}