import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = await getToken({ req });

  console.log('token', token);

  if (req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/mumble')) {
    if (!token) {
      return NextResponse.redirect(new URL('/landingpage', req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith('/landingpage')) {
    if (token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/landingpage/:path*', '/mumble/:path*'],
};
