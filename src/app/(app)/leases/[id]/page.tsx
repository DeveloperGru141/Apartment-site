"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth/AuthProvider"
import { images } from "@/lib/images"

interface LeaseDetail {
  id: string
  lease_status: string
  start_date: string | null
  end_date: string | null
  monthly_rent: number | null
  signed_at: string | null
  created_at: string
  listing: {
    id: string
    price_monthly: number
    bedrooms: number
    bathrooms: number
    title: string
    location: string | null
    image_urls: string[] | null
  } | null
}

export default function LeaseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { fetchWithAuth } = useAuth()
  const [lease, setLease] = useState<LeaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetchWithAuth(`/api/leases/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Lease not found")
        return r.json()
      })
      .then((json) => {
        if (mounted) setLease(json.data)
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [id, fetchWithAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <div className="animate-pulse font-body text-sm text-text-muted">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !lease) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
          <p className="font-body text-sm text-text-muted mb-4">{error ?? "Lease not found"}</p>
          <Link href="/leases" className="text-sm text-text-primary underline underline-offset-2">
            &larr; Back to leases
          </Link>
        </main>
      </div>
    )
  }

  const listing = lease.listing
  const title = listing?.title ?? "Unknown Property"
  const location = listing?.location ?? ""
  const rent = lease.monthly_rent ?? listing?.price_monthly
  const imgSrc = listing?.image_urls?.[0] || images.listingCardFallback

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Link
          href="/leases"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to leases
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="font-heading font-bold text-2xl text-text-primary">
                  {title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[lease.lease_status] ?? "bg-gray-100 text-gray-800"}`}>
                  {lease.lease_status.replace(/_/g, " ")}
                </span>
              </div>
              {location && (
                <p className="font-body text-sm text-text-muted">{location}</p>
              )}
            </div>

            {listing && (
              <div className="bg-white rounded-2xl border border-[#111111]/10 p-6">
                <h2 className="font-heading font-semibold text-base text-text-primary mb-4">
                  Unit Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="font-body text-xs text-text-muted mb-1">Bedrooms</p>
                    <p className="font-body text-sm font-semibold text-text-primary">{listing.bedrooms}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text-muted mb-1">Bathrooms</p>
                    <p className="font-body text-sm font-semibold text-text-primary">{listing.bathrooms}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text-muted mb-1">Monthly Rent</p>
                    <p className="font-body text-sm font-semibold text-text-primary">${rent?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-text-muted mb-1">Lease Status</p>
                    <p className="font-body text-sm font-semibold text-text-primary capitalize">
                      {lease.lease_status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#111111]/10 p-6">
              <h2 className="font-heading font-semibold text-base text-text-primary mb-4">
                Lease Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="font-body text-xs text-text-muted mb-1">Created</p>
                  <p className="font-body text-sm font-semibold text-text-primary">
                    {new Date(lease.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted mb-1">Start Date</p>
                  <p className="font-body text-sm font-semibold text-text-primary">
                    {lease.start_date ? new Date(lease.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-body text-xs text-text-muted mb-1">End Date</p>
                  <p className="font-body text-sm font-semibold text-text-primary">
                    {lease.end_date ? new Date(lease.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={title}
              className="w-full aspect-[4/3] object-cover rounded-2xl"
            />

            {listing && (
              <Link
                href={`/listings/${listing.id}`}
                className="block w-full bg-[#111111] text-white font-body font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xl text-center hover:bg-neutral-800 transition-all"
              >
                View Listing
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
