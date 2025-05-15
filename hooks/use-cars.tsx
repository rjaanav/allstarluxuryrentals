"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { Car } from "@/types"

export function useCars() {
  const { supabase } = useSupabase()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCars = async (filters?: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    available?: boolean
  }) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from("cars").select("*")

      // Apply filters if provided
      if (filters) {
        if (filters.category) {
          query = query.eq("category", filters.category)
        }

        if (filters.brand) {
          query = query.eq("brand", filters.brand)
        }

        if (filters.minPrice !== undefined) {
          query = query.gte("daily_rate", filters.minPrice)
        }

        if (filters.maxPrice !== undefined) {
          query = query.lte("daily_rate", filters.maxPrice)
        }

        if (filters.available !== undefined) {
          query = query.eq("is_available", filters.available)
        }
      }

      const { data, error } = await query.order("daily_rate", { ascending: true })

      if (error) {
        throw error
      }

      setCars(data || [])
    } catch (err) {
      console.error("Error fetching cars:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch cars"))
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedCars = async (limit = 4): Promise<Car[]> => {
    try {
      // Get cars with is_available = true, ordered by daily_rate descending (premium cars first)
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("is_available", true)
        .order("daily_rate", { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      console.error("Error fetching featured cars:", err)
      return []
    }
  }

  const getCarById = async (id: string): Promise<Car | null> => {
    try {
      const { data, error } = await supabase.from("cars").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      console.error(`Error fetching car with ID ${id}:`, err)
      return null
    }
  }

  const getCarCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase.from("cars").select("category").order("category")

      if (error) {
        throw error
      }

      // Extract unique categories
      const categories = [...new Set(data.map((car) => car.category))]
      return categories
    } catch (err) {
      console.error("Error fetching car categories:", err)
      return []
    }
  }

  const getCarBrands = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase.from("cars").select("brand").order("brand")

      if (error) {
        throw error
      }

      // Extract unique brands
      const brands = [...new Set(data.map((car) => car.brand))]
      return brands
    } catch (err) {
      console.error("Error fetching car brands:", err)
      return []
    }
  }

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars()
  }, [])

  return {
    cars,
    loading,
    error,
    fetchCars,
    getFeaturedCars,
    getCarById,
    getCarCategories,
    getCarBrands,
  }
}
