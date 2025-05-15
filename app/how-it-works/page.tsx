import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, Car, CreditCard, Key } from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works - Allstar Luxury Car Rentals",
  description: "Learn how to rent a luxury car with Allstar Luxury Car Rentals",
}

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Browse Our Collection",
      description: "Explore our extensive collection of luxury vehicles and find the perfect car for your needs.",
      icon: Search,
    },
    {
      title: "Choose Your Dates",
      description: "Select your pickup and return dates to check availability and get an instant quote.",
      icon: Calendar,
    },
    {
      title: "Select Your Vehicle",
      description: "Compare features, prices, and reviews to select the ideal luxury car for your journey.",
      icon: Car,
    },
    {
      title: "Book and Pay",
      description: "Complete your reservation with our secure payment system. We accept all major credit cards.",
      icon: CreditCard,
    },
    {
      title: "Enjoy Your Ride",
      description: "Pick up your vehicle at the designated location and enjoy your premium driving experience.",
      icon: Key,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">How It Works</h1>

      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-md">
              <h2 className="mb-4 text-3xl font-bold">Luxury Car Rental Made Simple</h2>
              <p className="mb-6">
                Renting a luxury car with Allstar is quick, easy, and hassle-free. Follow our simple process to get
                behind the wheel of your dream car.
              </p>
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/cars">Browse Cars</Link>
              </Button>
            </div>
            <div className="relative h-48 w-48 overflow-hidden rounded-full md:h-64 md:w-64">
              <Image src="/placeholder.svg?key=ij7qd" alt="Luxury Car Key" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Rental Process</h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      <span className="mr-2 text-blue-600 dark:text-blue-400">{index + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Rental Requirements</h2>

          <Card>
            <CardContent className="p-6">
              <ul className="list-inside list-disc space-y-2">
                <li>Valid driver's license (minimum 1 year)</li>
                <li>Minimum age of 25 years (some vehicles may require 30+)</li>
                <li>Valid credit card in the renter's name</li>
                <li>Proof of insurance or purchase of our insurance coverage</li>
                <li>Clean driving record (no major violations in the past 3 years)</li>
                <li>Security deposit (varies by vehicle)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="rounded-xl bg-gray-100 p-8 text-center dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold">Ready to Experience Luxury?</h2>
          <p className="mb-6">Browse our collection of premium vehicles and book your dream car today.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild>
              <Link href="/cars">Browse Cars</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
