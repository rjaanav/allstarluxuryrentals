"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { FAQ } from "@/types"

export function useFAQs() {
  const { supabase } = useSupabase()
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchFAQs = async (category?: string) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from("faqs").select("*")

      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query.order("id")

      if (error) {
        throw error
      }

      setFAQs(data || [])
    } catch (err) {
      console.error("Error fetching FAQs:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch FAQs"))
    } finally {
      setLoading(false)
    }
  }

  const getFAQCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase.from("faqs").select("category").order("category")

      if (error) {
        throw error
      }

      // Extract unique categories
      const categories = [...new Set(data.map((faq) => faq.category))]
      return categories
    } catch (err) {
      console.error("Error fetching FAQ categories:", err)
      return []
    }
  }

  // Fetch FAQs on component mount
  useEffect(() => {
    fetchFAQs()
  }, [])

  return {
    faqs,
    loading,
    error,
    fetchFAQs,
    getFAQCategories,
  }
}
