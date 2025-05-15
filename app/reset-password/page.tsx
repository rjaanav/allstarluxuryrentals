"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/lib/supabase-provider"
import { Loader2, AlertCircle, CheckCircle, Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if we have a hash fragment with an access token
    const hasHashFragment =
      typeof window !== "undefined" && window.location.hash && window.location.hash.includes("access_token")

    if (!hasHashFragment) {
      setError("Invalid or expired password reset link. Please request a new one.")
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      if (!password || !confirmPassword) {
        throw new Error("Please enter your new password")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess(true)
      toast({
        title: "Password updated successfully",
        description: "Your password has been reset. You can now sign in with your new password.",
      })

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error: any) {
      console.error("Error resetting password:", error)
      setError(error.message || "An error occurred while resetting your password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground mt-2">Enter your new password below</p>
        </div>

        {error ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3 text-sm">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="mt-1">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => router.push("/")}>
                Return to Home
              </Button>
            </div>
          </div>
        ) : success ? (
          <div className="bg-primary/10 p-4 rounded-md flex items-start gap-3 text-sm">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Password reset successful!</p>
              <p className="mt-1">Your password has been updated. You will be redirected to the home page shortly.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => router.push("/")}>
                Return to Home
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
