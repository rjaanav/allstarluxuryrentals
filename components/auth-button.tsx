"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/supabase-provider"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useToast } from "@/hooks/use-toast"

interface AuthButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  showSignUp?: boolean
}

export function AuthButton({ className, variant = "default", showSignUp = true }: AuthButtonProps) {
  const { supabase, user, loading: authLoading } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin")
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openSignIn = () => {
    setAuthModalTab("signin")
    setShowAuthModal(true)
  }

  const openSignUp = () => {
    setAuthModalTab("signup")
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

  if (showSignUp) {
    return (
      <>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={openSignIn} className={className}>
            Sign In
          </Button>
          <Button variant={variant} size="sm" onClick={openSignUp} className={className}>
            Sign Up
          </Button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={authModalTab} />
      </>
    )
  }

  return (
    <>
      <Button variant={variant} size="sm" onClick={openSignIn} className={className}>
        Sign In
      </Button>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={authModalTab} />
    </>
  )
}
