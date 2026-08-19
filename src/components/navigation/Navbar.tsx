"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Phone, Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { useReducedMotion } from "framer-motion"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"
import { signOut } from "@/app/auth/actions"

const NAV_LINKS = [
  { label: "Rentals", href: "/properties?status=For Rent", match: "/properties", status: "For Rent" },
  { label: "Sales", href: "/properties?status=For Sale", match: "/properties", status: "For Sale" },
  { label: "Agents", href: "/agents", match: "/agents" },
  { label: "Journal", href: "/journal", match: "/journal" },
  { label: "List Your Property", href: "/sell", match: "/sell" },
]

export default function Navbar({ user }: { user: { name: string } | null }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reduced = useReducedMotion()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (link: (typeof NAV_LINKS)[number]) => {
    if (pathname !== link.match && !pathname.startsWith(`${link.match}/`)) return false
    if (link.status) return searchParams.get("status") === link.status
    return true
  }

  useEffect(() => {
    if (reduced) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [reduced])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 text-white transition-all duration-300 ease-out"
        style={reduced ? undefined : { height: scrolled ? "4rem" : "5rem" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <span className="font-heading font-extrabold tracking-[0.3em] text-lg">HORIZON</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide uppercase text-slate-300">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors ${
                  isActive(link) ? "text-amber-400" : "hover:text-amber-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={getWhatsAppInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 border border-amber-400/30 px-4 py-2.5 rounded-none hover:bg-amber-400/10 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Concierge
            </a>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {user.name}
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-200 hover:text-amber-400 transition-colors"
              >
                Log In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-slate-950 border-l border-white/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="font-heading font-extrabold tracking-[0.3em] text-lg text-white">
                HORIZON
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-slate-300 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-base font-medium uppercase tracking-wider transition-colors ${
                    isActive(link) ? "text-amber-400" : "text-slate-200 hover:text-amber-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8 border-t border-white/10">
              <a
                href={getWhatsAppInquiryLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-amber-400 border border-amber-400/30 px-4 py-3 hover:bg-amber-400/10 transition-colors"
              >
                <Phone className="w-4 h-4" /> Concierge
              </a>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-slate-200 px-4 py-3 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> {user.name}
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-slate-400 hover:text-amber-400 px-4 py-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-sm uppercase tracking-widest text-slate-200 hover:text-amber-400 px-4 py-3 transition-colors"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}