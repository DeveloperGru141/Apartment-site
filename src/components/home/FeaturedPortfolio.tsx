"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { LISTING_STATUSES, type ListingStatus, type Property } from "@/lib/data/properties"
import PropertyCard from "@/components/properties/PropertyCard"
import Section from "@/components/shared/Section"
import Container from "@/components/shared/Container"

const filters: Array<"All" | ListingStatus> = ["All", ...LISTING_STATUSES]

const EASE = [0.16, 1, 0.3, 1] as const

export default function FeaturedPortfolio({ properties }: { properties: Property[] }) {
  const [activeFilter, setActiveFilter] = useState<"All" | ListingStatus>("All")
  const reduced = useReducedMotion()

  const featured = properties.filter((p) => p.featured)

  const filtered =
    activeFilter === "All" ? featured : featured.filter((p) => p.status === activeFilter)

  const counts: Record<"All" | ListingStatus, number> = {
    All: featured.length,
    "For Rent": featured.filter((p) => p.status === "For Rent").length,
    "For Sale": featured.filter((p) => p.status === "For Sale").length,
  }

  const aside =
    activeFilter === "All"
      ? `${featured.length} featured residences`
      : `Showing ${filtered.length} for ${activeFilter === "For Sale" ? "sale" : "rent"}`

  return (
    <Section tone="paper" id="portfolio">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <h2 className="type-h2 text-fg">
              Featured Portfolio
            </h2>
            <p className="mt-3 text-fg-muted type-body">
              Handpicked residences across Lagos&rsquo; most sought-after addresses — each one
              inspected and vetted in person by our principals.
            </p>
          </div>
          <p className="hidden md:block text-sm text-fg-muted border-l-2 border-amber-500 pl-4 leading-relaxed">
            {aside}
          </p>
        </div>

        <div role="group" aria-label="Filter listings by status" className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={activeFilter === f}
              onClick={() => setActiveFilter(f)}
              className={`relative min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f ? "text-fg-on-dark" : "bg-paper-2 text-fg-muted hover:bg-line"
              }`}
            >
              {activeFilter === f && (
                <motion.span
                  layoutId="featured-filter-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ duration: 0.4, ease: EASE }}
                />
              )}
              <span className="relative z-10">
                {f} {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <p aria-live="polite" className="sr-only">
          Showing {filtered.length} of {featured.length} featured residences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout="position"
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  ease: EASE,
                  delay: reduced ? 0 : (i % 3) * 0.06,
                }}
                className="h-full"
              >
                <PropertyCard property={p} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="md:col-span-2 lg:col-span-3 text-fg-muted type-body py-12 text-center">
              No featured residences match this filter right now — check back soon or ask the
              concierge for similar homes.
            </p>
          )}
        </div>
      </Container>
    </Section>
  )
}
