"use client"

import { useState } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { useAuth } from "./use-auth"
import type { Booking, Car } from "@/types"
import { calculateTotalPrice } from "@/lib/utils"

export function useBookings() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createBooking = async (
    carId: number,
    startDate: Date,
    endDate: Date,
    pricePerDay: number,
  ): Promise<Booking | null> => {
    if (!user) {
      setError(new Error("You must be logged in to create a booking"))
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const totalPrice = calculateTotalPrice(pricePerDay, startDate, endDate)

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          car_id: carId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          total_price: totalPrice,
          status: "pending",
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      console.error("Error creating booking:", err)
      setError(err instanceof Error ? err : new Error("Failed to create booking"))
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserBookings = async (): Promise<(Booking & { car: Car })[]> => {
    if (!user) {
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          car:cars(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      console.error("Error fetching user bookings:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch bookings"))
      return []
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId: number): Promise<boolean> => {
    if (!user) {
      setError(new Error("You must be logged in to cancel a booking"))
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("user_id", user.id) // Ensure the booking belongs to the user

      if (error) {
        throw error
      }

      return true
    } catch (err) {
      console.error("Error cancelling booking:", err)
      setError(err instanceof Error ? err : new Error("Failed to cancel booking"))
      return false
    } finally {
      setLoading(false)
    }
  }

  const checkCarAvailability = async (carId: number, startDate: Date, endDate: Date): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // First check if the car is marked as available
      const { data: car, error: carError } = await supabase.from("cars").select("available").eq("id", carId).single()

      if (carError || !car || !car.available) {
        return false
      }

      // Then check for overlapping bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("car_id", carId)
        .neq("status", "cancelled")
        .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()}`)

      if (bookingsError) {
        throw bookingsError
      }

      // If there are any overlapping bookings, the car is not available
      return bookings.length === 0
    } catch (err) {
      console.error("Error checking car availability:", err)
      setError(err instanceof Error ? err : new Error("Failed to check availability"))
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createBooking,
    getUserBookings,
    cancelBooking,
    checkCarAvailability,
  }
}
