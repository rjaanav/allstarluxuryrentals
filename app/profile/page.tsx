"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSupabase } from "@/lib/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { User, Car, CreditCard, LogOut, Mail, Phone, MapPin, Calendar, Loader2, Camera } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { uploadAvatar } from "@/lib/avatar-utils"

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
  const { user, supabase, loading: authLoading } = useSupabase()
  const [isUpdating, setIsUpdating] = useState(false)
  const [profile, setProfile] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    driver_license_number: "",
    driver_license_expiry: "",
    avatar_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30) // minutes

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setProfile({
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
            driver_license_number: data.driver_license_number || "",
            driver_license_expiry: data.driver_license_expiry
              ? new Date(data.driver_license_expiry).toISOString().split("T")[0]
              : "",
            avatar_url: data.avatar_url || "",
          })
          setAvatarUrl(data.avatar_url || user?.user_metadata?.avatar_url || null)
        } else {
          // If no profile exists, use the avatar from auth metadata if available
          setAvatarUrl(user?.user_metadata?.avatar_url || null)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setIsUpdating(true)

    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        address: profile.address,
        driver_license_number: profile.driver_license_number,
        driver_license_expiry: profile.driver_license_expiry,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })

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

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0 || !user) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const newAvatarUrl = await uploadAvatar(file, user.id)

      if (!newAvatarUrl) {
        throw new Error("Failed to upload avatar.")
      }

      setAvatarUrl(newAvatarUrl)

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase.from("user_profiles").upsert({
        id: user.id,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })

      if (updateError) throw updateError

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleSessionTimeout = () => {
    setSessionTimeoutEnabled(!sessionTimeoutEnabled)

    // If enabling, set up the session timeout
    if (!sessionTimeoutEnabled) {
      // Store the preference in localStorage
      localStorage.setItem("sessionTimeoutEnabled", "true")
      localStorage.setItem("sessionTimeoutMinutes", sessionTimeout.toString())

      toast({
        title: "Session timeout enabled",
        description: `Your session will expire after ${sessionTimeout} minutes of inactivity.`,
      })
    } else {
      // Remove the preference from localStorage
      localStorage.removeItem("sessionTimeoutEnabled")
      localStorage.removeItem("sessionTimeoutMinutes")

      toast({
        title: "Session timeout disabled",
        description: "Your session will not expire automatically.",
      })
    }
  }

  const handleSessionTimeoutChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setSessionTimeout(value)

    if (sessionTimeoutEnabled) {
      localStorage.setItem("sessionTimeoutMinutes", value.toString())

      toast({
        title: "Session timeout updated",
        description: `Your session will expire after ${value} minutes of inactivity.`,
      })
    }
  }

  // Load session timeout preferences from localStorage
  useEffect(() => {
    const timeoutEnabled = localStorage.getItem("sessionTimeoutEnabled") === "true"
    const timeoutMinutes = Number.parseInt(localStorage.getItem("sessionTimeoutMinutes") || "30")

    setSessionTimeoutEnabled(timeoutEnabled)
    setSessionTimeout(timeoutMinutes)
  }, [])

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your personal information and preferences</p>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="license">Driver's License</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-24 h-24 mb-4">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl || "/placeholder.svg"}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-12 w-12 text-primary" />
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer"
                        >
                          <Camera className="h-4 w-4 text-white" />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      <h2 className="text-xl font-bold">
                        {profile.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                      </h2>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <TabsContent value="personal" className="mt-0">
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                  <Card>
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
                                value={profile.full_name}
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
                                value={user?.email || ""}
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
                                value={profile.phone_number}
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
                                value={profile.address}
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
                </motion.div>
              </TabsContent>

              <TabsContent value="license" className="mt-0">
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                  <Card>
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
                                value={profile.driver_license_number}
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
                                value={profile.driver_license_expiry}
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
                </motion.div>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                  <Card>
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
                </motion.div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                  <Card>
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
                          <h3 className="text-lg font-semibold mb-2">Session Timeout</h3>
                          <p className="text-muted-foreground mb-4">
                            Configure your session to automatically expire after a period of inactivity.
                          </p>
                          <div className="flex items-center mb-4">
                            <input
                              type="checkbox"
                              id="session-timeout"
                              checked={sessionTimeoutEnabled}
                              onChange={toggleSessionTimeout}
                              className="mr-2 h-4 w-4"
                            />
                            <Label htmlFor="session-timeout">Enable session timeout</Label>
                          </div>
                          {sessionTimeoutEnabled && (
                            <div className="flex items-center gap-4">
                              <Label htmlFor="timeout-minutes">Timeout after</Label>
                              <select
                                id="timeout-minutes"
                                value={sessionTimeout}
                                onChange={handleSessionTimeoutChange}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="5">5 minutes</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                              </select>
                            </div>
                          )}
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
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
