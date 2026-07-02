// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log("Middleware tetiklendi!"); 
    const token = request.cookies.get('auth_token');
    const { pathname } = request.nextUrl;
    //dashboard
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login/gym', request.url));
        }
    }

   

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login/:path*', '/register/:path*'],
};