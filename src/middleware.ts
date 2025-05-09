import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('shoe-auth')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/api/shoes',
    '/api/brands',
    '/api/colors',
    '/api/dress-styles',
    '/api/shoe-types',
    '/api/heel-types',
    '/api/locations'
  ];

  // Check if the current path is a public route
  if (publicRoutes.some(route => pathname === route)) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    '/shoe/add',
    '/shoe/[id]', // This will match any shoe detail page
    '/shoe/[id]/select-image',
    '/shoe/[id]/edit',
    '/image-selection'
  ];

  // Check if the current path is a protected route
  if (protectedRoutes.some(route => {
    if (route.includes('[id]')) {
      return pathname.match(/^\/shoe\/\d+(\/select-image|\/edit)?$/);
    }
    return pathname === route;
  })) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // API routes that require authentication
  if (pathname.startsWith('/api/shoe')) {
    if (!isAuthenticated) {
      return new NextResponse(null, { status: 401 });
    }
    if (pathname === '/api/shoe') return true; // POST /api/shoe
    if (pathname.match(/^\/api\/shoe\/\d+$/)) return true; // PUT/DELETE /api/shoe/[id]
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
