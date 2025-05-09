import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('nail-polish-auth')?.value === 'true';
  const isLoginPage = request.nextUrl.pathname === '/login';

  // If trying to access login page while authenticated, redirect to home
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && isProtectedRoute(request.nextUrl.pathname, request.method)) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original URL as a query parameter
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to login page if not authenticated
  if (isLoginPage && !isAuthenticated) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Add routes that need protection here
const isProtectedRoute = (pathname: string, method: string) => {
  // Protected frontend routes
  const protectedPages = [
    '/dashboard',
    '/polish/add',
    '/image-selection',
    '/polish/[id]', // This will match any polish detail page
  ];

  // Check if the current path matches any protected page
  if (protectedPages.some(page => {
    if (page.includes('[')) {
      // Handle dynamic routes by checking the pattern
      const pattern = new RegExp('^' + page.replace(/\[.*?\]/, '[^/]+') + '$');
      return pattern.test(pathname);
    }
    return pathname === page;
  })) {
    return true;
  }

  // API routes protection
  if (pathname.startsWith('/api/')) {
    // Allow all GET requests
    if (method === 'GET') return false;

    // Polish management routes
    if (pathname.startsWith('/api/polish')) {
      if (pathname === '/api/polish') return true; // POST /api/polish
      if (pathname.match(/^\/api\/polish\/\d+$/)) return true; // PUT/DELETE /api/polish/[id]
      return false;
    }

    // Image management routes
    if (
      pathname === '/api/update-image' ||
      pathname === '/api/update-bulk-images' ||
      pathname === '/api/delete-bulk-images' ||
      pathname.startsWith('/api/remove-image/')
    ) {
      return true;
    }

    // Attributes management routes
    if (pathname === '/api/attributes') {
      return true;
    }
  }

  return false;
};

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};
