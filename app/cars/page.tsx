"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Car, Filter, Search, Star, Fuel, Users, Gauge, Sliders, Zap } from "lucide-react"

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

export default function CarsPage() {
  const { supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for initial development
  const mockCars = [
    {
      id: 1,
      name: "Tesla Model S Plaid",
      brand: "Tesla",
      model: "Model S",
      year: 2023,
      daily_rate: 299,
      category: "Electric",
      image_url: "/placeholder.svg?height=300&width=500&text=Tesla+Model+S",
      description:
        "Experience the future of driving with the Tesla Model S Plaid. This all-electric sedan offers incredible performance with 0-60 mph in just 1.99 seconds.",
      features: {
        seats: 5,
        doors: 4,
        transmission: "Automatic",
        range: "396 miles",
        power: "1,020 hp",
      },
      rating: 4.9,
      is_available: true,
    },
    {
      id: 2,
      name: "Lamborghini Huracán",
      brand: "Lamborghini",
      model: "Huracán",
      year: 2022,
      daily_rate: 899,
      category: "Supercar",
      image_url: "/placeholder.svg?height=300&width=500&text=Lamborghini+Huracan",
      description:
        "The Lamborghini Huracán delivers the ultimate supercar experience with its aggressive styling and breathtaking performance.",
      features: {
        seats: 2,
        doors: 2,
        transmission: "Automatic",
        engine: "5.2L V10",
        power: "630 hp",
      },
      rating: 5.0,
      is_available: true,
    },
    {
      id: 3,
      name: "Range Rover Sport",
      brand: "Land Rover",
      model: "Range Rover Sport",
      year: 2023,
      daily_rate: 399,
      category: "SUV",
      image_url: "/placeholder.svg?height=300&width=500&text=Range+Rover+Sport",
      description:
        "Combining luxury with off-road capability, the Range Rover Sport offers a premium driving experience for any terrain.",
      features: {
        seats: 5,
        doors: 5,
        transmission: "Automatic",
        engine: "3.0L V6",
        power: "355 hp",
      },
      rating: 4.7,
      is_available: true,
    },
    {
      id: 4,
      name: "Mercedes-AMG GT",
      brand: "Mercedes-Benz",
      model: "AMG GT",
      year: 2022,
      daily_rate: 599,
      category: "Sports",
      image_url: "/placeholder.svg?height=300&width=500&text=Mercedes+AMG+GT",
      description:
        "The Mercedes-AMG GT combines stunning design with exhilarating performance for an unforgettable driving experience.",
      features: {
        seats: 2,
        doors: 2,
        transmission: "Automatic",
        engine: "4.0L V8 Biturbo",
        power: "523 hp",
      },
      rating: 4.8,
      is_available: true,
    },
    {
      id: 5,
      name: "Porsche 911 Turbo S",
      brand: "Porsche",
      model: "911 Turbo S",
      year: 2023,
      daily_rate: 699,
      category: "Sports",
      image_url: "/placeholder.svg?height=300&width=500&text=Porsche+911",
      description:
        "The iconic Porsche 911 Turbo S delivers breathtaking performance with everyday usability and timeless design.",
      features: {
        seats: 4,
        doors: 2,
        transmission: "Automatic",
        engine: "3.8L Twin-Turbo Flat-6",
        power: "640 hp",
      },
      rating: 4.9,
      is_available: true,
    },
    {
      id: 6,
      name: "Audi e-tron GT",
      brand: "Audi",
      model: "e-tron GT",
      year: 2023,
      daily_rate: 349,
      category: "Electric",
      image_url: "/placeholder.svg?height=300&width=500&text=Audi+e-tron+GT",
      description:
        "The Audi e-tron GT is an all-electric grand tourer that combines sustainable mobility with high-performance driving dynamics.",
      features: {
        seats: 5,
        doors: 4,
        transmission: "Automatic",
        range: "238 miles",
        power: "522 hp",
      },
      rating: 4.7,
      is_available: true,
    },
    {
      id: 7,
      name: "BMW X7",
      brand: "BMW",
      model: "X7",
      year: 2023,
      daily_rate: 449,
      category: "SUV",
      image_url: "/placeholder.svg?height=300&width=500&text=BMW+X7",
      description:
        "The BMW X7 is a luxury SUV that offers spacious comfort, advanced technology, and powerful performance.",
      features: {
        seats: 7,
        doors: 5,
        transmission: "Automatic",
        engine: "3.0L Inline-6",
        power: "375 hp",
      },
      rating: 4.6,
      is_available: true,
    },
    {
      id: 8,
      name: "Ferrari Roma",
      brand: "Ferrari",
      model: "Roma",
      year: 2022,
      daily_rate: 999,
      category: "Supercar",
      image_url: "/placeholder.svg?height=300&width=500&text=Ferrari+Roma",
      description:
        "The Ferrari Roma is an elegant grand touring coupe that delivers exhilarating performance with Italian flair.",
      features: {
        seats: 2,
        doors: 2,
        transmission: "Automatic",
        engine: "3.9L Twin-Turbo V8",
        power: "612 hp",
      },
      rating: 4.9,
      is_available: true,
    },
  ]

  useEffect(() => {
    // In a real app, we would fetch from Supabase
    // const fetchCars = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('cars')
    //       .select('*')
    //
    //     if (error) throw error
    //     setCars(data)
    //     setFilteredCars(data)
    //   } catch (error) {
    //     console.error('Error fetching cars:', error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // fetchCars()

    // Using mock data for now
    setCars(mockCars)
    setFilteredCars(mockCars)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filter cars based on search term, price range, category, and brand
    const filtered = cars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice = car.daily_rate >= priceRange[0] && car.daily_rate <= priceRange[1]

      const matchesCategory = selectedCategory === "" || car.category === selectedCategory

      const matchesBrand = selectedBrand === "" || car.brand === selectedBrand

      return matchesSearch && matchesPrice && matchesCategory && matchesBrand
    })

    setFilteredCars(filtered)
  }, [searchTerm, priceRange, selectedCategory, selectedBrand, cars])

  // Get unique categories and brands for filters
  const categories = [...new Set(cars.map((car) => car.category))]
  const brands = [...new Set(cars.map((car) => car.brand))]

  const handleCategoryChange = (value) => {
    setSelectedCategory(value === "all" ? "" : value)
  }

  const handleBrandChange = (value) => {
    setSelectedBrand(value === "all" ? "" : value)
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Our Luxury Fleet</h1>
          <p className="text-muted-foreground">Discover and book from our collection of premium vehicles</p>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0 flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <Badge className="ml-2" variant="secondary">
            {filteredCars.length}
          </Badge>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: showFilters ? 1 : 0,
            height: showFilters ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:block overflow-hidden"
        >
          <div className="bg-background rounded-xl border p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setPriceRange([0, 1000])
                  setSelectedCategory("")
                  setSelectedBrand("")
                }}
              >
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cars..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Daily Rate</label>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div>
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <Select value={selectedBrand || "all"} onValueChange={handleBrandChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Filters */}
              <Accordion type="single" collapsible>
                <AccordionItem value="features">
                  <AccordionTrigger className="text-sm font-medium">Additional Features</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {/* These would be checkboxes in a real app */}
                      <div className="flex items-center">
                        <input type="checkbox" id="automatic" className="mr-2" />
                        <label htmlFor="automatic" className="text-sm">
                          Automatic Transmission
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="convertible" className="mr-2" />
                        <label htmlFor="convertible" className="text-sm">
                          Convertible
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="gps" className="mr-2" />
                        <label htmlFor="gps" className="text-sm">
                          GPS Navigation
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="bluetooth" className="mr-2" />
                        <label htmlFor="bluetooth" className="text-sm">
                          Bluetooth
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </motion.div>

        {/* Cars Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find the perfect car.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setPriceRange([0, 1000])
                  setSelectedCategory("")
                  setSelectedBrand("")
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredCars.map((car) => (
                <motion.div key={car.id} variants={fadeIn} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
                  <Card className="overflow-hidden h-full border-0 shadow-lg">
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
                      {car.is_available ? (
                        <Badge className="absolute top-3 right-3 bg-green-500/90 hover:bg-green-500">Available</Badge>
                      ) : (
                        <Badge className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-500">Unavailable</Badge>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{car.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {car.brand} • {car.year}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{car.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4">{car.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{car.features.seats} Seats</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{car.features.power}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Sliders className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{car.features.transmission}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          {car.category === "Electric" ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{car.features.range}</span>
                            </>
                          ) : (
                            <>
                              <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{car.features.engine}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold">${car.daily_rate}</span>
                        <span className="text-muted-foreground text-sm">/day</span>
                      </div>
                      <Button asChild>
                        <Link href={`/cars/${car.id}`}>Book Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
