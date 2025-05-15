import { Skeleton } from "@/components/ui/skeleton"

export default function PromotionsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="mx-auto mb-8 h-10 w-64" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-48 w-full" />

            <div className="p-6">
              <Skeleton className="mb-4 h-6 w-3/4" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-2/3" />

              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="mb-1 h-3 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Featured Promotion Skeleton */}
      <div className="mt-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="max-w-md">
            <Skeleton className="mb-4 h-8 w-48 bg-white/30" />
            <Skeleton className="mb-2 h-4 w-full bg-white/30" />
            <Skeleton className="mb-2 h-4 w-full bg-white/30" />
            <Skeleton className="mb-6 h-4 w-3/4 bg-white/30" />
            <Skeleton className="h-10 w-32 bg-white/30" />
          </div>
          <Skeleton className="h-48 w-full max-w-sm rounded-lg bg-white/30 md:h-64" />
        </div>
      </div>
    </div>
  )
}
