"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Car } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthButton } from "@/components/auth-button"
import { ProfileButton } from "@/components/profile-button"
import { useMobile } from "@/hooks/use-mobile"
import { useSupabase } from "@/lib/supabase-provider"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NoSSR } from "@/components/no-ssr"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useMobile()
  const { user, loading } = useSupabase()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Render auth section only after mount
  const renderAuthSection = () => {
    // Always return consistent content during SSR and initial client render
    if (!isMounted || loading) {
      return <div className="w-20 h-10" />
    }

    return user ? <ProfileButton /> : <AuthButton />
  }

  const renderMobileAuthSection = () => {
    if (!isMounted || loading) {
      return null
    }

    return (
      <div className="pt-2">
        {user ? (
          <ProfileButton className="w-full justify-start" />
        ) : (
          <AuthButton className="w-full" />
        )}
      </div>
    )
  }

  // Don't render mobile-specific content during SSR
  const shouldShowMobileMenu = isMounted && isMobile

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">All Star Luxury</span>
          </Link>
        </div>

        {/* Always render both mobile and desktop versions, but hide with CSS to prevent hydration issues */}
        
        {/* Mobile Menu Button - only show after client mount */}
        <div className="md:hidden">
          {isMounted && (
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        {shouldShowMobileMenu && isMenuOpen && (
          <div className="absolute left-0 top-16 z-50 w-full bg-background p-4 shadow-lg md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <NoSSR>
                {renderMobileAuthSection()}
              </NoSSR>
              <div className="pt-2">
                <ModeToggle />
              </div>
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex md:gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-2">
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <ModeToggle />
            <NoSSR fallback={<div className="w-20 h-10" />}>
              {renderAuthSection()}
            </NoSSR>
          </div>
        </div>
      </div>
    </nav>
  )
}
