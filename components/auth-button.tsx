"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase-provider"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useToastContext } from "@/components/toast-provider"

interface AuthButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function AuthButton({ className, variant = "default" }: AuthButtonProps) {
  const { supabase, user, loading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const { success, error: showError } = useToastContext()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      success("Signed out successfully")

      router.refresh()
    } catch (error: any) {
      console.error("Error signing out:", error)
      showError(error.message || "An error occurred while signing out")
    } finally {
      setIsLoading(false)
    }
  }

  const openAuthModal = () => {
    setShowAuthModal(true)
  }

  if (authLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className={className}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <Button variant={variant} size="sm" onClick={handleSignOut} disabled={isLoading} className={className}>
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
        Sign Out
      </Button>
    )
  }

  return (
    <>
      <Button variant={variant} size="sm" onClick={openAuthModal} className={className}>
        Sign In
      </Button>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
