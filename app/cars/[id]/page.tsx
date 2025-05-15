"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ChevronLeft,
  Star,
  CalendarIcon,
  Users,
  Gauge,
  Sliders,
  Fuel,
  Zap,
  Shield,
  Check,
  MapPin,
  Clock,
  Info,
} from "lucide-react"

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { supabase, user, signIn } = useSupabase()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  })
  const [totalDays, setTotalDays] = useState(3)
  const [totalPrice, setTotalPrice] = useState(0)

  // Mock car data for development
  const mockCar = {
    id: 1,
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    model: "Model S",
    year: 2023,
    daily_rate: 299,
    category: "Electric",
    image_url: "/placeholder.svg?height=500&width=800&text=Tesla+Model+S",
    gallery: [
      "/placeholder.svg?height=300&width=500&text=Tesla+Front",
      "/placeholder.svg?height=300&width=500&text=Tesla+Side",
      "/placeholder.svg?height=300&width=500&text=Tesla+Interior",
      "/placeholder.svg?height=300&width=500&text=Tesla+Rear",
    ],
    description:
      "Experience the future of driving with the Tesla Model S Plaid. This all-electric sedan offers incredible performance with 0-60 mph in just 1.99 seconds. With its sleek design, cutting-edge technology, and impressive range, the Model S Plaid represents the pinnacle of electric vehicle engineering.",
    features: {
      seats: 5,
      doors: 4,
      transmission: "Automatic",
      range: "396 miles",
      power: "1,020 hp",
      acceleration: "0-60 mph in 1.99s",
      topSpeed: "200 mph",
      autopilot: true,
      chargingTime: "15 min for 200 miles (Supercharger)",
    },
    included: [
      "Comprehensive insurance",
      "24/7 roadside assistance",
      "Unlimited mileage",
      "Free cancellation up to 48 hours before pickup",
      "Charging cable included",
      "GPS navigation",
    ],
    rating: 4.9,
    reviews: [
      {
        id: 1,
        user: "Alex Johnson",
        avatar: "/placeholder.svg?height=64&width=64&text=AJ",
        rating: 5,
        date: "2023-04-15",
        comment:
          "Amazing car! The acceleration is mind-blowing and the autopilot feature made highway driving a breeze. Definitely worth every penny.",
      },
      {
        id: 2,
        user: "Sophia Williams",
        avatar: "/placeholder.svg?height=64&width=64&text=SW",
        rating: 5,
        date: "2023-03-22",
        comment:
          "Rented this for a weekend trip and it was perfect. Super clean, fully charged, and the pickup process was seamless. Will definitely rent again!",
      },
      {
        id: 3,
        user: "Michael Chen",
        avatar: "/placeholder.svg?height=64&width=64&text=MC",
        rating: 4,
        date: "2023-02-10",
        comment:
          "Great car with impressive technology. The only reason for 4 stars is that I had to spend some time figuring out all the features. Otherwise, fantastic experience.",
      },
    ],
    is_available: true,
    pickup_locations: ["Downtown Luxury Center", "Airport Terminal 1", "Westside Premium Garage"],
  }

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // const fetchCar = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('cars')
    //       .select('*')
    //       .eq('id', params.id)
    //       .single()
    //
    //     if (error) throw error
    //     setCar(data)
    //   } catch (error) {
    //     console.error('Error fetching car:', error)
    //     router.push('/cars')
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // fetchCar()

    // Using mock data for now
    setCar(mockCar)
    setLoading(false)
  }, [params.id])

  useEffect(() => {
    if (car && dateRange.from && dateRange.to) {
      const days = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))
      setTotalDays(days)
      setTotalPrice(days * car.daily_rate)
    }
  }, [dateRange, car])

  const handleBooking = async () => {
    if (!user) {
      signIn()
      return
    }

    // In a real app, we would create a booking in Supabase
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .insert({
    //     user_id: user.id,
    //     car_id: car.id,
    //     start_date: dateRange.from,
    //     end_date: dateRange.to,
    //     total_amount: totalPrice,
    //     status: 'pending'
    //   })

    // For now, just navigate to a success page
    router.push("/booking-success")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Car not found</h1>
        <p className="mb-6">The car you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/cars">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/cars">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{car.name}</h1>
            <div className="flex items-center mt-2">
              <Badge className="mr-2">{car.category}</Badge>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span>{car.rating}</span>
                <span className="mx-1">•</span>
                <span className="text-muted-foreground">{car.reviews.length} reviews</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <span className="text-3xl font-bold">${car.daily_rate}</span>
              <span className="text-muted-foreground text-sm">/day</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden mb-4"
          >
            <Image src={car.image_url || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
          </motion.div>

          {/* Gallery */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {car.gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative h-24 rounded-lg overflow-hidden cursor-pointer"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${car.name} - Image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground">{car.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">What's Included</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.included.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Pickup Locations</h3>
                  <ul className="space-y-2">
                    {car.pickup_locations.map((location, index) => (
                      <li key={index} className="flex items-center">
                        <MapPin className="h-5 w-5 text-primary mr-2" />
                        <span>{location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="pt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-3">Car Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Seats</p>
                      <p className="text-muted-foreground">{car.features.seats} Passengers</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Power</p>
                      <p className="text-muted-foreground">{car.features.power}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Sliders className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Transmission</p>
                      <p className="text-muted-foreground">{car.features.transmission}</p>
                    </div>
                  </div>
                  {car.category === "Electric" ? (
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium">Range</p>
                        <p className="text-muted-foreground">{car.features.range}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Fuel className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium">Engine</p>
                        <p className="text-muted-foreground">{car.features.engine}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Acceleration</p>
                      <p className="text-muted-foreground">{car.features.acceleration}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Top Speed</p>
                      <p className="text-muted-foreground">{car.features.topSpeed}</p>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="additional">
                    <AccordionTrigger>Additional Features</AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Climate Control</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Premium Sound System</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Bluetooth Connectivity</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Leather Interior</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Backup Camera</span>
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Parking Sensors</span>
                        </li>
                        {car.features.autopilot && (
                          <li className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>Autopilot</span>
                          </li>
                        )}
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>USB Charging Ports</span>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold">{car.rating}</span>
                    <span className="text-muted-foreground ml-1">({car.reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {car.reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="border rounded-xl p-4"
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                          <Image src={review.avatar || "/placeholder.svg"} alt={review.user} width={40} height={40} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{review.user}</h4>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-background rounded-xl border shadow-lg p-6 sticky top-24"
          >
            <h3 className="text-xl font-semibold mb-4">Book This Car</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Rental Period</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pick-up Date</p>
                  <div className="flex items-center border rounded-md p-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{dateRange.from ? format(dateRange.from, "PPP") : "Select date"}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Return Date</p>
                  <div className="flex items-center border rounded-md p-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{dateRange.to ? format(dateRange.to, "PPP") : "Select date"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="rounded-md border"
                  disabled={{ before: new Date() }}
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Rate</span>
                <span>${car.daily_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days</span>
                <span>{totalDays}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <Button className="w-full mb-4" size="lg" onClick={handleBooking}>
              {user ? "Book Now" : "Sign In to Book"}
            </Button>

            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <span>Free cancellation up to 48 hours before pickup</span>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">Secure payment & booking</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
