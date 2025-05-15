export interface Car {
  id: string // UUID in the database
  name: string
  brand: string
  model: string
  year: number
  daily_rate: number // Changed from price_per_day to match schema
  description: string
  features: string[] | Record<string, any> // Could be JSON in the database
  category: string
  image_url: string // Changed from image_urls array to match schema
  is_available: boolean // Changed from available to match schema
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string // UUID in the database
  user_id: string
  car_id: string
  start_date: string
  end_date: string
  total_amount: number // Changed from total_price to match schema
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_intent_id?: string
  created_at: string
  updated_at: string
  car?: Car
}

export interface Review {
  id: string // UUID in the database
  user_id: string
  car_id: string
  rating: number
  comment: string
  created_at: string
  user_name?: string
  car_name?: string
}

export interface UserProfile {
  id: string // UUID in the database
  full_name?: string
  phone_number?: string
  address?: string
  driver_license_number?: string
  driver_license_expiry?: string
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: string // UUID in the database
  code: string
  description: string
  discount_percentage: number
  valid_from: string
  valid_to: string
  is_active: boolean // Changed from active to match schema
  created_at: string
}

export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}
