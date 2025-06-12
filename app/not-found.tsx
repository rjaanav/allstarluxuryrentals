import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh]">
      <Car className="h-16 w-16 md:h-24 md:w-24 text-primary mb-4 md:mb-6" />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">404 - Page Not Found</h1>
      <p className="text-base sm:text-lg text-muted-foreground mb-6 md:mb-8 text-center max-w-md">
        Oops! The page you're looking for has taken a detour.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
