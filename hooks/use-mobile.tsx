"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only check if we're on the client
    if (!isClient) return

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [isClient])

  // Return false during SSR and initial client render to prevent hydration mismatch
  return isClient ? isMobile : false
}

// Add this alias for backward compatibility
export const useMobile = useIsMobile
