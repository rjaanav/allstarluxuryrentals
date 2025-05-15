"use client"

import { useSupabase } from "@/lib/supabase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AuthDebug() {
  const { supabase, user, loading } = useSupabase()

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    console.log("Session:", data.session)
    if (error) console.error("Session error:", error)
  }

  const checkUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    console.log("User:", data.user)
    if (error) console.error("User error:", error)
  }

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Auth Debug</CardTitle>
        <CardDescription>Check authentication status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold">Loading: {loading ? "Yes" : "No"}</p>
          <p className="font-semibold">User: {user ? "Authenticated" : "Not authenticated"}</p>
          {user && (
            <div className="mt-2 text-sm">
              <p>ID: {user.id}</p>
              <p>Email: {user.email}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={checkSession} size="sm">
            Check Session
          </Button>
          <Button onClick={checkUser} size="sm">
            Check User
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
