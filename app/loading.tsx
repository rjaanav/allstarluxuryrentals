export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-32 flex justify-center items-center min-h-[50vh] md:min-h-[70vh]">
      <div className="animate-spin rounded-full h-10 w-10 md:h-16 md:w-16 border-b-2 border-primary"></div>
    </div>
  )
}
