"use client"

import Link from "next/link"
import Navbar from "@/components/landing/navbar"
import { useAuth } from "@/lib/auth/AuthProvider"

export default function DashboardPage() {
  const { user, isLoading, handleLogout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse font-['Inter'] text-sm text-[#707070]">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-[#111111] mb-2">
          Dashboard
        </h1>
        <p className="font-['Inter'] text-sm text-[#707070] mb-8">
          Welcome back{user?.email ? `, ${user.email}` : ""}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/listings"
            className="block p-6 rounded-2xl border border-[#111111]/5 bg-[#F9F9F9] hover:bg-white hover:border-[#111111]/20 transition-all"
          >
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#111111] mb-1">
              Browse Listings
            </h2>
            <p className="font-['Inter'] text-xs text-[#707070]">
              Explore available residences
            </p>
          </Link>

          <Link
            href="/listings"
            className="block p-6 rounded-2xl border border-[#111111]/5 bg-[#F9F9F9] hover:bg-white hover:border-[#111111]/20 transition-all"
          >
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#111111] mb-1">
              My Favorites
            </h2>
            <p className="font-['Inter'] text-xs text-[#707070]">
              View saved properties
            </p>
          </Link>

          <Link
            href="/applications"
            className="block p-6 rounded-2xl border border-[#111111]/5 bg-[#F9F9F9] hover:bg-white hover:border-[#111111]/20 transition-all"
          >
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#111111] mb-1">
              Applications
            </h2>
            <p className="font-['Inter'] text-xs text-[#707070]">
              Track your rental applications
            </p>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-[#111111]/10">
          <button
            onClick={handleLogout}
            className="text-sm text-[#707070] hover:text-[#111111] underline transition-colors"
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  )
}
