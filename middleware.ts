import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Define protected routes
  const protectedRoutes = ["/profile", "/bookings", "/booking-success", "/reviews/add", "/admin"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If the route is protected and the user is not authenticated, redirect to the login page
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/profile/:path*", "/bookings/:path*", "/booking-success/:path*", "/reviews/add/:path*", "/admin/:path*"],
}
