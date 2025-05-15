"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  MoreHorizontal,
  PlusCircle,
  Search,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function AdminPage() {
  const router = useRouter()
  const { user, supabase } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for development
  const mockCars = [
    {
      id: 1,
      name: "Tesla Model S Plaid",
      brand: "Tesla",
      category: "Electric",
      daily_rate: 299,
      is_available: true,
      image_url: "/placeholder.svg?height=100&width=150&text=Tesla",
    },
    {
      id: 2,
      name: "Lamborghini Huracán",
      brand: "Lamborghini",
      category: "Supercar",
      daily_rate: 899,
      is_available: true,
      image_url: "/placeholder.svg?height=100&width=150&text=Lambo",
    },
    {
      id: 3,
      name: "Range Rover Sport",
      brand: "Land Rover",
      category: "SUV",
      daily_rate: 399,
      is_available: false,
      image_url: "/placeholder.svg?height=100&width=150&text=Range+Rover",
    },
  ]

  const mockBookings = [
    {
      id: 1,
      user: {
        id: "123",
        name: "Alex Johnson",
      },
      car: {
        id: 1,
        name: "Tesla Model S Plaid",
      },
      start_date: "2023-06-15T10:00:00Z",
      end_date: "2023-06-18T10:00:00Z",
      total_amount: 897,
      status: "completed",
    },
    {
      id: 2,
      user: {
        id: "456",
        name: "Sophia Williams",
      },
      car: {
        id: 2,
        name: "Lamborghini Huracán",
      },
      start_date: "2023-07-20T14:00:00Z",
      end_date: "2023-07-22T14:00:00Z",
      total_amount: 1798,
      status: "upcoming",
    },
    {
      id: 3,
      user: {
        id: "789",
        name: "Michael Chen",
      },
      car: {
        id: 3,
        name: "Range Rover Sport",
      },
      start_date: "2023-08-05T12:00:00Z",
      end_date: "2023-08-10T12:00:00Z",
      total_amount: 1995,
      status: "pending",
    },
  ]

  const mockUsers = [
    {
      id: "123",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      created_at: "2023-01-15T10:00:00Z",
      bookings_count: 3,
    },
    {
      id: "456",
      name: "Sophia Williams",
      email: "sophia.williams@example.com",
      created_at: "2023-02-20T14:00:00Z",
      bookings_count: 1,
    },
    {
      id: "789",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      created_at: "2023-03-05T12:00:00Z",
      bookings_count: 2,
    },
  ]

  useEffect(() => {
    if (!user) {
      return
    }

    // In a real app, we would check if the user is an admin
    // const checkAdmin = async () => {
    //   try {
    //     const { data, error } = await supabase
    //       .from('admins')
    //       .select('*')
    //       .eq('user_id', user.id)
    //       .single()
    //
    //     if (error) throw error
    //     setIsAdmin(!!data)
    //   } catch (error) {
    //     console.error('Error checking admin status:', error)
    //     setIsAdmin(false)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    //
    // checkAdmin()

    // For development, set isAdmin to true
    setIsAdmin(true)
    setCars(mockCars)
    setBookings(mockBookings)
    setUsers(mockUsers)
    setLoading(false)
  }, [user])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/90 hover:bg-green-500"
      case "upcoming":
        return "bg-blue-500/90 hover:bg-blue-500"
      case "pending":
        return "bg-yellow-500/90 hover:bg-yellow-500"
      case "cancelled":
        return "bg-red-500/90 hover:bg-red-500"
      default:
        return "bg-gray-500/90 hover:bg-gray-500"
    }
  }

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <Users className="h-16 w-16 mx-auto text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in with an admin account to access this page.</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <XCircle className="h-16 w-16 mx-auto text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have permission to access the admin dashboard.</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your luxury car rental business</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Cars</p>
                <h3 className="text-3xl font-bold">{cars.length}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Car className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Bookings</p>
                <h3 className="text-3xl font-bold">{bookings.length}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold">{users.length}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Revenue</p>
                <h3 className="text-3xl font-bold">
                  ${bookings.reduce((sum, booking) => sum + booking.total_amount, 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Car
        </Button>
      </div>

      <Tabs defaultValue="cars" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="cars">
          <Card>
            <CardHeader>
              <CardTitle>Car Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Daily Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Car className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No cars found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="relative w-12 h-12 rounded overflow-hidden mr-3">
                              <Image
                                src={car.image_url || "/placeholder.svg"}
                                alt={car.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{car.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{car.brand}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{car.category}</Badge>
                        </TableCell>
                        <TableCell>${car.daily_rate}/day</TableCell>
                        <TableCell>
                          {car.is_available ? (
                            <Badge className="bg-green-500/90 hover:bg-green-500">Available</Badge>
                          ) : (
                            <Badge className="bg-red-500/90 hover:bg-red-500">Unavailable</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Car
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Car
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No bookings found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>#{booking.id.toString().padStart(6, "0")}</TableCell>
                        <TableCell>{booking.user.name}</TableCell>
                        <TableCell>{booking.car.name}</TableCell>
                        <TableCell>
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </TableCell>
                        <TableCell>${booking.total_amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Users className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No users found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{user.bookings_count}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                View Bookings
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
