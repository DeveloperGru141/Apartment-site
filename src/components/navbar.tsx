"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthProvider"

export default function Navbar() {
  const { user, handleLogout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userEmail = user?.email ?? ""
  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "?"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-4 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl flex items-center justify-between">

        <Link href="/" className="text-base font-semibold tracking-wider text-black">
          HORIZON
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-xs font-medium text-gray-500">
          <Link href="/listings" className="hover:text-black transition">Explore Residences</Link>
          <Link href="/dashboard" className="text-black font-semibold">Dashboard</Link>
        </nav>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 border border-gray-200 rounded-full p-1.5 pl-3.5 hover:shadow-sm transition bg-white select-none"
          >
            <span className="text-xs font-medium text-gray-600 hidden md:inline">Account</span>
            <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px] font-semibold tracking-wider">
              {userInitials}
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-gray-50 mb-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Signed in as</p>
                <p className="text-xs text-gray-700 font-medium truncate mt-0.5">{userEmail}</p>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center px-3 py-2 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition"
              >
                Dashboard Overview
              </Link>

              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                className="flex w-full items-center px-3 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50/60 transition text-left"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
