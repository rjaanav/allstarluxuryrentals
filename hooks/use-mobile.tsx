"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
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
    }
  }, [])

  return isMobile
}

// Add this alias for backward compatibility
export const useMobile = useIsMobile
