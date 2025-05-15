import { Skeleton } from "@/components/ui/skeleton"

export default function HowItWorksLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="mx-auto mb-8 h-10 w-64" />

      <div className="mx-auto max-w-4xl">
        {/* Hero Section Skeleton */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-md">
              <Skeleton className="mb-4 h-8 w-full bg-white/30" />
              <Skeleton className="mb-2 h-4 w-full bg-white/30" />
              <Skeleton className="mb-2 h-4 w-full bg-white/30" />
              <Skeleton className="mb-6 h-4 w-3/4 bg-white/30" />
              <Skeleton className="h-10 w-32 bg-white/30" />
            </div>
            <Skeleton className="h-48 w-48 rounded-full bg-white/30 md:h-64 md:w-64" />
          </div>
        </div>

        {/* Steps Section Skeleton */}
        <div className="mb-12">
          <Skeleton className="mx-auto mb-8 h-8 w-48" />

          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="w-full">
                    <Skeleton className="mb-2 h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements Section Skeleton */}
        <div className="mb-12">
          <Skeleton className="mx-auto mb-8 h-8 w-48" />

          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="mb-2 h-4 w-full" />
            ))}
          </div>
        </div>

        {/* CTA Section Skeleton */}
        <div className="rounded-xl bg-gray-100 p-8 text-center dark:bg-gray-800">
          <Skeleton className="mx-auto mb-4 h-6 w-48" />
          <Skeleton className="mx-auto mb-6 h-4 w-64" />
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Skeleton className="mx-auto h-10 w-32 sm:mx-0" />
            <Skeleton className="mx-auto h-10 w-32 sm:mx-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
