"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ListingCard from "@/components/listings/ListingCard"
import FilterStrip from "@/components/listings/FilterStrip"

interface Listing {
  unit_id: string
  unit_number: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  rent_price: number
  deposit_amount: number
  available_from: string
  images: string[]
  property_title: string
  property_type: string
  address_line1: string
  city: string
  state: string
  zip_code: string
  neighborhood: string | null
  walk_score: number | null
  landlord_name: string
  landlord_avatar: string | null
}

export default function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false

    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites")
        if (res.ok) {
          const data = await res.json()
          const ids = new Set<string>(
            (data.data ?? []).map((f: { unit?: { id: string } }) => f.unit?.id).filter(Boolean)
          )
          if (!cancelled) setFavoritedIds(ids)
        }
      } catch {
        // favorites are optional — silently ignore
      }
    }

    const fetchListings = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams(searchParams.toString())
        const res = await fetch(`/api/units?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        if (!cancelled) setListings(data.data ?? [])
      } catch {
        if (!cancelled) setError("Unable to load listings")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchFavorites()
    fetchListings()
    return () => { cancelled = true }
  }, [searchParams])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-['Inter'] text-sm text-[#707070]">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-full overflow-y-auto p-6 md:p-8">
        <FilterStrip total={listings.length} />
        {loading ? (
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
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="font-['Inter'] text-sm text-[#707070]">No listings match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.unit_id} listing={listing} initialFaved={favoritedIds.has(listing.unit_id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
