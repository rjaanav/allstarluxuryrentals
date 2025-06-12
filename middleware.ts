import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Create a response that we'll return regardless of auth status
  const res = NextResponse.next()

  try {
    // Define protected routes
    const protectedRoutes = ["/bookings", "/booking-success", "/reviews/add"]

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // If it's not a protected route, return immediately
    if (!isProtectedRoute) {
      return res
    }

    // For protected routes, check for authentication
    // We'll use a simple cookie check as a fallback mechanism
    const hasAuthCookie = req.cookies.has("sb-access-token") || req.cookies.has("sb-refresh-token")

    if (!hasAuthCookie) {
      // User is not authenticated, redirect to home page
      const redirectUrl = new URL("/", req.url)
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If we have an auth cookie, allow access to the protected route
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // Always return a response to avoid breaking the app
    return res
  }
}

export const config = {
  matcher: ["/bookings/:path*", "/booking-success/:path*", "/reviews/add/:path*"],
}
