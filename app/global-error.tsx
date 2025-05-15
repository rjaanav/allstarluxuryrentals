"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <AlertTriangle className="h-24 w-24 text-red-500 mb-6" />
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-xl mb-8 text-center max-w-md">
            We apologize for the inconvenience. A critical error has occurred.
          </p>
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
}
