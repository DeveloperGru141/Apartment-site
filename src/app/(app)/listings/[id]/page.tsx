import { Suspense } from "react"
import Navbar from "@/components/navbar"
import ListingDetailContent from "./ListingDetailContent"

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <Navbar />
      <div className="h-[50vh] bg-[#e0ddd8] animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-[#e0ddd8] rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-[#e0ddd8] rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-[#e0ddd8] rounded-2xl animate-pulse" />
            <div className="h-32 bg-[#e0ddd8] rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-[#e0ddd8] rounded-2xl animate-pulse" />
            <div className="h-24 bg-[#e0ddd8] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <Navbar />
      <Suspense fallback={<DetailSkeleton />}>
        <ListingDetailContent id={id} />
      </Suspense>
    </div>
  )
}
