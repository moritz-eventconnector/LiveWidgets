import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      `https://${process.env.APP_DOMAIN ?? 'app.livewidgets.de'}`;
    const appDomain = new URL(appBaseUrl).hostname;
    const isAppHost = request.nextUrl.hostname === appDomain;

    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
    const isLandingRoute =
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/landing');

    if (
      isAppHost &&
      !isAuthRoute &&
      !request.nextUrl.pathname.startsWith('/app') &&
      !isLandingRoute
    ) {
      const rewriteUrl = request.nextUrl.clone();
      const normalizedPath =
        request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname;
      rewriteUrl.pathname = `/app${normalizedPath}`;
      return NextResponse.rewrite(rewriteUrl);
    }

    if (!isAppHost && request.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(
        new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, appBaseUrl)
      );
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  },
  {
    pages: {
      signIn: '/auth/login'
    },
    callbacks: {
      authorized({ req, token }) {
        const appBaseUrl =
          process.env.NEXT_PUBLIC_APP_URL ??
          `https://${process.env.APP_DOMAIN ?? 'app.livewidgets.de'}`;
        const appDomain = new URL(appBaseUrl).hostname;
        if (req.nextUrl.hostname !== appDomain) {
          return true;
        }
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|socket).*)']
};
