import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APP_HOST_PREFIX = 'app.';

function isLocalhost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const hostname = nextUrl.hostname;
  const isAppHost = hostname.startsWith(APP_HOST_PREFIX) || isLocalhost(hostname);
  const isAppPath = nextUrl.pathname.startsWith('/app');

  if (isAppHost) {
    if (isAppPath) {
      return NextResponse.next();
    }

    const rewriteUrl = nextUrl.clone();
    rewriteUrl.pathname =
      nextUrl.pathname === '/' ? '/app' : `/app${nextUrl.pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  if (hostname) {
    const baseHostname = hostname.replace(/^www\./, '');
    const redirectUrl = nextUrl.clone();
    redirectUrl.hostname = `${APP_HOST_PREFIX}${baseHostname}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|api/|favicon.ico).*)']
};
