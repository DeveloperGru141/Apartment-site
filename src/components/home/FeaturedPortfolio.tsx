"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { LISTING_STATUSES, type ListingStatus, type Property } from "@/lib/data/properties"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"
import PropertySpecs from "@/components/properties/PropertySpecs"
import WhatsAppInquiryButton from "@/components/properties/WhatsAppInquiryButton"

const filters: Array<"All" | ListingStatus> = ["All", ...LISTING_STATUSES]

export default function FeaturedPortfolio({ properties }: { properties: Property[] }) {
  const [activeFilter, setActiveFilter] = useState<"All" | ListingStatus>("All")

  const featured = properties.filter((p) => p.featured)

  const filtered =
    activeFilter === "All" ? featured : featured.filter((p) => p.status === activeFilter)

  return (
    <section id="portfolio" className="py-24 bg-bg-primary">
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
            href="/properties"
            className="hidden sm:inline-flex text-sm font-semibold text-text-primary underline underline-offset-4 hover:text-text-muted transition-colors"
          >
            View All
          </Link>
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
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p, i) => (
            <ScrollRevealItem key={p.id} index={i} variant={i % 2 === 0 ? "from-tl" : "from-tr"} className="h-full">
              <div className="group h-full rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100/80 shadow-sm transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-black/10 hover:border-amber-500/30 hover:bg-white hover:-translate-y-1.5">
                <Link href={`/properties/${p.slug}`} className="block">
                  <div
                    className="aspect-[4/3] relative overflow-hidden bg-slate-900"
                    style={{ viewTransitionName: `listing-img-${p.id}`, contain: "layout" }}
                  >
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
                </Link>
                <div className="p-5">
                  <Link href={`/properties/${p.slug}`}>
                    <h3 className="font-heading font-bold text-lg text-text-primary mb-2 group-hover:text-amber-600 transition-colors">
                      {p.title}
                    </h3>
                  </Link>
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
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  )
}