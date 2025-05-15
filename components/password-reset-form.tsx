"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"

interface PasswordResetFormProps {
  onBack: () => void
}

export function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      if (!email) {
        throw new Error("Email is required")
      }

      // Get the current URL for the redirect
      const origin =
        typeof window !== "undefined" && window.location.hostname === "localhost"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "https://allstarluxuryrentals-jaanavs-projects.vercel.app"

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error: any) {
      console.error("Error resetting password:", error)
      setError(error.message || "An error occurred while sending the reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 flex items-center text-muted-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>

      <div className="text-center">
        <h3 className="text-lg font-semibold">Reset Your Password</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {success ? (
        <div className="bg-primary/10 p-4 rounded-md flex items-start gap-3 text-sm">
          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Password reset email sent!</p>
            <p className="mt-1">
              Check your email for a link to reset your password. If you don't see it, check your spam folder.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
