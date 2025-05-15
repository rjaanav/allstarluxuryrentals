"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { BackgroundAnimation } from "./background-animation"

interface AnimatedBackgroundWrapperProps {
  children: ReactNode
  variant?: "racing-lines" | "speedometer" | "particles" | "grid" | "minimal"
  intensity?: "low" | "medium" | "high"
}

export function AnimatedBackgroundWrapper({ children, variant, intensity = "medium" }: AnimatedBackgroundWrapperProps) {
  const pathname = usePathname()

  // Determine which animation to use based on the current page
  const getVariantForPage = (): "racing-lines" | "speedometer" | "particles" | "grid" | "minimal" => {
    if (variant) return variant

    if (pathname === "/") return "racing-lines"
    if (pathname.includes("/fleet")) return "grid"
    if (pathname.includes("/profile")) return "minimal"
    if (pathname.includes("/bookings")) return "speedometer"
    if (pathname.includes("/contact")) return "particles"
    if (pathname.includes("/how-it-works")) return "racing-lines"
    if (pathname.includes("/reviews")) return "minimal"
    if (pathname.includes("/admin")) return "grid"

    // Default
    return "racing-lines"
  }

  return (
    <>
      <BackgroundAnimation variant={getVariantForPage()} intensity={intensity} />
      {children}
    </>
  )
}
