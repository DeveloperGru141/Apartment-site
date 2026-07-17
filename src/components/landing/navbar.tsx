"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthProvider"

const landingLinks = [
  { label: "Home", href: "/#home" },
  { label: "Browse", href: "/listings" },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
]

const appLinks = [
  { label: "Explore Residences", href: "/listings" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, handleLogout } = useAuth()
  const pathname = usePathname()

  const isLanding = pathname === "/"
  const isAuth = pathname === "/login" || pathname === "/signup"

  const navLinks = isLanding ? landingLinks : appLinks

  return (
    <>
      <nav className="sticky top-4 mx-auto w-[92%] bg-white/40 backdrop-blur-lg border border-white/30 shadow-sm rounded-full z-50">
        <div className="flex items-center justify-between w-full px-6 md:px-8 py-3">
          <Link
            href="/"
            className="font-heading font-extrabold tracking-widest text-xl text-text-primary uppercase"
          >
            HORIZON
          </Link>

          {!isAuth && (
            <div className="hidden md:flex gap-10 items-center">
              {navLinks.map((link) =>
                link.href.startsWith("#") || link.href.startsWith("/#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`font-body font-medium text-sm transition-colors duration-300 ${
                      pathname === link.href
                        ? "text-text-muted"
                        : "text-text-primary hover:text-text-muted"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`font-body font-medium text-sm transition-colors duration-300 ${
                      pathname.startsWith(link.href) && link.href !== "/"
                        ? "text-text-muted"
                        : "text-text-primary hover:text-text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          )}

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {!isAuth && (
                  <Link
                    href="/dashboard"
                    className="font-body font-medium text-sm text-text-primary transition-colors duration-300 hover:text-text-muted"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="font-body font-semibold text-xs uppercase tracking-wider px-6 py-3 bg-[#111111] text-white rounded-none transition-colors duration-300 hover:bg-[#222222]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-body font-medium text-sm text-text-primary transition-colors duration-300 hover:text-text-muted"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="font-body font-semibold text-xs uppercase tracking-wider px-6 py-3 bg-[#111111] text-white rounded-none transition-colors duration-300 hover:bg-[#222222]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="block md:hidden p-2 z-50 relative"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-0.5 w-5 bg-[#111111] transition-all duration-300 ease-out ${open ? "translate-y-2 rotate-45" : "rotate-0 translate-y-0"}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#111111] mt-1.5 transition-all duration-300 ease-out ${open ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#111111] mt-1.5 transition-all duration-300 ease-out ${open ? "-translate-y-2 -rotate-45" : "-rotate-0 translate-y-0"}`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`bg-white/95 backdrop-blur-xl w-full h-screen fixed inset-0 z-50 p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/"
            className="font-['Plus_Jakarta_Sans'] font-extrabold text-base tracking-widest text-[#111111] uppercase"
            onClick={() => setOpen(false)}
          >
            HORIZON
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 -mr-2 text-[#111111] scale-110"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {isLanding ? (
            <>
              <a href="/#home" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Home</a>
              <Link href="/listings" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Browse</Link>
              <a href="/#services" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Services</a>
              <a href="/#about" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>About Us</a>
              <a href="/#blog" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Blog</a>
              <a href="/#contact" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Contact</a>
            </>
          ) : (
            <>
              <Link href="/listings" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Explore Residences</Link>
              <Link href="/#services" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Premium Services</Link>
              <Link href="/#portfolio" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Our Portfolio</Link>
              <Link href="/#blog" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>The Horizon Journal</Link>
              <Link href="/#contact" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Contact Concierge</Link>
              {user && (
                <Link href="/dashboard" className="block font-['Plus_Jakarta_Sans'] font-normal text-2xl text-[#111111] tracking-tight" onClick={() => setOpen(false)}>Dashboard</Link>
              )}
            </>
          )}
        </div>

        <div className="border-t border-[#111111]/10 pt-6 w-full mb-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block border border-[#111111] text-[#111111] font-['Inter'] font-semibold text-xs uppercase tracking-widest rounded-full w-full py-3.5 mb-3 text-center"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false) }}
                className="font-['Inter'] font-medium text-xs text-neutral-500 uppercase tracking-wider w-full text-center py-2 hover:text-[#111111] transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block border border-[#111111] text-[#111111] font-['Inter'] font-semibold text-xs uppercase tracking-widest rounded-full w-full py-3.5 mb-3 text-center"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block font-['Inter'] font-medium text-xs text-neutral-500 uppercase tracking-wider w-full text-center py-2 hover:text-[#111111] transition-colors"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
