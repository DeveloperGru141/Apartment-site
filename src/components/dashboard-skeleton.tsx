export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="border-b border-gray-100 pb-8 mb-12">
        <div className="h-8 w-80 bg-gray-200 rounded-lg" />
        <div className="h-4 w-96 bg-gray-100 rounded-md mt-3" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {[1, 2].map((index) => (
          <div key={index} className="rounded-2xl border border-gray-100 p-6 bg-white h-44 flex flex-col justify-between">
            <div>
              <div className="h-11 w-11 rounded-xl bg-gray-200" />
              <div className="h-5 w-32 bg-gray-200 rounded-md mt-5" />
              <div className="h-3.5 w-full bg-gray-100 rounded-md mt-3" />
              <div className="h-3.5 w-4/5 bg-gray-100 rounded-md mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
