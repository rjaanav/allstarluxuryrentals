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

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && !user) {
      // Get the current path to redirect back after login
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/?returnUrl=${returnUrl}`)
    }
  }, [user, loading, router, isClient])

  // Handle redirect after login if there's a returnUrl
  useEffect(() => {
    if (user && isClient) {
      const returnUrl = searchParams.get("returnUrl")
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl))
      }
    }
  }, [user, router, searchParams, isClient])

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

  if (!user) {
    return null
  }

  return <>{children}</>
}
