"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Car, MapPin, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function BookingsPage() {
  const router = useRouter()
  const { user, signIn, supabase } = useSupabase()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelBookingId, setCancelBookingId] = useState(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Mock bookings data for development
  const mockBookings = [
    {
      id: 1,
      car: {
        id: 1,
        name: "Tesla Model S Plaid",
        brand: "Tesla",
        image_url: "/placeholder.svg?height=200&width=300&text=Tesla+Model+S",
        daily_rate: 299,
      },
      start_date: "2023-06-15T10:00:00Z",
      end_date: "2023-06-18T10:00:00Z",
      total_amount: 897,
      status: "completed",
      pickup_location: "Downtown Luxury Center",
    },
    {
      id: 2,
      car: {
        id: 2,
        name: "Lamborghini Huracán",
        brand: "Lamborghini",
        image_url: "/placeholder.svg?height=200&width=300&text=Lamborghini+Huracan",
        daily_rate: 899,
      },
      start_date: "2023-07-20T14:00:00Z",
      end_date: "2023-07-22T14:00:00Z",
      total_amount: 1798,
      status: "upcoming",
      pickup_location: "Airport Terminal 1",
    },
    {
      id: 3,
      car: {
        id: 3,
        name: "Range Rover Sport",
        brand: "Land Rover",
        image_url: "/placeholder.svg?height=200&width=300&text=Range+Rover+Sport",
        daily_rate: 399,
      },
      start_date: "2023-08-05T12:00:00Z",
      end_date: "2023-08-10T12:00:00Z",
      total_amount: 1995,
      status: "upcoming",
      pickup_location: "Westside Premium Garage",
    },
    {
      id: 4,
      car: {
        id: 4,
        name: "Mercedes-AMG GT",
        brand: "Mercedes-Benz",
        image_url: "/placeholder.svg?height=200&width=300&text=Mercedes+AMG+GT",
        daily_rate: 599,
      },
      start_date: "2023-05-10T09:00:00Z",
      end_date: "2023-05-12T09:00:00Z",
      total_amount: 1198,
      status: "cancelled",
      pickup_location: "Downtown Luxury Center",
    },
  ]

  useEffect(() => {
    if (!user) {
      return
    }

    // In a real app, we would fetch from Supabase
    // const fetchBookings = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('bookings')
    //       .select(`
    //         *,
    //         car:car_id (*)
    //       `)
    //       .eq('user_id', user.id)
    //       .order('start_date', { ascending: false })
    //
    //     if (error) throw error
    //     setBookings(data)
    //   } catch (error) {
    //     console.error('Error fetching bookings:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // fetchBookings()

    // Using mock data for now
    setBookings(mockBookings)
    setLoading(false)
  }, [user])

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true }
    return new Date(dateString).toLocaleTimeString("en-US", options)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/90 hover:bg-green-500"
      case "upcoming":
        return "bg-blue-500/90 hover:bg-blue-500"
      case "active":
        return "bg-yellow-500/90 hover:bg-yellow-500"
      case "cancelled":
        return "bg-red-500/90 hover:bg-red-500"
      default:
        return "bg-gray-500/90 hover:bg-gray-500"
    }
  }

  const handleCancelBooking = async (bookingId) => {
    // In a real app, we would update the booking status in Supabase
    // const { error } = await supabase
    //   .from('bookings')
    //   .update({ status: 'cancelled' })
    //   .eq('id', bookingId)

    // For now, just update the local state
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))
    setShowCancelDialog(false)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Car className="h-16 w-16 mx-auto text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Sign In to View Your Bookings</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your booking history and manage your reservations.
          </p>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-muted-foreground mb-8">View and manage your car rental bookings</p>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {["all", "upcoming", "completed", "cancelled"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                {bookings
                  .filter((booking) => tabValue === "all" || booking.status === tabValue)
                  .map((booking) => (
                    <motion.div key={booking.id} variants={fadeIn}>
                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative h-48 md:h-full">
                              <Image
                                src={booking.car.image_url || "/placeholder.svg"}
                                alt={booking.car.name}
                                fill
                                className="object-cover"
                              />
                              <Badge className={`absolute top-3 right-3 ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="col-span-3 p-6">
                              <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-bold">{booking.car.name}</h3>
                                  <p className="text-muted-foreground">{booking.car.brand}</p>
                                </div>
                                <div className="mt-2 md:mt-0 text-right">
                                  <p className="text-lg font-semibold">${booking.total_amount}</p>
                                  <p className="text-sm text-muted-foreground">${booking.car.daily_rate}/day</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-start">
                                  <Calendar className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                  <div>
                                    <p className="font-medium">Rental Period</p>
                                    <p className="text-sm">
                                      {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <Clock className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                  <div>
                                    <p className="font-medium">Pickup Time</p>
                                    <p className="text-sm">{formatTime(booking.start_date)}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                  <div>
                                    <p className="font-medium">Pickup Location</p>
                                    <p className="text-sm">{booking.pickup_location}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <Car className="h-5 w-5 text-primary mt-0.5 mr-2" />
                                  <div>
                                    <p className="font-medium">Booking ID</p>
                                    <p className="text-sm">#{booking.id.toString().padStart(6, "0")}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/cars/${booking.car.id}`}>View Car</Link>
                                </Button>

                                {booking.status === "upcoming" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setCancelBookingId(booking.id)
                                        setShowCancelDialog(true)
                                      }}
                                      className="text-red-500 border-red-500 hover:bg-red-500/10"
                                    >
                                      Cancel Booking
                                    </Button>
                                    <Button asChild size="sm">
                                      <Link href={`/bookings/${booking.id}/modify`}>Modify Booking</Link>
                                    </Button>
                                  </>
                                )}

                                {booking.status === "completed" && (
                                  <Button asChild size="sm">
                                    <Link href={`/reviews/add?booking=${booking.id}`}>Write Review</Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                {bookings.filter((booking) => tabValue === "all" || booking.status === tabValue).length === 0 && (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No {tabValue} bookings</h3>
                    <p className="text-muted-foreground mb-6">
                      {tabValue === "all"
                        ? "You haven't made any bookings yet."
                        : `You don't have any ${tabValue} bookings.`}
                    </p>
                    <Button asChild>
                      <Link href="/cars">Browse Cars</Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm">Cancellations made less than 48 hours before pickup may incur a fee.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={() => cancelBookingId && handleCancelBooking(cancelBookingId)}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
