"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/AuthProvider"
import Link from "next/link"
import Navbar from "@/components/navbar"

interface LeaseListing {
  id: string
  price_monthly: number
  bedrooms: number
  bathrooms: number
  title: string
  location: string | null
  image_urls: string[] | null
}

interface Lease {
  id: string
  lease_status: string
  start_date: string | null
  end_date: string | null
  monthly_rent: number | null
  signed_at: string | null
  created_at: string
  listing: LeaseListing | null
}

export default function LeasesPage() {
  const { fetchWithAuth } = useAuth()
  const [leases, setLeases] = useState<Lease[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchLeases = async () => {
      try {
        const response = await fetchWithAuth("/api/leases")
        if (!response.ok) throw new Error("Failed to fetch leases")
        const json = await response.json()
        if (mounted) setLeases((json.data as Lease[]) || [])
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Error loading leases")
      } finally {
        if (mounted) setIsLoadingData(false)
      }
    }

    fetchLeases()
    return () => { mounted = false }
  }, [fetchWithAuth])

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <div className="animate-pulse font-body text-sm text-text-muted">Loading leases...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">
          My Leases
        </h1>
        <p className="font-body text-sm text-text-muted mb-8">
          {leases.length} lease(s)
        </p>

        {error && (
          <div className="rounded-xl bg-red-500/10 text-red-600 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {leases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F9F9F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">No leases yet</h3>
            <p className="font-body text-sm text-text-muted mb-6">Find your next home and start your lease today</p>
            <Link
              href="/listings"
              className="inline-block px-6 py-3 bg-[#111111] text-white font-body font-medium text-xs tracking-wider uppercase rounded-xl hover:bg-neutral-800 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {leases.map((lease) => {
              const listing = lease.listing
              const title = listing?.title ?? "Unknown Property"
              const location = listing?.location ?? ""
              const rent = lease.monthly_rent ?? listing?.price_monthly
              const bedrooms = listing?.bedrooms
              const bathrooms = listing?.bathrooms

              return (
                <div key={lease.id} className="bg-white rounded-2xl border border-[#111111]/10 p-6 hover:border-[#111111]/20 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">
                        {title}
                      </h3>
                      {location && (
                        <p className="font-body text-xs text-text-muted mb-0.5">{location}</p>
                      )}
                      <p className="font-body text-xs text-text-muted">
                        Leased on {new Date(lease.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[lease.lease_status] ?? "bg-gray-100 text-gray-800"}`}>
                      {lease.lease_status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="font-body text-xs text-text-muted mb-1">Bedrooms</p>
                      <p className="font-body text-sm font-semibold text-text-primary">
                        {bedrooms != null ? bedrooms : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-text-muted mb-1">Bathrooms</p>
                      <p className="font-body text-sm font-semibold text-text-primary">
                        {bathrooms != null ? bathrooms : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-text-muted mb-1">Monthly Rent</p>
                      <p className="font-body text-sm font-semibold text-text-primary">
                        {rent != null ? `$${rent.toLocaleString()}` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-text-muted mb-1">Status</p>
                      <p className="font-body text-sm font-semibold text-text-primary capitalize">
                        {lease.lease_status.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#111111]/10">
                    <Link
                      href={`/leases/${lease.id}`}
                      className="text-sm text-text-primary hover:text-text-muted font-medium inline-flex items-center gap-1"
                    >
                      View details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
