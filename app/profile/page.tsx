"use client"

import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToastContext } from "@/components/toast-provider"
import { AuthCheck } from "@/components/auth-check"

export default function ProfilePage() {
  const { user, profile, updateProfile, loading } = useAuth()
  const { success, error } = useToastContext()
  const [name, setName] = useState(profile?.full_name || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile({ full_name: name })
      success("Profile updated successfully!")
    } catch (err: any) {
      error(err.message || "Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthCheck>
      <div className="container mx-auto max-w-lg py-16">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  )
} 