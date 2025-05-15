"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import type { User } from "@supabase/supabase-js"
import type { UserProfile } from "@/types"

export function useAuth() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the current user
    const getUser = async () => {
      setLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Get the user profile
          const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

          if (error) {
            console.error("Error fetching user profile:", error)
          } else {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        getUser() // Refresh the profile
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setProfile(null)
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(profileData)
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
      return data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
    updateProfile,
  }
}
