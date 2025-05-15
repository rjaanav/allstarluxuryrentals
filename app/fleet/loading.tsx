import { Skeleton } from "@/components/ui/skeleton"

export default function FleetLoading() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
