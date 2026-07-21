import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  // Protect /admin routes, excluding login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If already authenticated and accessing login, redirect to events manager
  if (pathname === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin/events', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
