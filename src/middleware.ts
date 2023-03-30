import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { cookies } = request;
  const jwt = cookies.get('next-auth.session-token');

  if (request.nextUrl.pathname.startsWith('/profile')) {
    if (!jwt) {
      return NextResponse.redirect(new URL('/landingpage', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/landingpage')) {
    if (jwt) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}
