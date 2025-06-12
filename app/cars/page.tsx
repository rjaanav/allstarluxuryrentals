"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCars } from "@/hooks/use-cars"
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
  const { cars, loading, error, fetchCars, getCarCategories, getCarBrands } = useCars()
  const [filteredCars, setFilteredCars] = useState(cars)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchFilters = async () => {
      const fetchedCategories = await getCarCategories()
      const fetchedBrands = await getCarBrands()
      setCategories(fetchedCategories)
      setBrands(fetchedBrands)
    }

    fetchFilters()
  }, [getCarCategories, getCarBrands])

  // Update filtered cars when cars or filters change
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value)
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value === "all" ? "" : value)
  }

  const applyFilters = () => {
    fetchCars({
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      available: true,
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setPriceRange([0, 1500])
    setSelectedCategory("")
    setSelectedBrand("")
    fetchCars()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Browse Cars</h1>
          <p className="text-muted-foreground">Find your perfect luxury car from our curated selection</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
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
              <Button variant="ghost" size="sm" onClick={resetFilters}>
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
                  defaultValue={[0, 1500]}
                  max={1500}
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

              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Cars Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Error loading cars</h3>
              <p className="text-muted-foreground">{error.message}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchCars()}>
                Try Again
              </Button>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find the perfect car.</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
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
                        src={
                          car.image_url || "/placeholder.svg?height=300&width=500&text=" + encodeURIComponent(car.name)
                        }
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
                          <span className="ml-1 text-sm font-medium">4.8</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4">{car.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {car.features && typeof car.features === "object" && (
                          <>
                            {car.features.seats && (
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{car.features.seats} Seats</span>
                              </div>
                            )}
                            {car.features.power && (
                              <div className="flex items-center text-sm">
                                <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{car.features.power}</span>
                              </div>
                            )}
                            {car.features.transmission && (
                              <div className="flex items-center text-sm">
                                <Sliders className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{car.features.transmission}</span>
                              </div>
                            )}
                            {car.category === "Electric" && car.features.range ? (
                              <div className="flex items-center text-sm">
                                <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{car.features.range}</span>
                              </div>
                            ) : car.features.engine ? (
                              <div className="flex items-center text-sm">
                                <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{car.features.engine}</span>
                              </div>
                            ) : null}
                          </>
                        )}
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
