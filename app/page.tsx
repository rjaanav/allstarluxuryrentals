"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Car, ChevronRight, MapPin, Shield, Star, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
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

// Featured luxury car images from Unsplash
const featuredCars = [
  {
    id: "1",
    name: "Porsche 911 GT3",
    brand: "Porsche",
    category: "Sports",
    daily_rate: 899,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Lamborghini Huracán",
    brand: "Lamborghini",
    category: "Supercar",
    daily_rate: 1299,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&h=500&fit=crop",
  },
  {
    id: "3",
    name: "Ferrari F8 Tributo",
    brand: "Ferrari",
    category: "Supercar",
    daily_rate: 1199,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=500&fit=crop",
  },
]

export default function Home() {
  const { user } = useSupabase()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="hero-pattern absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 text-sm rounded-full border-primary/50">
                DriveInStyle
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Rent Your Dream Car <span className="gradient-text">Today</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Experience the thrill of driving the world's most luxurious cars. No commitments, just pure driving
                pleasure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/fleet">
                    Browse Fleet
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="#how-it-works">How It Works</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
                    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop",
                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=32&h=32&fit=crop",
                  ].map((avatar, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                      <Image
                        src={avatar || "/placeholder.svg"}
                        alt={`User ${i + 1}`}
                        width={32}
                        height={32}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-muted-foreground"> from 2,000+ reviews</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
                  alt="Luxury Car"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-xl shadow-lg card-blur">
                <div className="flex items-center space-x-3">
                  <Car className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Premium Selection</p>
                    <p className="text-xs text-muted-foreground">20+ Luxury Cars</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-background p-4 rounded-xl shadow-lg card-blur">
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Instant Booking</p>
                    <p className="text-xs text-muted-foreground">Ready in Minutes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      {/* Search Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-2xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Find Your Perfect Ride</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Pick-up location" className="pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pick-up Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Return Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-10" />
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/fleet">Search Available Fleet</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
              <p className="text-muted-foreground">Explore our handpicked selection of luxury cars</p>
            </div>
            <Link href="/fleet" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline">
              View all fleet
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <motion.div key={car.id} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
                <Card className="overflow-hidden border-0 shadow-lg h-full">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 hover:bg-primary">{car.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{car.name}</h3>
                        <p className="text-sm text-muted-foreground">{car.brand}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{car.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="text-2xl font-bold">${car.daily_rate}</span>
                        <span className="text-muted-foreground text-sm">/day</span>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-full" asChild>
                        <Link href={`/fleet/${car.id}`}>Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Renting your dream car has never been easier. Follow these simple steps and hit the road in style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Car className="h-10 w-10 text-primary" />,
                title: "Choose Your Car",
                description:
                  "Browse our extensive collection of luxury vehicles and select the perfect car for your needs.",
                image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=300&fit=crop",
              },
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Book Your Dates",
                description:
                  "Select your pick-up and return dates, and complete the booking with our secure payment system.",
                image: "https://images.unsplash.com/photo-1533749047139-189de3cf06d3?w=500&h=300&fit=crop",
              },
              {
                icon: <MapPin className="h-10 w-10 text-primary" />,
                title: "Enjoy The Ride",
                description: "Pick up your car at the designated location and enjoy the ultimate driving experience.",
                image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&h=300&fit=crop",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-6 shadow-md relative overflow-hidden group h-full flex flex-col"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform"></div>
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-4 p-3 bg-primary/10 rounded-xl inline-block">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <div className="mt-auto h-40 rounded-lg overflow-hidden">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={500}
                      height={300}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 text-4xl font-bold text-muted/10">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their Allstar experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=64&h=64&fit=crop",
                rating: 5,
                text: "The Tesla Model S was amazing! Super clean, fully charged, and the pickup process was seamless. Will definitely rent again!",
              },
              {
                name: "Sophia Williams",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop",
                rating: 5,
                text: "I rented a Lamborghini for my anniversary and it made the weekend unforgettable. The car was in perfect condition and the staff was incredibly helpful.",
              },
              {
                name: "Michael Chen",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop",
                rating: 4,
                text: "Great experience overall. The Range Rover was perfect for our family trip. The only reason for 4 stars is that pickup took a bit longer than expected.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-background rounded-2xl p-6 shadow-md border h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Luxury on Wheels?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have experienced the thrill of driving their dream cars. Your
                adventure awaits!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/fleet">Browse Fleet</Link>
                </Button>
                {isMounted && !user && (
                  <Button size="lg" variant="outline" className="rounded-full" onClick={() => setShowAuthModal(true)}>
                    Sign Up Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Fully Insured",
                description: "All our vehicles come with comprehensive insurance coverage for your peace of mind.",
                image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=300&fit=crop",
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                title: "Instant Booking",
                description: "Book your dream car in minutes with our streamlined reservation process.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
              },
              {
                icon: <Star className="h-8 w-8 text-primary" />,
                title: "Premium Service",
                description: "Experience our white-glove service with 24/7 customer support.",
                image: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=500&h=300&fit=crop",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 h-full">
                <div className="mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="mt-auto w-full h-40 rounded-lg overflow-hidden">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
