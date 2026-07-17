"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ListingCard from "@/components/listings/ListingCard"

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
  amenities: string[] | null
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
  reviews: Review[]
  similar: Listing[]
}

interface Review {
  id: string
  overall_rating: number
  title: string | null
  comment: string | null
  reviewer_name: string
  reviewer_avatar: string | null
  created_at: string
}

export default function ListingDetailContent({ id }: { id: string }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/units/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load listing")
        return r.json()
      })
      .then((json) => {
        if (cancelled) return
        if (json.data) {
          setListing(json.data)
        } else {
          setError("Listing not found")
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  const toggleFavorite = async () => {
    const prev = favorited
    setFavorited(!favorited)
    try {
      const method = prev ? "DELETE" : "POST"
      const res = await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unit_id: id }),
      })
      if (!res.ok) throw new Error("Failed to update favorite")
    } catch {
      setFavorited(prev)
    }
  }

  if (loading) return null
  if (error) return <ErrorState message={error} />
  if (!listing) return <NotFound />

  const allImages = listing.images?.length
    ? listing.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"]

  const avgRating =
    listing.reviews.length > 0
      ? (
          listing.reviews.reduce((s, r) => s + r.overall_rating, 0) /
          listing.reviews.length
        ).toFixed(1)
      : null

  return (
    <>
      {/* Hero Gallery */}
      <div className="relative">
        <div className="h-[50vh] md:h-[65vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={allImages[selectedImage]}
            alt={listing.property_title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === selectedImage
                    ? "border-white ring-2 ring-white/50"
                    : "border-white/40 opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <Link
          href="/listings"
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-[#111111] text-sm font-body font-medium px-4 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title + location */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#111111]">
                    {listing.property_title}
                  </h1>
                  <p className="font-body text-[#666666] mt-1">
                    {listing.address_line1}, {listing.city}, {listing.state}{" "}
                    {listing.zip_code}
                  </p>
                  {listing.neighborhood && (
                    <p className="font-body text-xs text-[#888888] mt-0.5">
                      {listing.neighborhood}
                    </p>
                  )}
                </div>
                <span className="inline-block bg-[#111111] text-white text-[10px] font-body font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap">
                  {listing.property_type}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-body text-[#555555]">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#111111]/5">
                  <BedIcon /> {listing.bedrooms} Bedrooms
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#111111]/5">
                  <BathIcon /> {listing.bathrooms} Bathrooms
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#111111]/5">
                  <SqftIcon /> {listing.square_feet?.toLocaleString()} sqft
                </span>
                {listing.walk_score != null && (
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#111111]/5">
                    <WalkIcon /> Walk Score {listing.walk_score}
                  </span>
                )}
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/5">
              <h2 className="font-heading font-bold text-lg text-[#111111] mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <OverviewItem label="Monthly Rent" value={`$${listing.rent_price.toLocaleString()}`} />
                <OverviewItem label="Deposit" value={`$${listing.deposit_amount.toLocaleString()}`} />
                <OverviewItem label="Available" value={listing.available_from ? new Date(listing.available_from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Now"} />
                <OverviewItem label="Unit" value={listing.unit_number} />
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#111111]/5">
                <h2 className="font-heading font-bold text-lg text-[#111111] mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="text-xs font-body bg-[#f0eeeb] text-[#444444] px-3 py-1.5 rounded-lg"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg text-[#111111]">
                  Reviews
                </h2>
                {avgRating && (
                  <span className="flex items-center gap-1 text-sm font-body font-medium text-[#111111]">
                    <StarIcon /> {avgRating} ({listing.reviews.length})
                  </span>
                )}
              </div>
              {listing.reviews.length === 0 ? (
                <p className="font-body text-sm text-[#666666]">
                  No reviews yet for this unit.
                </p>
              ) : (
                <div className="space-y-4">
                  {listing.reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/5 sticky top-24">
              <p className="font-heading font-bold text-3xl text-[#111111]">
                ${listing.rent_price.toLocaleString()}
                <span className="text-sm font-body font-normal text-[#666666]">
                  /month
                </span>
              </p>
              <p className="font-body text-xs text-[#888888] mt-1">
                ${listing.deposit_amount.toLocaleString()} deposit required
              </p>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-[#111111] text-white font-body font-semibold text-sm py-3.5 rounded-xl hover:bg-[#2a2a2a] transition-colors">
                  Apply Now
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`w-full font-body font-medium text-sm py-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                    favorited
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-[#111111]/10 text-[#555555] hover:border-[#111111]/30"
                  }`}
                >
                  <HeartIcon filled={favorited} />
                  {favorited ? "Saved" : "Save to Favorites"}
                </button>
              </div>
            </div>

            {/* Landlord */}
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/5">
              <h3 className="font-heading font-bold text-sm text-[#111111] mb-4">
                Listed by
              </h3>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    listing.landlord_avatar ??
                    "https://i.pravatar.cc/64?img=1"
                  }
                  alt={listing.landlord_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-body font-semibold text-sm text-[#111111]">
                    {listing.landlord_name}
                  </p>
                  <p className="font-body text-xs text-[#666666]">
                    Property Manager
                  </p>
                </div>
              </div>
            </div>

            {/* Similar Units */}
            {listing.similar.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-base text-[#111111] mb-3">
                  Similar Units
                </h3>
                <div className="space-y-3">
                  {listing.similar.map((u) => (
                    <ListingCard key={u.unit_id} listing={u} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-xs text-[#888888]">{label}</p>
      <p className="font-body font-semibold text-sm text-[#111111] mt-0.5">
        {value}
      </p>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-[#111111]/5 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3 mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            review.reviewer_avatar ?? "https://i.pravatar.cc/64?img=3"
          }
          alt={review.reviewer_name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-body font-semibold text-sm text-[#111111]">
            {review.reviewer_name}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  filled={i < review.overall_rating}
                  small
                />
              ))}
            </div>
            <span className="font-body text-[10px] text-[#888888]">
              {new Date(review.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      {review.title && (
        <p className="font-body font-semibold text-sm text-[#111111] mb-1">
          {review.title}
        </p>
      )}
      {review.comment && (
        <p className="font-body text-sm text-[#555555] leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="pb-16 flex flex-col items-center justify-center">
      <p className="font-body text-[#666666] text-lg mb-4">{message}</p>
      <Link
        href="/listings"
        className="text-sm font-body text-[#111111] underline underline-offset-2"
      >
        Browse all listings
      </Link>
    </div>
  )
}

function NotFound() {
  return (
    <div className="pb-16 flex flex-col items-center justify-center">
      <p className="font-body text-[#666666] text-lg mb-4">
        Listing not found
      </p>
      <Link
        href="/listings"
        className="text-sm font-body text-[#111111] underline underline-offset-2"
      >
        Browse all listings
      </Link>
    </div>
  )
}

function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M3 7v11m0-4h18m0 4V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4h18z" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M4 16h16M7 16h.01M12 16h.01M17 16h.01M4 20h16M8 5l-2 3h12l-2-3M4 12V8a4 4 0 014-4h8a4 4 0 014 4v4" />
    </svg>
  )
}

function SqftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M13 5a2 2 0 100-4 2 2 0 000 4z" />
      <path d="M11 22l2-8-3-3-1 4-4-2" />
      <path d="M14 16l1-4 3 3 3-1" />
    </svg>
  )
}

function StarIcon({ filled, small }: { filled?: boolean; small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className={small ? "w-3 h-3" : "w-4 h-4"}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className="w-4 h-4"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}
