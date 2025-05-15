"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthButton } from "@/components/auth-button"
import { useMobile } from "@/hooks/use-mobile"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/promotions", label: "Promotions" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Allstar</span>
          </Link>
        </div>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {isMenuOpen && (
              <div className="absolute left-0 top-16 z-50 w-full bg-background p-4 shadow-lg">
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
                  <Link
                    href="/profile"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/bookings"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/bookings" ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <div className="pt-2">
                    <AuthButton className="w-full" />
                  </div>
                  <div className="pt-2">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
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
              <Link
                href="/profile"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Profile
              </Link>
              <Link
                href="/bookings"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/bookings" ? "text-primary" : "text-muted-foreground",
                )}
              >
                My Bookings
              </Link>
              <AuthButton />
              <ModeToggle />
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
