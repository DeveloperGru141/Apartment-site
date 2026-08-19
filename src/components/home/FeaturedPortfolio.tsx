"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"
import { LISTING_STATUSES, type ListingStatus, type Property } from "@/lib/data/properties"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"
import PropertySpecs from "@/components/properties/PropertySpecs"
import WhatsAppInquiryButton from "@/components/properties/WhatsAppInquiryButton"

const filters: Array<"All" | ListingStatus> = ["All", ...LISTING_STATUSES]

const EASE = [0.16, 1, 0.3, 1] as const

export default function FeaturedPortfolio({ properties }: { properties: Property[] }) {
  const [activeFilter, setActiveFilter] = useState<"All" | ListingStatus>("All")

  const featured = properties.filter((p) => p.featured)

  const filtered =
    activeFilter === "All" ? featured : featured.filter((p) => p.status === activeFilter)

  return (
    <section id="portfolio" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-text-muted mb-2">
              Curated Collection
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-text-primary">
              Featured Portfolio
            </h2>
            <p className="mt-3 max-w-xl text-text-muted">
              Handpicked residences across Lagos&rsquo; most sought-after addresses — each one
              inspected and vetted in person by our principals.
            </p>
          </div>
          <p className="hidden md:block text-sm text-text-muted border-l-2 border-amber-500 pl-4 leading-relaxed">
            {featured.length} active listings
            <br />
            {activeFilter !== "All" ? `filtered by ${activeFilter}` : "curated this quarter"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f ? "text-white" : "bg-bg-alt text-text-muted hover:bg-gray-200"
              }`}
            >
              {activeFilter === f && (
                <motion.span
                  layoutId="featured-filter-pill"
                  className="absolute inset-0 rounded-full bg-bg-dark"
                  transition={{ duration: 0.4, ease: EASE }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                variants={{
                  initial: { opacity: 0, x: i % 2 === 0 ? -56 : 56, scale: 0.98 },
                  enter: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: {
                      duration: 0.55,
                      ease: EASE,
                      delay: Math.min(i, 3) * 0.06,
                    },
                  },
                  exit: {
                    opacity: 0,
                    x: i % 2 === 0 ? 56 : -56,
                    scale: 0.98,
                    transition: { duration: 0.35, ease: EASE },
                  },
                }}
                initial="initial"
                whileInView="enter"
                exit="exit"
                viewport={{ once: true, margin: "-40px" }}
                className="h-full"
              >
                <div className="group h-full rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100/80 shadow-sm transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-black/10 hover:border-amber-500/30 hover:bg-white hover:-translate-y-1.5">
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                    <ImageWithShimmer
                      src={p.images[0] ?? ""}
                      alt={p.title}
                      className="h-full w-full"
                      priority={i < 2}
                      imgClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10">
                      {p.status}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-text-primary text-xs font-bold px-3 py-1.5 rounded-md border border-white/40 shadow-sm">
                      {p.priceLabel}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-text-primary mb-2 group-hover:text-amber-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                    <PropertySpecs bedrooms={p.bedrooms} bathrooms={p.bathrooms} sqft={p.sqft} />
                    <WhatsAppInquiryButton
                      title={p.title}
                      location={p.location}
                      price={p.priceLabel}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}