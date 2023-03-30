import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { cookies } = request;
  const jwt = cookies.has('next-auth.session-token') || cookies.has('__Secure-next-auth.session-token');
  console.log('request', request);
  console.log('jwt', jwt);
  if (request.nextUrl.pathname.startsWith('/profile')) {
    console.log('profile');
    if (!jwt) {
      return NextResponse.redirect(new URL('/landingpage', request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith('/landingpage')) {
    console.log('landingpage');
    if (jwt) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/landingpage/:path*'],
};
