"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
// import { motion } from "framer-motion" // Temporarily commented out
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToastContext } from "@/components/toast-provider"
import {
  User,
  Settings,
  LogOut,
  Calendar,
  ChevronDown,
  Loader2,
} from "lucide-react"

interface ProfileButtonProps {
  className?: string
}

export function ProfileButton({ className }: ProfileButtonProps) {
  const { user, supabase, loading } = useSupabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { success, error: showError } = useToastContext()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      success("Signed out successfully")
      router.push("/")
    } catch (error: any) {
      console.error("Error signing out:", error)
      showError(error.message || "An error occurred while signing out")
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render anything during SSR or while loading
  if (!isMounted || loading) {
    return null
  }

  // Don't render if no user
  if (!user) {
    return null
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`h-10 px-2 ${className}`}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex md:flex-col md:items-start">
              <span className="text-sm font-medium leading-none">
                {displayName}
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                {user.email}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/bookings" className="w-full cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/profile?tab=security" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          disabled={isLoading}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 