"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    isLoading: loading,
    hasUser: Boolean(user),
    isClient: false,
  })

  useEffect(() => {
    setIsClient(true)
    setDebugInfo((prev) => ({
      ...prev,
      isClient: true,
    }))
  }, [])

  useEffect(() => {
    // Update debug info when auth state changes
    setDebugInfo({
      isLoading: loading,
      hasUser: Boolean(user),
      isClient,
    })

    // Only proceed with auth check if we're in the client
    if (!isClient) return

    if (!loading) {
      setAuthChecked(true)

      if (!user) {
        console.log("AuthGuard: No user found, redirecting to login")
        // Get the current path to redirect back after login
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/?returnUrl=${returnUrl}`)
      }
    }
  }, [user, loading, router, isClient])

  // Handle redirect after login if there's a returnUrl
  useEffect(() => {
    if (user && isClient && authChecked) {
      const returnUrl = searchParams.get("returnUrl")
      if (returnUrl) {
        console.log(`AuthGuard: User authenticated, redirecting to ${returnUrl}`)
        router.push(decodeURIComponent(returnUrl))
      }
    }
  }, [user, router, searchParams, isClient, authChecked])

  // Show loading state
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show debug info in development
  if (process.env.NODE_ENV === "development" && !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-destructive font-bold mb-2">Authentication Required</p>
          <p className="text-muted-foreground mb-4">You need to be signed in to view this page.</p>
          <div className="text-left text-xs bg-muted p-4 rounded-md">
            <p>Debug Info:</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated, return null (redirect will happen)
  if (!user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
