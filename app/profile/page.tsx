"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import {
  User,
  Car,
  CreditCard,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Camera,
  AlertCircle,
} from "lucide-react"
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
  const searchParams = useSearchParams()
  const { user, supabase } = useSupabase()
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
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30) // minutes
  const [formErrors, setFormErrors] = useState({
    full_name: "",
    phone_number: "",
    driver_license_number: "",
    driver_license_expiry: "",
  })
  const [debugInfo, setDebugInfo] = useState({
    hasUser: false,
    userId: "",
    profileFetched: false,
    profileData: null,
  })

  useEffect(() => {
    // Update debug info
    setDebugInfo((prev) => ({
      ...prev,
      hasUser: Boolean(user),
      userId: user?.id || "",
    }))

    if (!user) {
      console.log("Profile page: No user found")
      setLoading(false)
      return
    }

    console.log("Profile page: User found, fetching profile", user.id)

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if user_profiles table exists
        const { data: tableExists, error: tableCheckError } = await supabase.from("user_profiles").select("id").limit(1)

        if (tableCheckError) {
          console.error("Error checking user_profiles table:", tableCheckError)
          throw new Error("Could not verify database tables. Please ensure the database is set up correctly.")
        }

        // Fetch user profile
        const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

        // Update debug info
        setDebugInfo((prev) => ({
          ...prev,
          profileFetched: true,
          profileData: data || null,
        }))

        if (error) {
          console.error("Error fetching profile:", error)

          // If the error is that the record was not found, create a new profile
          if (error.code === "PGRST116") {
            console.log("Profile not found, creating new profile")
            await createNewProfile()
          } else {
            throw error
          }
        } else if (data) {
          console.log("Profile found:", data)
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
          // No data and no error means we need to create a profile
          console.log("No profile found, creating new profile")
          await createNewProfile()
        }
      } catch (err) {
        console.error("Error in profile fetch:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load profile data"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage + ". Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    const createNewProfile = async () => {
      try {
        // Create a new profile with default values
        const { data, error } = await supabase
          .from("user_profiles")
          .insert({
            id: user.id,
            full_name: user?.user_metadata?.full_name || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) {
          console.error("Error creating profile:", error)
          throw error
        }

        if (data && data.length > 0) {
          console.log("New profile created:", data[0])
          setProfile({
            full_name: data[0].full_name || "",
            phone_number: data[0].phone_number || "",
            address: data[0].address || "",
            driver_license_number: data[0].driver_license_number || "",
            driver_license_expiry: data[0].driver_license_expiry
              ? new Date(data[0].driver_license_expiry).toISOString().split("T")[0]
              : "",
            avatar_url: data[0].avatar_url || "",
          })
        }

        // Use auth metadata for avatar if available
        setAvatarUrl(user?.user_metadata?.avatar_url || null)
      } catch (err) {
        console.error("Error creating profile:", err)
        throw err
      }
    }

    fetchProfile()
  }, [user, supabase])

  const validateForm = () => {
    let valid = true
    const errors = {
      full_name: "",
      phone_number: "",
      driver_license_number: "",
      driver_license_expiry: "",
    }

    // Validate phone number format if provided
    if (profile.phone_number && !/^\+?[0-9\s\-()]{10,15}$/.test(profile.phone_number)) {
      errors.phone_number = "Please enter a valid phone number"
      valid = false
    }

    // Validate driver's license expiry date if provided
    if (profile.driver_license_expiry) {
      const expiryDate = new Date(profile.driver_license_expiry)
      const today = new Date()
      if (expiryDate < today) {
        errors.driver_license_expiry = "Expiry date cannot be in the past"
        valid = false
      }
    }

    setFormErrors(errors)
    return valid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        address: profile.address,
        driver_license_number: profile.driver_license_number,
        driver_license_expiry: profile.driver_license_expiry || null,
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
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0 || !user) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        throw new Error("File must be an image (JPEG, PNG, GIF, or WEBP)")
      }

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
      const errorMessage = error instanceof Error ? error.message : "Failed to upload avatar. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
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

  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (typeof window !== "undefined") {
      const timeoutEnabled = localStorage.getItem("sessionTimeoutEnabled") === "true"
      const timeoutMinutes = Number.parseInt(localStorage.getItem("sessionTimeoutMinutes") || "30")

      setSessionTimeoutEnabled(timeoutEnabled)
      setSessionTimeout(timeoutMinutes)
    }
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 text-left text-xs bg-muted p-4 rounded-md">
              <p>Debug Info:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  // If no user, show a message (this shouldn't happen due to AuthGuard)
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">You need to be signed in to view your profile.</p>
          <Button onClick={() => router.push("/")}>Go to Sign In</Button>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 text-left text-xs bg-muted p-4 rounded-md">
              <p>Debug Info:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your personal information and preferences</p>

        <Tabs defaultValue={searchParams.get("tab") || "personal"} className="w-full">
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
                          {uploading ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4 text-white" />
                          )}
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
                              {formErrors.full_name && (
                                <p className="text-xs text-destructive mt-1">{formErrors.full_name}</p>
                              )}
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
                              {formErrors.phone_number && (
                                <p className="text-xs text-destructive mt-1">{formErrors.phone_number}</p>
                              )}
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

              {/* Other tabs content remains the same */}
              <TabsContent value="license" className="mt-0">
                {/* License tab content */}
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
                              {formErrors.driver_license_number && (
                                <p className="text-xs text-destructive mt-1">{formErrors.driver_license_number}</p>
                              )}
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
                              {formErrors.driver_license_expiry && (
                                <p className="text-xs text-destructive mt-1">{formErrors.driver_license_expiry}</p>
                              )}
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
                {/* Payment tab content */}
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
                {/* Security tab content */}
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
                          <p className="text-muted-foreground mb-4">Manage your account password for secure access.</p>
                          <Button variant="outline">Change Password</Button>
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

        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-xs bg-muted p-4 rounded-md">
            <p>Debug Info:</p>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
