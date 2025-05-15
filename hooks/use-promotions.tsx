"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { Promotion } from "@/types"

export function usePromotions() {
  const { supabase } = useSupabase()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPromotions = async () => {
    setLoading(true)
    setError(null)

    try {
      const currentDate = new Date().toISOString()

      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .lte("valid_from", currentDate)
        .gte("valid_to", currentDate)
        .order("discount_percentage", { ascending: false })

      if (error) {
        throw error
      }

      setPromotions(data || [])
    } catch (err) {
      console.error("Error fetching promotions:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch promotions"))
    } finally {
      setLoading(false)
    }
  }

  const validatePromoCode = async (code: string): Promise<Promotion | null> => {
    setLoading(true)
    setError(null)

    try {
      const currentDate = new Date().toISOString()

      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("code", code)
        .lte("valid_from", currentDate)
        .gte("valid_to", currentDate)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      console.error("Error validating promo code:", err)
      setError(err instanceof Error ? err : new Error("Invalid or expired promo code"))
      return null
    } finally {
      setLoading(false)
    }
  }

  // Fetch promotions on component mount
  useEffect(() => {
    fetchPromotions()
  }, [])

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    validatePromoCode,
  }
}
