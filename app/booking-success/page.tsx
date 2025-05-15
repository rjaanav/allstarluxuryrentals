"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Calendar, MapPin, Car, ArrowRight } from "lucide-react"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const checkmarkAnimation = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
}

export default function BookingSuccessPage() {
  const router = useRouter()
  const { user } = useSupabase()

  // Mock booking data for development
  const mockBooking = {
    id: 5,
    car: {
      id: 2,
      name: "Lamborghini Huracán",
      brand: "Lamborghini",
      image_url: "/placeholder.svg?height=200&width=300&text=Lamborghini+Huracan",
    },
    start_date: "2023-09-15T10:00:00Z",
    end_date: "2023-09-18T10:00:00Z",
    pickup_location: "Downtown Luxury Center",
    total_amount: 2697,
  }

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true }
    return new Date(dateString).toLocaleTimeString("en-US", options)
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-12">
          <div className="inline-block p-4 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your luxury car rental has been successfully booked. We've sent a confirmation email with all the details.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-12">
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <p className="text-sm text-muted-foreground">
                  Booking ID: #{mockBooking.id.toString().padStart(6, "0")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Car</p>
                  <p className="font-medium">{mockBooking.car.name}</p>
                  <p className="text-sm">{mockBooking.car.brand}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-xl">${mockBooking.total_amount}</p>
                  <p className="text-sm">Payment Completed</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pickup Date & Time</p>
                  <p className="font-medium">{formatDate(mockBooking.start_date)}</p>
                  <p className="text-sm">{formatTime(mockBooking.start_date)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Return Date & Time</p>
                  <p className="font-medium">{formatDate(mockBooking.end_date)}</p>
                  <p className="text-sm">{formatTime(mockBooking.end_date)}</p>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-medium">{mockBooking.pickup_location}</p>
                  <p className="text-sm">Please bring your driver's license and the credit card used for booking.</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-medium">Add to Calendar: </span>
                    <a href="#" className="text-primary hover:underline">
                      Google
                    </a>{" "}
                    •
                    <a href="#" className="text-primary hover:underline ml-1">
                      iCal
                    </a>{" "}
                    •
                    <a href="#" className="text-primary hover:underline ml-1">
                      Outlook
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
          <h2 className="text-xl font-bold">What's Next?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Prepare for Pickup</h3>
                  <p className="text-sm text-muted-foreground">
                    Bring your driver's license and the credit card used for booking.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Arrive at Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Our staff will assist you with the paperwork and car handover.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Enjoy Your Ride</h3>
                  <p className="text-sm text-muted-foreground">
                    Hit the road and enjoy your luxury driving experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button asChild variant="outline">
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
