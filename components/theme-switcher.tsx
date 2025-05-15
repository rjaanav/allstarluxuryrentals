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

  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem("allstar-theme") || "theme-default"
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (theme: string) => {
    // Remove all theme classes
    document.body.classList.forEach((className) => {
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
