"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LAGOS_IMAGES } from "@/lib/images"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

const filters = ["All", "Penthouses", "Waterfront", "Maisonettes", "Sky Suites"]

const typeFilterMap: Record<string, string | undefined> = {
  Penthouses: "Penthouse",
  Waterfront: "Waterfront Villa",
  Maisonettes: "Maisonette",
  "Sky Suites": "Sky Suite",
}

const properties = LAGOS_IMAGES.listings

export default function FeaturedPortfolio() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filtered = activeFilter === "All"
    ? properties
    : properties.filter((p) => {
        const matchedType = typeFilterMap[activeFilter]
        return matchedType ? p.type === matchedType : true
      })

  return (
    <section className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-text-muted mb-2">
              Curated Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-text-primary">
              Featured Portfolio
            </h2>
          </div>
          <Link
            href="/listings"
            className="text-sm font-semibold text-text-primary underline underline-offset-4 hover:text-text-muted transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={
                activeFilter === f
                  ? "px-4 py-2 rounded-full bg-bg-dark text-white text-sm font-medium transition-colors"
                  : "px-4 py-2 rounded-full bg-bg-alt text-text-muted text-sm font-medium hover:bg-gray-200 transition-colors"
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
            <div
              className="group rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-white/90"
            >
              <Link href={`/listings/${p.id}`}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={p.image || LAGOS_IMAGES.hero.main}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-md text-text-primary text-xs font-bold px-3 py-1.5 rounded-md border border-white/30">
                    {p.price}
                  </div>
                  <div className="absolute top-3 right-3 bg-accent/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-md border border-white/20">
                    {p.status}
                  </div>
                </div>
              </Link>
              <div className="p-5 bg-white/40 backdrop-blur-sm">
                <Link href={`/listings/${p.id}`}>
                  <h3 className="font-heading font-bold text-lg text-text-primary mb-2 hover:underline">
                    {p.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{p.location}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
                  <span>{p.beds} Beds</span>
                  <span>{p.baths} Baths</span>
                  <span>{p.sqft.toLocaleString()} sqft</span>
                </div>
                <a
                  href={getWhatsAppInquiryLink({ title: p.title, location: p.location, price: p.price })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs tracking-wider uppercase rounded-lg py-2.5 font-semibold transition-colors"
                >
                  Inquire via WhatsApp
                </a>
              </div>
            </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
