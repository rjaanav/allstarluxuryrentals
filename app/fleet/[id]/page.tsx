"use client"

import React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format, addDays, differenceInDays } from "date-fns"
import { motion } from "framer-motion"
import { useCars } from "@/hooks/use-cars"
import { useBookings } from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { useToastContext } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowRight, CalendarIcon, Check, Fuel, Gauge, Shield, Sliders, Star, Users, Zap } from "lucide-react"

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { getCarById } = useCars()
  const { createBooking } = useBookings()
  const { user } = useAuth()
  const { success, error: showError } = useToastContext()
  const router = useRouter()

  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: new Date(),
    to: addDays(new Date(), 3),
  })
  const [days, setDays] = useState(3)
  const [total, setTotal] = useState(0)

  // Get appropriate image URL for specific cars
  const getCarImageUrl = (car: any) => {
    // Return specific image URLs for the listed cars
    if (car.brand === "Audi" && car.model === "e-tron GT") {
      return "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=1200&auto=format&fit=crop"
    } else if (car.brand === "Range Rover" && car.model === "Sport") {
      return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop"
    } else if (car.brand === "Lamborghini" && car.model === "Huracan") {
      return "https://images.unsplash.com/photo-1636866120504-81110da6e04f?w=1200&auto=format&fit=crop"
    } else if (car.brand === "Maserati" && car.model === "MC20") {
      return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop"
    } else if (car.brand === "Rolls Royce" && car.model === "Ghost") {
      return "https://images.unsplash.com/photo-1631295868223-63265b40d9cc?w=1200&auto=format&fit=crop"
    }

    // Default to the car's image_url or a generic placeholder
    return car.image_url || "/placeholder.svg?height=600&width=800&text=" + encodeURIComponent(car.name)
  }

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true)
      
      try {
        const carData = await getCarById(id)
        setCar(carData)
      } catch (error) {
        console.error("Error in fetchCar:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCar()
    }
  }, [id]) // Temporarily removed getCarById to test

  useEffect(() => {
    if (car && dateRange.from && dateRange.to) {
      const numberOfDays = differenceInDays(dateRange.to, dateRange.from) + 1
      setDays(numberOfDays)
      setTotal(car.daily_rate * numberOfDays)
    }
  }, [car, dateRange])

  const handleDateChange = (range: any) => {
    setDateRange(range)
  }

  const handleBooking = async () => {
    if (!user) {
      showError("Please sign in to book a car.")
      return
    }

    if (!dateRange.from || !dateRange.to) {
      showError("Please select both pickup and return dates.")
      return
    }

    try {
      const booking = await createBooking(
        car.id,
        dateRange.from,
        dateRange.to,
        total
      )

      if (booking) {
        success("Your car has been booked successfully.")
        router.push("/booking-success")
      }
    } catch (error) {
      console.error("Booking error:", error)
      showError("There was an error processing your booking. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Car Not Found</h3>
          <p className="text-muted-foreground">The car you're looking for does not exist or has been removed.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/fleet">Browse Cars</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Car Image and Details */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4 md:mb-6">
            <Image src={getCarImageUrl(car) || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{car.name}</h1>
          <div className="flex items-center mb-2 md:mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-medium">4.8</span>
              <span className="text-muted-foreground text-sm ml-1">(24 reviews)</span>
            </div>
            <span className="text-muted-foreground text-sm">
              {car.brand} • {car.model} • {car.year}
            </span>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6">{car.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {car.features && typeof car.features === "object" && (
              <>
                {car.features.seats && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span>{car.features.seats} Seats</span>
                  </div>
                )}
                {car.features.power && (
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-primary" />
                    <span>{car.features.power}</span>
                  </div>
                )}
                {car.features.transmission && (
                  <div className="flex items-center">
                    <Sliders className="h-5 w-5 mr-2 text-primary" />
                    <span>{car.features.transmission}</span>
                  </div>
                )}
                {car.category === "Electric" && car.features.range ? (
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-primary" />
                    <span>{car.features.range}</span>
                  </div>
                ) : car.features.engine ? (
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 mr-2 text-primary" />
                    <span>{car.features.engine}</span>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-3">Included in Every Rental</h2>
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span>Free Cancellation up to 24 hours before pickup</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span>Collision Damage Waiver with $0 Excess</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span>Theft Protection</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              <span>Unlimited Mileage</span>
            </div>
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Book This Car</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Daily Rate</span>
                    <span className="font-medium">${car.daily_rate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Duration</span>
                    <span>{days} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Select Dates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Pick-up Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={handleDateChange}
                        numberOfMonths={1}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "Return Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={handleDateChange}
                        numberOfMonths={1}
                        disabled={(date) => date < dateRange.from || date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full text-base py-6" onClick={handleBooking}>
                  Book Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex items-start space-x-2 text-muted-foreground text-sm">
                  <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>Free cancellation up to 24 hours before pickup for a full refund</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
