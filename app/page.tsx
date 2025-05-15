"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Car, ChevronRight, MapPin, Shield, Star, Zap } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export default function Home() {
  const { user, signIn } = useSupabase()
  const [featuredCars, setFeaturedCars] = useState([
    {
      id: 1,
      name: "Tesla Model S Plaid",
      brand: "Tesla",
      category: "Electric",
      daily_rate: 299,
      image_url: "/placeholder.svg?height=300&width=500",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Lamborghini Huracán",
      brand: "Lamborghini",
      category: "Supercar",
      daily_rate: 899,
      image_url: "/placeholder.svg?height=300&width=500",
      rating: 5.0,
    },
    {
      id: 3,
      name: "Range Rover Sport",
      brand: "Land Rover",
      category: "SUV",
      daily_rate: 399,
      image_url: "/placeholder.svg?height=300&width=500",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Mercedes-AMG GT",
      brand: "Mercedes-Benz",
      category: "Sports",
      daily_rate: 599,
      image_url: "/placeholder.svg?height=300&width=500",
      rating: 4.8,
    },
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="hero-pattern absolute inset-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 text-sm rounded-full border-primary/50">
                #DriveInStyle
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
                  <Link href="/cars">
                    Browse Cars
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="#how-it-works">How It Works</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                      <Image
                        src={`/generic-user-icon.png?height=32&width=32&text=User${i}`}
                        alt={`User ${i}`}
                        width={32}
                        height={32}
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
                  src="/placeholder.svg?height=400&width=600&text=Luxury+Car"
                  alt="Luxury Car"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-xl shadow-lg card-blur">
                <div className="flex items-center space-x-3">
                  <Car className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Premium Selection</p>
                    <p className="text-xs text-muted-foreground">100+ Luxury Cars</p>
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
                <Link href="/cars">Search Available Cars</Link>
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
            <Link href="/cars" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:underline">
              View all cars
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {featuredCars.map((car) => (
                <CarouselItem key={car.id} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div whileHover={{ y: -10, transition: { duration: 0.2 } }} className="p-2">
                    <Card className="overflow-hidden border-0 shadow-lg">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={car.image_url || "/placeholder.svg"}
                          alt={car.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
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
                            <Link href={`/cars/${car.id}`}>Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
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

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Car className="h-10 w-10 text-primary" />,
                title: "Choose Your Car",
                description:
                  "Browse our extensive collection of luxury vehicles and select the perfect car for your needs.",
              },
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Book Your Dates",
                description:
                  "Select your pick-up and return dates, and complete the booking with our secure payment system.",
              },
              {
                icon: <MapPin className="h-10 w-10 text-primary" />,
                title: "Enjoy The Ride",
                description: "Pick up your car at the designated location and enjoy the ultimate driving experience.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-background rounded-2xl p-6 shadow-md relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform"></div>
                <div className="relative z-10">
                  <div className="mb-4 p-3 bg-primary/10 rounded-xl inline-block">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                <div className="absolute bottom-4 right-4 text-4xl font-bold text-muted/10">{index + 1}</div>
              </motion.div>
            ))}
          </motion.div>
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
                avatar: "/placeholder.svg?height=64&width=64&text=AJ",
                rating: 5,
                text: "The Tesla Model S was amazing! Super clean, fully charged, and the pickup process was seamless. Will definitely rent again!",
              },
              {
                name: "Sophia Williams",
                avatar: "/placeholder.svg?height=64&width=64&text=SW",
                rating: 5,
                text: "I rented a Lamborghini for my anniversary and it made the weekend unforgettable. The car was in perfect condition and the staff was incredibly helpful.",
              },
              {
                name: "Michael Chen",
                avatar: "/placeholder.svg?height=64&width=64&text=MC",
                rating: 4,
                text: "Great experience overall. The Range Rover was perfect for our family trip. The only reason for 4 stars is that pickup took a bit longer than expected.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-2xl p-6 shadow-md border"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Luxury on Wheels?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have experienced the thrill of driving their dream cars. Your
                adventure awaits!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/cars">Browse Cars</Link>
                </Button>
                {!user && (
                  <Button size="lg" variant="outline" className="rounded-full" onClick={() => signIn()}>
                    Sign Up Now
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Fully Insured",
                description: "All our vehicles come with comprehensive insurance coverage for your peace of mind.",
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                title: "Instant Booking",
                description: "Book your dream car in minutes with our streamlined reservation process.",
              },
              {
                icon: <MapPin className="h-8 w-8 text-primary" />,
                title: "Flexible Pickup",
                description: "Choose from multiple convenient pickup locations across the city.",
              },
              {
                icon: <Star className="h-8 w-8 text-primary" />,
                title: "Premium Service",
                description: "Experience our white-glove service with 24/7 customer support.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
