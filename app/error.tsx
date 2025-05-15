"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error?: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (error) {
      console.error("Error details:", error)
    } else {
      console.error("An unknown error occurred")
    }
  }, [error])

  // Handle the case where reset might not be a function
  const handleReset = () => {
    if (typeof reset === "function") {
      reset()
    } else {
      // Fallback behavior if reset is not a function
      window.location.reload()
    }
  }

  // Get error message or fallback to generic message
  const errorMessage = error?.message || "An unexpected error occurred"
  const errorDigest = error?.digest ? `Error ID: ${error.digest}` : ""

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh]">
      <AlertTriangle className="h-24 w-24 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-xl text-muted-foreground mb-4 text-center max-w-md">
        We apologize for the inconvenience. {errorMessage}
      </p>
      {errorDigest && <p className="text-sm text-muted-foreground mb-8">{errorDigest}</p>}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleReset} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
