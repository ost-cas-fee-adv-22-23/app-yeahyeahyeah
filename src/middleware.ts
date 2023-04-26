import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/mumble')) {
      return NextResponse.redirect(new URL('/landingpage', req.url));
    }
  }

  if (token) {
    if (req.nextUrl.pathname.startsWith('/landingpage')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
}

// Decision: Redirect all pages to landingpage, except timeline stream on index.tsx
export const config = {
  matcher: ['/profile/:path*', '/landingpage/:path*', '/mumble/:path*'],
};
