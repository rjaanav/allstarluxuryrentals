"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem("allstar-color-theme") || "default"
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  return null
}
