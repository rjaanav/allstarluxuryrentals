import { createClient } from "@supabase/supabase-js"

// Helper function to get a Supabase client with the storage API
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials")
    throw new Error("Missing Supabase credentials")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Upload an avatar image to Supabase storage
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    const supabase = getSupabaseClient()

    // Check if storage is available
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError)
        throw new Error("Storage is not available. Please check your Supabase configuration.")
      }

      // Create avatars bucket if it doesn't exist
      if (!buckets?.find((bucket) => bucket.name === "avatars")) {
        const { error: createBucketError } = await supabase.storage.createBucket("avatars", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })

        if (createBucketError) {
          console.error("Error creating avatars bucket:", createBucketError)
          throw new Error("Could not create storage bucket. Please check your Supabase configuration.")
        }
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error)
      // If we can't create a bucket, try to use a data URL instead
      return URL.createObjectURL(file)
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    const { error: uploadError, data } = await supabase.storage.from("avatars").upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError)
      // If upload fails, try to use a data URL instead
      return URL.createObjectURL(file)
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadAvatar:", error)
    // As a last resort, try to use a data URL
    try {
      return URL.createObjectURL(file)
    } catch {
      return null
    }
  }
}

// Get the avatar URL for a user
export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    // First check if user has an avatar_url in their profile
    const supabase = getSupabaseClient()
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single()

    if (profileData?.avatar_url) {
      return profileData.avatar_url
    }

    // If no avatar_url in profile, check storage
    const { data, error } = await supabase.storage.from("avatars").list(userId + "/")

    if (error) {
      console.error("Error listing avatars:", error)
      return null
    }

    if (data && data.length > 0) {
      // Get the most recent avatar
      const sortedFiles = data.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(`${userId}/${sortedFiles[0].name}`)
      return urlData.publicUrl
    }

    return null
  } catch (error) {
    console.error("Error in getAvatarUrl:", error)
    return null
  }
}

// Delete an avatar image from Supabase storage
export const deleteAvatar = async (avatarUrl: string, userId: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()

    // Extract the file path from the URL
    const urlParts = avatarUrl.split("/")
    const bucketIndex = urlParts.findIndex((part) => part === "avatars")

    if (bucketIndex === -1) {
      console.error("Invalid avatar URL format")
      return false
    }

    const filePath = urlParts.slice(bucketIndex + 1).join("/")

    const { error } = await supabase.storage.from("avatars").remove([filePath])

    if (error) {
      console.error("Error deleting avatar:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteAvatar:", error)
    return false
  }
}
