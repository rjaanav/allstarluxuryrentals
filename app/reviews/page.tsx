"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ThumbsUp } from "lucide-react"

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

export default function ReviewsPage() {
  const { supabase } = useSupabase()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock reviews data for development
  const mockReviews = [
    {
      id: 1,
      user: {
        id: "123",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=64&width=64&text=AJ",
      },
      car: {
        id: 1,
        name: "Tesla Model S Plaid",
        brand: "Tesla",
        image_url: "/placeholder.svg?height=200&width=300&text=Tesla+Model+S",
      },
      rating: 5,
      comment:
        "Amazing car! The acceleration is mind-blowing and the autopilot feature made highway driving a breeze. Definitely worth every penny.",
      date: "2023-04-15",
      helpful_count: 12,
    },
    {
      id: 2,
      user: {
        id: "456",
        name: "Sophia Williams",
        avatar: "/placeholder.svg?height=64&width=64&text=SW",
      },
      car: {
        id: 2,
        name: "Lamborghini Huracán",
        brand: "Lamborghini",
        image_url: "/placeholder.svg?height=200&width=300&text=Lamborghini+Huracan",
      },
      rating: 5,
      comment:
        "Rented this for a weekend trip and it was perfect. Super clean, fully charged, and the pickup process was seamless. Will definitely rent again!",
      date: "2023-03-22",
      helpful_count: 8,
    },
    {
      id: 3,
      user: {
        id: "789",
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=64&width=64&text=MC",
      },
      car: {
        id: 3,
        name: "Range Rover Sport",
        brand: "Land Rover",
        image_url: "/placeholder.svg?height=200&width=300&text=Range+Rover+Sport",
      },
      rating: 4,
      comment:
        "Great car with impressive technology. The only reason for 4 stars is that I had to spend some time figuring out all the features. Otherwise, fantastic experience.",
      date: "2023-02-10",
      helpful_count: 5,
    },
    {
      id: 4,
      user: {
        id: "101",
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=64&width=64&text=ED",
      },
      car: {
        id: 4,
        name: "Mercedes-AMG GT",
        brand: "Mercedes-Benz",
        image_url: "/placeholder.svg?height=200&width=300&text=Mercedes+AMG+GT",
      },
      rating: 5,
      comment:
        "The Mercedes-AMG GT is a dream to drive. The handling is precise, the acceleration is thrilling, and the sound of the engine is music to my ears. The staff was also very helpful and professional.",
      date: "2023-01-05",
      helpful_count: 10,
    },
    {
      id: 5,
      user: {
        id: "202",
        name: "James Wilson",
        avatar: "/placeholder.svg?height=64&width=64&text=JW",
      },
      car: {
        id: 5,
        name: "Porsche 911 Turbo S",
        brand: "Porsche",
        image_url: "/placeholder.svg?height=200&width=300&text=Porsche+911",
      },
      rating: 5,
      comment:
        "The Porsche 911 Turbo S exceeded all my expectations. It's the perfect blend of luxury and performance. The car was in immaculate condition and the entire rental process was smooth and efficient.",
      date: "2022-12-18",
      helpful_count: 15,
    },
  ]

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // const fetchReviews = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('reviews')
    //       .select(`
    //         *,
    //         user:user_id (id, full_name),
    //         car:car_id (*)
    //       `)
    //       .order('created_at', { ascending: false })
    //
    //     if (error) throw error
    //     setReviews(data)
    //   } catch (error) {
    //     console.error('Error fetching reviews:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // fetchReviews()

    // Using mock data for now
    setReviews(mockReviews)
    setLoading(false)
  }, [])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const markHelpful = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, helpful_count: review.helpful_count + 1 } : review,
      ),
    )
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customer Reviews</h1>
          <p className="text-muted-foreground">See what our customers have to say about their rental experiences</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/reviews/add">Write a Review</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="5">5 Star</TabsTrigger>
          <TabsTrigger value="4">4 Star</TabsTrigger>
          <TabsTrigger value="3">3 Star & Below</TabsTrigger>
        </TabsList>

        {["all", "5", "4", "3"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                {reviews
                  .filter((review) => {
                    if (tabValue === "all") return true
                    if (tabValue === "5") return review.rating === 5
                    if (tabValue === "4") return review.rating === 4
                    if (tabValue === "3") return review.rating <= 3
                    return true
                  })
                  .map((review) => (
                    <motion.div key={review.id} variants={fadeIn}>
                      <Card>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                              <div className="flex flex-col items-center text-center">
                                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                                  <Image
                                    src={review.car.image_url || "/placeholder.svg"}
                                    alt={review.car.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <h3 className="font-semibold">{review.car.name}</h3>
                                <p className="text-sm text-muted-foreground">{review.car.brand}</p>
                                <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                                  <Link href={`/cars/${review.car.id}`}>View Car</Link>
                                </Button>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                    <Image
                                      src={review.user.avatar || "/placeholder.svg"}
                                      alt={review.user.name}
                                      width={40}
                                      height={40}
                                    />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{review.user.name}</h4>
                                    <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                                  </div>
                                </div>
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-5 w-5 ${
                                        i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <p className="mb-4">{review.comment}</p>

                              <div className="flex justify-between items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markHelpful(review.id)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Helpful ({review.helpful_count})
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  Verified Rental on {formatDate(review.date)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                {reviews.filter((review) => {
                  if (tabValue === "all") return true
                  if (tabValue === "5") return review.rating === 5
                  if (tabValue === "4") return review.rating === 4
                  if (tabValue === "3") return review.rating <= 3
                  return true
                }).length === 0 && (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
                    <p className="text-muted-foreground mb-6">There are no reviews in this category yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
