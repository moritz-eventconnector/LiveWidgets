import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;

  if (nextUrl.pathname === '/') {
    const rewriteUrl = nextUrl.clone();
    rewriteUrl.pathname = '/app';
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|api/|favicon.ico).*)']
};
