import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh]">
      <Car className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        Oops! The page you're looking for has taken a detour.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
