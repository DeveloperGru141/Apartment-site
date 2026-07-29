"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/AuthProvider"
import Link from "next/link"
import Navbar from "@/components/navbar"

interface ApplicationUnit {
  id: string
  rent_price: number
  bedrooms: number
  bathrooms: number
  property: {
    title: string
    city: string
    state: string
  }
}

interface Application {
  id: string
  unit_id: string
  applicant_id: string
  status: string
  created_at: string
  unit: ApplicationUnit | null
}

export default function ApplicationsPage() {
  const { fetchWithAuth } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchApplications = async () => {
      try {
        const response = await fetchWithAuth("/api/applications")
        if (!response.ok) throw new Error("Failed to fetch applications")
        const json = await response.json()
        if (mounted) setApplications((json.data as Application[]) || [])
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Error loading applications")
      } finally {
        if (mounted) setIsLoadingData(false)
      }
    }

    fetchApplications()
    return () => { mounted = false }
  }, [fetchWithAuth])

  const statusStyles: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-gray-100 text-gray-800",
    under_review: "bg-blue-100 text-blue-800",
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <div className="animate-pulse font-['Inter'] text-sm text-[#707070]">Loading applications...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-[#111111] mb-2">
          My Applications
        </h1>
        <p className="font-['Inter'] text-sm text-[#707070] mb-8">
          {applications.length} application(s)
        </p>

        {error && (
          <div className="rounded-xl bg-red-500/10 text-red-600 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#F9F9F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#707070]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg text-[#111111] mb-2">No applications yet</h3>
            <p className="font-['Inter'] text-sm text-[#707070] mb-6">Start your first rental application today</p>
            <Link
              href="/listings"
              className="inline-block px-6 py-3 bg-[#111111] text-white font-['Inter'] font-medium text-xs tracking-wider uppercase rounded-xl hover:bg-neutral-800 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const unit = app.unit
              const title = unit?.property?.title ?? "Unknown Property"
              const city = unit?.property?.city ?? ""
              const state = unit?.property?.state ?? ""
              const location = city && state ? `${city}, ${state}` : ""
              const rent = unit?.rent_price
              const bedrooms = unit?.bedrooms
              const bathrooms = unit?.bathrooms

              return (
                <div key={app.id} className="bg-white rounded-2xl border border-[#111111]/10 p-6 hover:border-[#111111]/20 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-lg text-[#111111] mb-1">
                        {title}
                      </h3>
                      {location && (
                        <p className="font-['Inter'] text-xs text-[#707070] mb-0.5">{location}</p>
                      )}
                      <p className="font-['Inter'] text-xs text-[#707070]">
                        Applied on {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[app.status] ?? "bg-gray-100 text-gray-800"}`}>
                      {app.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="font-['Inter'] text-xs text-[#707070] mb-1">Bedrooms</p>
                      <p className="font-['Inter'] text-sm font-semibold text-[#111111]">
                        {bedrooms != null ? bedrooms : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Inter'] text-xs text-[#707070] mb-1">Bathrooms</p>
                      <p className="font-['Inter'] text-sm font-semibold text-[#111111]">
                        {bathrooms != null ? bathrooms : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Inter'] text-xs text-[#707070] mb-1">Monthly Rent</p>
                      <p className="font-['Inter'] text-sm font-semibold text-[#111111]">
                        {rent != null ? `$${rent.toLocaleString()}` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Inter'] text-xs text-[#707070] mb-1">Status</p>
                      <p className="font-['Inter'] text-sm font-semibold text-[#111111] capitalize">
                        {app.status.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#111111]/10">
                    <Link
                      href={`/applications/${app.id}`}
                      className="text-sm text-[#111111] hover:text-[#666666] font-medium inline-flex items-center gap-1"
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
