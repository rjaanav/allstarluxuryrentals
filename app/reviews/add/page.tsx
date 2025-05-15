"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Star, Car, ArrowLeft } from "lucide-react"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function AddReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking")
  const { user, signIn, supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [booking, setBooking] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)

  // Mock booking data for development
  const mockBooking = {
    id: 1,
    car: {
      id: 1,
      name: "Tesla Model S Plaid",
      brand: "Tesla",
      image_url: "/placeholder.svg?height=200&width=300&text=Tesla+Model+S",
    },
    start_date: "2023-06-15T10:00:00Z",
    end_date: "2023-06-18T10:00:00Z",
  }

  useEffect(() => {
    if (!user) {
      return
    }

    if (bookingId) {
      // In a real app, we would fetch from Supabase
      // const fetchBooking = async () => {
      //   try {
      //     const { data, error } = await supabase
      //       .from('bookings')
      //       .select(`
      //         *,
      //         car:car_id (*)
      //       `)
      //       .eq('id', bookingId)
      //       .eq('user_id', user.id)
      //       .single()
      //
      //     if (error) throw error
      //     setBooking(data)
      //   } catch (error) {
      //     console.error('Error fetching booking:', error)
      //     router.push('/bookings')
      //   } finally {
      //     setLoading(false)
      //   }
      // }
      //
      // fetchBooking()

      // Using mock data for now
      setBooking(mockBooking)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [user, bookingId, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before submitting your review.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // In a real app, we would submit to Supabase
    // try {
    //   const { data, error } = await supabase
    //     .from('reviews')
    //     .insert({
    //       booking_id: booking.id,
    //       user_id: user.id,
    //       car_id: booking.car.id,
    //       rating,
    //       comment,
    //     })
    //
    //   if (error) throw error
    //
    //   toast({
    //     title: "Review submitted",
    //     description: "Thank you for sharing your experience!",
    //   })
    //
    //   router.push('/reviews')
    // } catch (error) {
    //   console.error('Error submitting review:', error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to submit review. Please try again.",
    //     variant: "destructive",
    //   })
    //   setSubmitting(false)
    // }

    // For now, just show a success message and redirect
    setTimeout(() => {
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      })
      router.push("/reviews")
    }, 1500)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Star className="h-16 w-16 mx-auto text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Sign In to Write a Review</h1>
          <p className="text-muted-foreground mb-6">Please sign in to share your experience with our luxury cars.</p>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/reviews">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reviews
        </Link>
      </Button>

      <div className="max-w-2xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
          <p className="text-muted-foreground mb-8">
            Share your experience to help other customers make informed decisions
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Rental Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {booking ? (
                    <div className="mb-6 flex items-center">
                      <div className="relative w-20 h-20 rounded overflow-hidden mr-4">
                        <Image
                          src={booking.car.image_url || "/placeholder.svg"}
                          alt={booking.car.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{booking.car.name}</h3>
                        <p className="text-sm text-muted-foreground">{booking.car.brand}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <p className="text-center text-muted-foreground">
                        You're writing a general review. Select a car from our fleet below.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {[1, 2, 3].map((id) => (
                          <Button
                            key={id}
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center"
                            onClick={() => setBooking({ car: { id, name: `Car ${id}`, brand: "Brand" } })}
                          >
                            <Car className="h-8 w-8 mb-2" />
                            <span>Select Car</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block font-medium mb-2">Your Rating</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoverRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {rating ? `${rating} out of 5 stars` : "Select a rating"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="comment" className="block font-medium mb-2">
                      Your Review
                    </label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this car. What did you like or dislike? Would you recommend it to others?"
                      rows={6}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2" onClick={() => router.push("/reviews")}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
