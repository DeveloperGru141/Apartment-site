"use client"

import { useState } from "react"
import Link from "next/link"
import { images } from "@/lib/images"

interface Listing {
  id: string
  title: string
  description: string | null
  price_monthly: number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  amenities: string[] | null
  image_urls: string[] | null
  created_at: string
  landlord_name: string
  landlord_avatar: string | null
}

export default function ListingCard({ listing, initialFaved = false }: { listing: Listing; initialFaved?: boolean }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [faved, setFaved] = useState(initialFaved)

  const imgs = listing.image_urls?.length
    ? listing.image_urls
    : [images.listingCardFallback]

  return (
    <div className="group">
      <Link href={`/listings/${listing.id}`} className="block">
        {/* Image Carousel */}
        <div
          className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-bg-alt"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgs[imgIdx]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ viewTransitionName: `listing-img-${listing.id}`, contain: "layout" } as React.CSSProperties}
          />

          {/* Heart button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              const prev = faved
              setFaved(!faved)
              ;(async () => {
                try {
                  const method = prev ? "DELETE" : "POST"
                  const res = await fetch("/api/favorites", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ listing_id: listing.id }),
                  })
                  if (!res.ok) throw new Error()
                } catch {
                  setFaved(prev)
                }
              })()
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm z-10"
          >
            <svg
              viewBox="0 0 24 24"
              fill={faved ? "#111" : "none"}
              stroke={faved ? "#111" : "#707070"}
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>

          {/* Hover arrows */}
          {hovered && imgs.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setImgIdx((p) => (p === 0 ? imgs.length - 1 : p - 1))
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setImgIdx((p) => (p === imgs.length - 1 ? 0 : p + 1))
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" className="w-4 h-4">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {imgs.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all ${
                    i === imgIdx
                      ? "w-5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Title */}
      <Link href={`/listings/${listing.id}`}>
        <h3 className="font-heading font-bold text-xl text-text-primary tracking-tight mb-0.5 leading-tight mt-3">
          {listing.title}
        </h3>
      </Link>

      {/* Metrics */}
      <p className="font-body text-xs text-text-muted font-medium">
        {listing.bedrooms} Bed{listing.bedrooms !== 1 ? "s" : ""} &bull;{" "}
        {listing.bathrooms} Bath{listing.bathrooms !== 1 ? "s" : ""} &bull;{" "}
        {listing.sqft?.toLocaleString()} SQFT
      </p>

      {/* Pricing */}
      <p className="font-body font-bold text-sm text-text-primary mt-2">
        ${listing.price_monthly.toLocaleString()}{" "}
        <span className="font-normal text-xs text-text-muted">/month</span>
      </p>
    </div>
  )
}
