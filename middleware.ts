import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);
    if (request.nextUrl.pathname.startsWith('/app')) {
      const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.livewidgets.de';
      return NextResponse.redirect(
        new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, appBaseUrl)
      );
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  },
  {
    pages: {
      signIn: '/auth/login'
    }
  }
);

export const config = {
  matcher: ['/app/:path*', '/admin/:path*']
};
