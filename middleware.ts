import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for auth routes and API routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register')
  ) {
    return NextResponse.next()
  }

  // Update session
  const sessionResult = await updateSession(request)
  const { user, response } = sessionResult

  // Get user role from user_metadata (edge-compatible)
  // Role is stored in user_metadata during registration
  // For existing users, it needs to be synced via /api/auth/check-role
  const userRole = user?.user_metadata?.role || null

  // Admin routes - require ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // If role not in metadata, allow through and let client-side handle it
    // Client-side will fetch role from API and redirect if needed
    if (userRole && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Profile routes - require authentication
  if (pathname.startsWith('/profile')) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
