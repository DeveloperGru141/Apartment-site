"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-extrabold tracking-[0.3em] text-lg">
            HORIZON
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase text-slate-300">
          <Link href="/properties?status=FOR_RENT" className="hover:text-amber-400 transition-colors">
            Rentals
          </Link>
          <Link href="/properties?status=FOR_SALE" className="hover:text-amber-400 transition-colors">
            Sales
          </Link>
          <Link href="/properties?status=OFF_PLAN" className="hover:text-amber-400 transition-colors">
            Off-Plan
          </Link>
          <Link href="/properties?type=Penthouse" className="hover:text-amber-400 transition-colors">
            Penthouses
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={getWhatsAppInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 border border-amber-400/30 px-4 py-2.5 rounded-none hover:bg-amber-400/10 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            Concierge
          </a>

          <Link
            href="/properties"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors"
          >
            Book Viewing
          </Link>
        </div>
      </div>
    </header>
  )
}
