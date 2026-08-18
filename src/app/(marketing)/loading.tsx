export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-bg-primary py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-64 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-96 max-w-full bg-gray-200 rounded mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}