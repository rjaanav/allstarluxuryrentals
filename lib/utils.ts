import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function calculateDaysBetween(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Reset hours to avoid DST issues
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  const diffDays = Math.round(Math.abs((start.getTime() - end.getTime()) / oneDay))
  return diffDays + 1 // Include both start and end days
}

export function calculateTotalPrice(pricePerDay: number, startDate: Date, endDate: Date): number {
  const days = calculateDaysBetween(startDate, endDate)
  return pricePerDay * days
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
