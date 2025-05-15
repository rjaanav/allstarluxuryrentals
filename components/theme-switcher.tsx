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
  color: string
}

const themes: ThemeOption[] = [
  {
    name: "Default",
    value: "default",
    label: "Purple (Default)",
    color: "bg-[hsl(263.4,70%,50.4%)]",
  },
  {
    name: "Luxury",
    value: "luxury",
    label: "Gold & Black",
    color: "bg-[hsl(45,100%,50%)]",
  },
  {
    name: "Sport",
    value: "sport",
    label: "Red & Black",
    color: "bg-[hsl(0,90%,50%)]",
  },
  {
    name: "Modern",
    value: "modern",
    label: "Blue & White",
    color: "bg-[hsl(221,83%,53%)]",
  },
  {
    name: "Eco",
    value: "eco",
    label: "Green & White",
    color: "bg-[hsl(142,76%,36%)]",
  },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>("default")

  useEffect(() => {
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem("allstar-color-theme") || "default"
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const changeTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("allstar-color-theme", theme)
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
            onClick={() => changeTheme(theme.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
              {theme.label}
            </div>
            {currentTheme === theme.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
