"use client"

import { useEffect, useState } from "react"
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
  status: string
  is_verified: boolean
  created_at: string
  updated_at: string
  landlord_name: string
  landlord_avatar: string | null
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
        body: JSON.stringify({ listing_id: id }),
      })
      if (!res.ok) throw new Error("Failed to update favorite")
    } catch {
      setFavorited(prev)
    }
  }

  if (loading) return null
  if (error) return <ErrorState message={error} />
  if (!listing) return <NotFound />

  const allImages = listing.image_urls?.length
    ? listing.image_urls
    : [images.listingDetailFallback]

  return (
    <>
      {/* Hero Gallery */}
      <div className="relative">
        <div className="h-[50vh] md:h-[65vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={allImages[selectedImage]}
            alt={listing.title}
            className="w-full h-full object-cover"
            style={{ viewTransitionName: `listing-img-${id}`, contain: "layout" } as React.CSSProperties}
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
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-text-primary text-sm font-body font-medium px-4 py-2 rounded-xl hover:bg-white transition-colors flex items-center gap-2 shadow-sm"
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
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
                {listing.title}
              </h1>
              <p className="font-body text-text-muted mt-1">
                {listing.location}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-body text-text-body">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-accent/5">
                  <BedIcon /> {listing.bedrooms} Bedrooms
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-accent/5">
                  <BathIcon /> {listing.bathrooms} Bathrooms
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-accent/5">
                  <SqftIcon /> {listing.sqft?.toLocaleString()} sqft
                </span>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 border border-accent/5">
              <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <OverviewItem label="Monthly Rent" value={`${listing.currency} ${listing.price_monthly.toLocaleString()}`} />
                <OverviewItem label="Status" value={listing.status.charAt(0).toUpperCase() + listing.status.slice(1)} />
                <OverviewItem label="Bedrooms" value={String(listing.bedrooms)} />
                <OverviewItem label="Bathrooms" value={String(listing.bathrooms)} />
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-2xl p-6 border border-accent/5">
                <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
                  Description
                </h2>
                <p className="font-body text-sm text-text-body leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-accent/5">
                <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 border border-accent/5 sticky top-24">
              <p className="font-heading font-bold text-3xl text-text-primary">
                {listing.currency} {listing.price_monthly.toLocaleString()}
                <span className="text-sm font-body font-normal text-text-muted">
                  /month
                </span>
              </p>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-accent text-white font-body font-semibold text-sm py-3.5 rounded-xl hover:bg-[#2a2a2a] transition-colors">
                  Apply Now
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`w-full font-body font-medium text-sm py-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                    favorited
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-accent/10 text-text-body hover:border-accent/30"
                  }`}
                >
                  <HeartIcon filled={favorited} />
                  {favorited ? "Saved" : "Save to Favorites"}
                </button>
              </div>
            </div>

            {/* Landlord */}
            <div className="bg-white rounded-2xl p-6 border border-accent/5">
              <h3 className="font-heading font-bold text-sm text-text-primary mb-4">
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
                  <p className="font-body font-semibold text-sm text-text-primary">
                    {listing.landlord_name}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    Property Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-xs text-text-muted">{label}</p>
      <p className="font-body font-semibold text-sm text-text-primary mt-0.5">
        {value}
      </p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="pb-16 flex flex-col items-center justify-center">
      <p className="font-body text-text-muted text-lg mb-4">{message}</p>
      <Link
        href="/listings"
        className="text-sm font-body text-text-primary underline underline-offset-2"
      >
        Browse all listings
      </Link>
    </div>
  )
}

function NotFound() {
  return (
    <div className="pb-16 flex flex-col items-center justify-center">
      <p className="font-body text-text-muted text-lg mb-4">
        Listing not found
      </p>
      <Link
        href="/listings"
        className="text-sm font-body text-text-primary underline underline-offset-2"
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
