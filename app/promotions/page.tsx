import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase-server"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Promotion } from "@/types"

export const metadata: Metadata = {
  title: "Promotions - Allstar Luxury Car Rentals",
  description: "Special offers and promotions for Allstar Luxury Car Rentals",
}

async function getPromotions() {
  const supabase = createServerClient()
  const currentDate = new Date().toISOString()

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .lte("valid_from", currentDate)
    .gte("valid_to", currentDate)
    .order("discount_percentage", { ascending: false })

  if (error) {
    console.error("Error fetching promotions:", error)
    return []
  }

  return data || []
}

export default async function PromotionsPage() {
  const promotions = await getPromotions()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Special Offers</h1>

      {promotions.length === 0 ? (
        <div className="mx-auto max-w-md rounded-lg border border-gray-200 p-8 text-center dark:border-gray-700">
          <h2 className="mb-4 text-2xl font-semibold">No Current Promotions</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            We don't have any active promotions at the moment. Please check back later for new offers.
          </p>
          <Button asChild>
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion: Promotion) => (
            <Card key={promotion.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={promotion.image_url || "/placeholder.svg?height=192&width=384&query=luxury car promotion"}
                  alt={promotion.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  {promotion.discount_percentage}% OFF
                </div>
              </div>

              <CardHeader>
                <CardTitle>{promotion.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-4 text-gray-600 dark:text-gray-300">{promotion.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valid until:</p>
                    <p className="font-medium">{formatDate(promotion.valid_to)}</p>
                  </div>
                  <div className="rounded-md bg-gray-100 px-3 py-1 dark:bg-gray-800">
                    <p className="font-mono text-sm font-bold">{promotion.code}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/cars">Browse Cars</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Featured Promotion */}
      <div className="mt-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="max-w-md">
            <h2 className="mb-4 text-3xl font-bold">Weekend Special</h2>
            <p className="mb-6">
              Book any luxury car for the weekend and get 15% off your rental. Use code WEEKEND15 at checkout.
            </p>
            <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/cars">Book Now</Link>
            </Button>
          </div>
          <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-lg md:h-64">
            <Image src="/placeholder-0y82x.png" alt="Weekend Special" fill className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}
