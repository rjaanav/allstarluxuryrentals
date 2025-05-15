"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { User, Car, CreditCard, Shield, LogOut, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react"
import { AuthDebug } from "@/components/auth-debug"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading, signOut, supabase } = useSupabase()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    driver_license_number: "",
    driver_license_expiry: "",
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        driver_license_number: profile.driver_license_number || "",
        driver_license_expiry: profile.driver_license_expiry
          ? new Date(profile.driver_license_expiry).toISOString().split("T")[0]
          : "",
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address,
          driver_license_number: formData.driver_license_number,
          driver_license_expiry: formData.driver_license_expiry,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <User className="h-16 w-16 mx-auto text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Sign In to View Your Profile</h1>
          <p className="text-muted-foreground mb-6">Please sign in to view and manage your profile information.</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <AuthDebug />
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your personal information and preferences</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">{formData.full_name || user.email?.split("@")[0] || "User"}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Button variant="outline" size="sm" className="mt-4 w-full" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#personal-info">
                        <User className="h-4 w-4 mr-2" />
                        Personal Information
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#driver-license">
                        <Car className="h-4 w-4 mr-2" />
                        Driver's License
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#payment-methods">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Methods
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#security">
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                      </a>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-8">
              <Card id="personal-info">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            value={user.email}
                            readOnly
                            disabled
                            className="pl-10 bg-muted"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter your address"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card id="driver-license">
                <CardHeader>
                  <CardTitle>Driver's License Information</CardTitle>
                  <CardDescription>Provide your driver's license details for verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="driver_license_number">License Number</Label>
                        <div className="relative">
                          <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="driver_license_number"
                            name="driver_license_number"
                            value={formData.driver_license_number}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter your license number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="driver_license_expiry">Expiry Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="driver_license_expiry"
                            name="driver_license_expiry"
                            type="date"
                            value={formData.driver_license_expiry}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card id="payment-methods">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods for faster checkout</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Payment Methods Added</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      You haven't added any payment methods yet. Add a payment method for faster checkout.
                    </p>
                    <Button>Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>

              <Card id="security">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Password</h3>
                      <p className="text-muted-foreground mb-4">
                        You're using Google to sign in, so you don't need a password.
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
                      <p className="text-muted-foreground mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-destructive">Delete Account</h3>
                      <p className="text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
