"use client"

import { useState } from "react"
import Link from "next/link"

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

export default function ListingCard({ listing }: { listing: Listing }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [faved, setFaved] = useState(false)

  const images = listing.images?.length
    ? listing.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"]

  const tag = `${listing.property_type.toUpperCase()} · ${listing.city.toUpperCase()}`

  return (
    <div className="group">
      <Link href={`/listings/${listing.unit_id}`} className="block">
        {/* Image Carousel */}
        <div
          className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#F0EEED]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[imgIdx]}
            alt={listing.property_title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Hover arrows */}
          {hovered && images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setImgIdx((p) => (p === 0 ? images.length - 1 : p - 1))
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
                  setImgIdx((p) => (p === images.length - 1 ? 0 : p + 1))
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
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
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

      {/* Asset Tag Row */}
      <div className="flex items-center justify-between mt-3 mb-1">
        <span className="font-['Inter'] font-bold text-[10px] tracking-widest text-[#707070] uppercase">
          {tag}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault()
            setFaved(!faved)
          }}
          className="p-1 -mr-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill={faved ? "#111" : "none"}
            stroke={faved ? "#111" : "#707070"}
            strokeWidth="2"
            className="w-4 h-4 transition-colors"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <Link href={`/listings/${listing.unit_id}`}>
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#111111] tracking-tight mb-0.5 leading-tight">
          {listing.property_title}
        </h3>
      </Link>

      {/* Metrics */}
      <p className="font-['Inter'] text-xs text-[#707070] font-medium">
        {listing.bedrooms} Bed{listing.bedrooms !== 1 ? "s" : ""} &bull;{" "}
        {listing.bathrooms} Bath{listing.bathrooms !== 1 ? "s" : ""} &bull;{" "}
        {listing.square_feet?.toLocaleString()} SQFT
      </p>

      {/* Pricing */}
      <p className="font-['Inter'] font-bold text-sm text-[#111111] mt-2">
        ${listing.rent_price.toLocaleString()}{" "}
        <span className="font-normal text-xs text-[#707070]">/month</span>
      </p>
    </div>
  )
}
