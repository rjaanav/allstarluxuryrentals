"use client"

import type { ReactNode } from "react"
import { BackgroundAnimation } from "./background-animation"
import { NoSSR } from "./no-ssr"

interface AnimatedBackgroundWrapperProps {
  children: ReactNode
  intensity?: "low" | "medium" | "high"
}

export function AnimatedBackgroundWrapper({ children, intensity = "medium" }: AnimatedBackgroundWrapperProps) {
  return (
    <>
      <NoSSR>
        <BackgroundAnimation variant="particles" intensity={intensity} />
      </NoSSR>
      {children}
    </>
  )
}
