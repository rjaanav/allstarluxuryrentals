"use client"

import type { ReactNode } from "react"
import { BackgroundAnimation } from "./background-animation"

interface AnimatedBackgroundWrapperProps {
  children: ReactNode
  intensity?: "low" | "medium" | "high"
}

export function AnimatedBackgroundWrapper({ children, intensity = "medium" }: AnimatedBackgroundWrapperProps) {
  return (
    <>
      <BackgroundAnimation variant="particles" intensity={intensity} />
      {children}
    </>
  )
}
