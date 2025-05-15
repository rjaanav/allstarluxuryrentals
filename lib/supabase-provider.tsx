"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Define the type for the Supabase context
type SupabaseContext = {
  supabase: SupabaseClient
  user: any | null
  loading: boolean
}

// Create the context
const Context = createContext<SupabaseContext | undefined>(undefined)

// Export the provider component
export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the Supabase URL and anon key from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Create the Supabase client
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey))
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Set up the auth state listener
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
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
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <Context.Provider
      value={{
        supabase,
        user,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  )
}

// Export the hook to use Supabase
export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
