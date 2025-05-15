"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Session, User } from "@supabase/supabase-js"

// Define the type for the Supabase context
type SupabaseContext = {
  supabase: SupabaseClient
  user: User | null
  session: Session | null
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Create the Supabase client
  const [supabase] = useState(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      return createClient("https://example.com", "dummy-key") // Return a dummy client to avoid errors
    }
    return createClient(supabaseUrl, supabaseAnonKey)
  })

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Handle hash fragment authentication (for OAuth redirects)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we have a hash fragment with an access token
      const hasHashFragment = window.location.hash && window.location.hash.includes("access_token")

      if (hasHashFragment) {
        // Let Supabase handle the hash fragment
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
          setUser(session?.user || null)

          // Remove the hash fragment from the URL
          window.history.replaceState(null, "", window.location.pathname + window.location.search)
        })
      }
    }
  }, [supabase])

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false)
      return
    }

    const getSession = async () => {
      try {
        setLoading(true)

        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(session)
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    // Initial session fetch
    getSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, supabaseAnonKey, supabaseUrl])

  return (
    <Context.Provider
      value={{
        supabase,
        user,
        session,
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
