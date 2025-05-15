import { Skeleton } from "@/components/ui/skeleton"

export default function FAQLoading() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mx-auto mb-8 h-10 w-64" />

        {/* Search Bar Skeleton */}
        <Skeleton className="mb-8 h-10 w-full" />

        {/* Category Tabs Skeleton */}
        <Skeleton className="mb-8 h-10 w-full" />

        {/* FAQ Accordion Skeleton */}
        {Array.from({ length: 3 }).map((_, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <Skeleton className="mb-4 h-8 w-48" />

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <div key={itemIndex} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <Skeleton className="mb-2 h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Section Skeleton */}
        <div className="mt-12 rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
          <Skeleton className="mx-auto mb-4 h-6 w-48" />
          <Skeleton className="mx-auto mb-6 h-4 w-full max-w-md" />
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
