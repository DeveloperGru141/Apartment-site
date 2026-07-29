"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

const priceRanges = [
  { label: "Any", min: "", max: "" },
  { label: "Under $1,500", min: "", max: "1500" },
  { label: "$1,500 - $2,500", min: "1500", max: "2500" },
  { label: "$2,500 - $4,000", min: "2500", max: "4000" },
  { label: "$4,000+", min: "4000", max: "" },
]

const guestOptions = [
  { label: "Studio", bedrooms: "0" },
  { label: "1 Bedroom", bedrooms: "1" },
  { label: "2 Bedrooms", bedrooms: "2" },
  { label: "3 Bedrooms", bedrooms: "3" },
  { label: "4+ Bedrooms", bedrooms: "4" },
]

export default function FilterStrip({ total }: { total: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [destOpen, setDestOpen] = useState(false)
  const [guestOpen, setGuestOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)

  const current = {
    city: searchParams.get("city") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  }

  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }
      return `/listings?${params.toString()}`
    },
    [searchParams]
  )

  const setFilter = (key: string, value: string) => {
    router.push(buildUrl({ [key]: value }))
  }

  const activeLabel = (() => {
    if (current.bedrooms) {
      const found = guestOptions.find((o) => o.bedrooms === current.bedrooms)
      if (found) return found.label
    }
    return "Guests"
  })()

  const priceLabel = (() => {
    if (current.minPrice || current.maxPrice) {
      const found = priceRanges.find(
        (r) => r.min === current.minPrice && r.max === current.maxPrice
      )
      if (found && found.label !== "Any") return found.label
    }
    return "Price Range"
  })()

  return (
    <div className="bg-white/50 backdrop-blur-md border-b border-accent/5 pb-3 mb-4 sticky top-0 z-20">
      <div className="pt-4">
        {/* Context Row */}
        <p className="font-body text-[10px] tracking-wider uppercase font-semibold text-text-muted mb-3 px-4">
          Explore Stays &larr; {total} Premium Residences Available
        </p>

        {/* Filter Row */}
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-none pb-4 pt-1 w-full px-4 -mx-4">
          {/* Destination */}
          <div className="flex-shrink-0 relative">
            <button
              onClick={() => {
                setDestOpen(!destOpen)
                setGuestOpen(false)
                setPriceOpen(false)
              }}
              className="flex-shrink-0 inline-flex items-center bg-bg-alt border border-accent/5 px-4 py-2 rounded-full font-body text-xs font-medium text-text-primary"
            >
              {current.city || "Destination"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {destOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-accent/5 p-3 z-30">
                <input
                  type="text"
                  placeholder="Search city..."
                  defaultValue={current.city}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFilter("city", e.currentTarget.value)
                      setDestOpen(false)
                    }
                  }}
                  className="w-full px-3 py-2 text-sm font-body border border-accent/10 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#111111]/20 placeholder:text-text-muted"
                />
              </div>
            )}
          </div>

          {/* Dates (placeholder) */}
          <button className="flex-shrink-0 inline-flex items-center bg-bg-alt border border-accent/5 px-4 py-2 rounded-full font-body text-xs font-medium text-text-primary">
            Check-in / Check-out
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </button>

          {/* Guests / Bedrooms */}
          <div className="flex-shrink-0 relative">
            <button
              onClick={() => {
                setGuestOpen(!guestOpen)
                setDestOpen(false)
                setPriceOpen(false)
              }}
              className="flex-shrink-0 inline-flex items-center bg-bg-alt border border-accent/5 px-4 py-2 rounded-full font-body text-xs font-medium text-text-primary"
            >
              {activeLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {guestOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-accent/5 p-2 z-30">
                {guestOptions.map((opt) => (
                  <button
                    key={opt.bedrooms}
                    onClick={() => {
                      setFilter("bedrooms", opt.bedrooms)
                      setGuestOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-colors ${
                      current.bedrooms === opt.bedrooms
                        ? "bg-accent text-white"
                        : "text-text-primary hover:bg-bg-alt"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="flex-shrink-0 relative">
            <button
              onClick={() => {
                setPriceOpen(!priceOpen)
                setDestOpen(false)
                setGuestOpen(false)
              }}
              className="flex-shrink-0 inline-flex items-center bg-bg-alt border border-accent/5 px-4 py-2 rounded-full font-body text-xs font-medium text-text-primary"
            >
              {priceLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {priceOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-accent/5 p-2 z-30">
                {priceRanges.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      if (r.min) params.set("minPrice", r.min)
                      else params.delete("minPrice")
                      if (r.max) params.set("maxPrice", r.max)
                      else params.delete("maxPrice")
                      router.push(`/listings?${params.toString()}`)
                      setPriceOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-body transition-colors ${
                      current.minPrice === r.min && current.maxPrice === r.max
                        ? "bg-accent text-white"
                        : "text-text-primary hover:bg-bg-alt"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
