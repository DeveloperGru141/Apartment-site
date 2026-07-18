import { Suspense } from "react"
import Navbar from "@/components/navbar"
import ListingsContent from "./ListingsContent"

function ListingsSkeleton() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-full md:w-[58.33%] p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-3xl bg-[#F0EEED]" />
              <div className="mt-3 h-3 bg-[#F0EEED] rounded w-1/3" />
              <div className="mt-2 h-5 bg-[#F0EEED] rounded w-3/4" />
              <div className="mt-2 h-3 bg-[#F0EEED] rounded w-1/2" />
              <div className="mt-3 h-4 bg-[#F0EEED] rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:block w-[41.67%] bg-[#E8E6E1]" />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />
      <Suspense fallback={<ListingsSkeleton />}>
        <ListingsContent />
      </Suspense>
    </div>
  )
}
