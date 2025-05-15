"use client"

import { useState } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { useAuth } from "./use-auth"
import type { Review } from "@/types"

export function useReviews() {
  const { supabase } = useSupabase()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createReview = async (carId: number, rating: number, comment: string): Promise<Review | null> => {
    if (!user || !profile) {
      setError(new Error("You must be logged in to create a review"))
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          car_id: carId,
          rating,
          comment,
          user_name: profile.full_name || user.email,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      console.error("Error creating review:", err)
      setError(err instanceof Error ? err : new Error("Failed to create review"))
      return null
    } finally {
      setLoading(false)
    }
  }

  const getCarReviews = async (carId: number): Promise<Review[]> => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("car_id", carId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      console.error("Error fetching car reviews:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch reviews"))
      return []
    } finally {
      setLoading(false)
    }
  }

  const getUserReviews = async (): Promise<Review[]> => {
    if (!user) {
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          cars(name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // Format the data to match the Review type
      const reviews = data.map((review) => ({
        ...review,
        car_name: review.cars?.name,
      }))

      return reviews || []
    } catch (err) {
      console.error("Error fetching user reviews:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch reviews"))
      return []
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (reviewId: number): Promise<boolean> => {
    if (!user) {
      setError(new Error("You must be logged in to delete a review"))
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId).eq("user_id", user.id) // Ensure the review belongs to the user

      if (error) {
        throw error
      }

      return true
    } catch (err) {
      console.error("Error deleting review:", err)
      setError(err instanceof Error ? err : new Error("Failed to delete review"))
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createReview,
    getCarReviews,
    getUserReviews,
    deleteReview,
  }
}
