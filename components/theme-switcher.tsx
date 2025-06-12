"use client"

import { useState, useEffect } from "react"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type ThemeOption = {
  name: string
  value: string
  label: string
}

const themes: ThemeOption[] = [
  { name: "Default", value: "theme-default", label: "Purple (Default)" },
  { name: "Luxury", value: "theme-luxury", label: "Gold & Black" },
  { name: "Sport", value: "theme-sport", label: "Red & Black" },
  { name: "Modern", value: "theme-modern", label: "Blue & White" },
  { name: "Eco", value: "theme-eco", label: "Green & White" },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("theme-default")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only access localStorage after client mount
    if (!isMounted) return

    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem("allstar-theme") || "theme-default"
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [isMounted])

  const applyTheme = (theme: string) => {
    // Only apply to DOM if we're on the client
    if (typeof window === "undefined") return

    // Remove all theme classes
    const bodyClasses = Array.from(document.body.classList)
    bodyClasses.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.body.classList.remove(className)
      }
    })

    // Add new theme class
    document.body.classList.add(theme)

    // Save to localStorage
    localStorage.setItem("allstar-theme", theme)
    setCurrentTheme(theme)
  }

  // Don't render dropdown content during SSR to prevent hydration issues
  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" disabled>
        <Palette className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Change theme colors</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change theme colors</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => applyTheme(theme.value)}
            className="flex items-center justify-between"
          >
            {theme.label}
            {currentTheme === theme.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
