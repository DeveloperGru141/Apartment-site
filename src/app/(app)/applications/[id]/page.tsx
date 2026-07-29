"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { images } from "@/lib/images"

interface ApplicationDetail {
  id: string
  status: string
  created_at: string
  move_in_date: string
  lease_term_months: number
  unit: {
    id: string
    rent_price: number
    bedrooms: number
    bathrooms: number
    square_feet: number
    images: string[]
    property: {
      title: string
      city: string
      state: string
      address_line1: string
    }
  }
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [app, setApp] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch(`/api/applications/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Application not found")
        return r.json()
      })
      .then((json) => {
        if (mounted) setApp(json.data)
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <div className="animate-pulse font-['Inter'] text-sm text-[#707070]">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
          <p className="font-['Inter'] text-sm text-[#707070] mb-4">{error ?? "Application not found"}</p>
          <Link href="/applications" className="text-sm text-[#111111] underline underline-offset-2">
            &larr; Back to applications
          </Link>
        </main>
      </div>
    )
  }

  const unit = app.unit
  const property = unit?.property
  const imgSrc = unit?.images?.[0] || images.listingCardFallback

  const statusStyles: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
    under_review: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs text-[#707070] hover:text-[#111111] transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to applications
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#111111]">
                  {property?.title ?? "Application"}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[app.status] ?? "bg-gray-100 text-gray-800"}`}>
                  {app.status.replace(/_/g, " ")}
                </span>
              </div>
              {property && (
                <p className="font-['Inter'] text-sm text-[#707070]">
                  {property.address_line1}, {property.city}, {property.state}
                </p>
              )}
            </div>

            {unit && (
              <div className="bg-white rounded-2xl border border-[#111111]/10 p-6">
                <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#111111] mb-4">
                  Unit Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="font-['Inter'] text-xs text-[#707070] mb-1">Bedrooms</p>
                    <p className="font-['Inter'] text-sm font-semibold text-[#111111]">{unit.bedrooms}</p>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-xs text-[#707070] mb-1">Bathrooms</p>
                    <p className="font-['Inter'] text-sm font-semibold text-[#111111]">{unit.bathrooms}</p>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-xs text-[#707070] mb-1">Square Feet</p>
                    <p className="font-['Inter'] text-sm font-semibold text-[#111111]">{unit.square_feet?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-xs text-[#707070] mb-1">Monthly Rent</p>
                    <p className="font-['Inter'] text-sm font-semibold text-[#111111]">${unit.rent_price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#111111]/10 p-6">
              <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-base text-[#111111] mb-4">
                Application Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="font-['Inter'] text-xs text-[#707070] mb-1">Submitted</p>
                  <p className="font-['Inter'] text-sm font-semibold text-[#111111]">
                    {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter'] text-xs text-[#707070] mb-1">Move-in Date</p>
                  <p className="font-['Inter'] text-sm font-semibold text-[#111111]">
                    {app.move_in_date ? new Date(app.move_in_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </p>
                </div>
                <div>
                  <p className="font-['Inter'] text-xs text-[#707070] mb-1">Lease Term</p>
                  <p className="font-['Inter'] text-sm font-semibold text-[#111111]">
                    {app.lease_term_months ? `${app.lease_term_months} months` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={property?.title ?? "Unit"}
              className="w-full aspect-[4/3] object-cover rounded-2xl"
            />

            <Link
              href={`/listings/${unit?.id}`}
              className="block w-full bg-[#111111] text-white font-['Inter'] font-semibold text-xs tracking-wider uppercase py-3.5 rounded-xl text-center hover:bg-neutral-800 transition-all"
            >
              View Listing
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
