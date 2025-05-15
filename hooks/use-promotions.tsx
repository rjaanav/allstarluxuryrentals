"use client"

import { useState } from "react"
import type { Promotion } from "@/types"

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPromotions = async () => {
    // Return empty array instead of fetching
    return []
  }

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
  }
}
