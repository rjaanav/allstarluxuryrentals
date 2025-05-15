import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    // Get the origin based on the environment
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://allstarluxuryrentals-jaanavs-projects.vercel.app" ||
      requestUrl.origin

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${origin}/auth-error?error=${encodeURIComponent(error.message)}`)
      }
    }

    // Redirect to the home page after successful authentication
    return NextResponse.redirect(origin)
  } catch (error) {
    console.error("Unexpected error in auth callback:", error)
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://allstarluxuryrentals-jaanavs-projects.vercel.app" ||
      new URL(request.url).origin
    return NextResponse.redirect(`${origin}/auth-error`)
  }
}
