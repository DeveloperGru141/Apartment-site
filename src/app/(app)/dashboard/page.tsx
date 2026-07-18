"use client"

import Link from "next/link"
import Navbar from "@/components/navbar"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import { useAuth } from "@/lib/auth/AuthProvider"

const BrowseIcon = () => (
  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
  </svg>
)

const ApplicationsIcon = () => (
  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
)

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const userEmail = user?.email ?? ""

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="min-h-[85vh] bg-white px-6 py-16 md:px-16 lg:px-24">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-[85vh] bg-white px-6 py-16 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl">

          <div className="border-b border-gray-100 pb-8 mb-12">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Welcome back, <span className="font-normal text-gray-500">{userEmail}</span>
            </h1>
            <p className="mt-2 text-xs text-gray-400">
              Manage your rental profile data tracking matrix and application approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <Link
              href="/listings"
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md bg-white"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 transition-colors group-hover:bg-gray-100">
                  <BrowseIcon />
                </div>
                <h3 className="mt-5 text-sm font-semibold text-gray-900">Browse Listings</h3>
                <p className="mt-1.5 text-xs text-gray-400 font-light leading-relaxed">
                  Explore available modern residences ready for immediate lease applications.
                </p>
              </div>
            </Link>

            <Link
              href="/applications"
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md bg-white"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 transition-colors group-hover:bg-gray-100">
                  <ApplicationsIcon />
                </div>
                <h3 className="mt-5 text-sm font-semibold text-gray-900">Applications</h3>
                <p className="mt-1.5 text-xs text-gray-400 font-light leading-relaxed">
                  Monitor live screening status, credit verifications, and property background checks.
                </p>
              </div>
            </Link>

          </div>

        </div>
      </main>
    </div>
  )
}
