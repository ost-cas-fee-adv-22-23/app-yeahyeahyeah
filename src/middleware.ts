import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { cookies } = req;
  const jwt = cookies.get('next-auth.session-token');

  if (!jwt) {
    return NextResponse.redirect(new URL('/landingpage', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/profile/:path*',
};
