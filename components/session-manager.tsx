"use client"

import { useEffect, useRef } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { toast } from "@/components/ui/use-toast"

export function SessionManager() {
  const { user, supabase } = useSupabase()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Function to reset the session timeout
  const resetSessionTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Check if session timeout is enabled
    const timeoutEnabled = localStorage.getItem("sessionTimeoutEnabled") === "true"
    if (!timeoutEnabled || !user) return

    // Get the timeout duration from localStorage (default to 30 minutes)
    const timeoutMinutes = Number.parseInt(localStorage.getItem("sessionTimeoutMinutes") || "30")
    const timeoutMs = timeoutMinutes * 60 * 1000

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      // Check if the user has been inactive for the timeout period
      const inactiveTime = Date.now() - lastActivityRef.current
      if (inactiveTime >= timeoutMs) {
        // Sign the user out
        supabase.auth.signOut().then(() => {
          toast({
            title: "Session expired",
            description: "You have been signed out due to inactivity.",
          })
          // Reload the page to ensure all state is reset
          window.location.href = "/"
        })
      }
    }, timeoutMs)
  }

  // Function to update the last activity timestamp
  const updateLastActivity = () => {
    lastActivityRef.current = Date.now()

    // Debounce the activity tracking to avoid excessive function calls
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
    }

    activityTimeoutRef.current = setTimeout(() => {
      resetSessionTimeout()
    }, 1000)
  }

  // Set up event listeners for user activity
  useEffect(() => {
    if (!user) return

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    events.forEach((event) => {
      window.addEventListener(event, updateLastActivity)
    })

    // Initial setup
    resetSessionTimeout()

    // Clean up
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActivity)
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current)
      }
    }
  }, [user])

  // Reset the session timeout when the component mounts or when the user changes
  useEffect(() => {
    resetSessionTimeout()
  }, [user])

  // This component doesn't render anything
  return null
}
