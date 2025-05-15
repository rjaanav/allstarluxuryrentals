import { createClient } from "@supabase/supabase-js"

// Helper function to get a Supabase client with the storage API
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Upload an avatar image to Supabase storage
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    const supabase = getSupabaseClient()
    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
    return data.publicUrl
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return null
  }
}

// Get the avatar URL for a user
export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from("avatars").list(userId + "/")

    if (error) {
      throw error
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
    console.error("Error getting avatar URL:", error)
    return null
  }
}

// Delete an avatar image from Supabase storage
export const deleteAvatar = async (avatarUrl: string, userId: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const path = avatarUrl.split("/").pop()
    if (!path) return false

    const { error } = await supabase.storage.from("avatars").remove([`${userId}/${path}`])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting avatar:", error)
    return false
  }
}
