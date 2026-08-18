"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Home, MapPin } from "lucide-react"
import { LAGOS_IMAGES } from "@/lib/images"
import type { Property } from "@/lib/data/properties"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"

export default function NeighborhoodShowcase({ properties }: { properties: Property[] }) {
  const neighborhoods = Object.entries(LAGOS_IMAGES.neighborhoods).map(([key, val]) => ({
    slug: key.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, ""),
    name: val.title,
    description: val.sub,
    image: val.image,
    count: properties.filter((p) => p.neighborhood === val.title).length,
  }))

  const [active, setActive] = useState(0)

  const current = neighborhoods[active]

  return (
    <section className="py-24 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="mb-4 inline-block rounded-full bg-bg-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            Prime Locations
          </span>
          <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Explore Neighborhoods
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {neighborhoods.map((n, i) => (
              <button
                key={n.slug}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 text-left px-5 py-4 border transition-all duration-300 ${
                  active === i
                    ? "border-amber-500 bg-amber-50 text-text-primary"
                    : "border-gray-100 bg-white text-text-muted hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p className="text-sm font-semibold font-heading">{n.name}</p>
                <p className="text-xs mt-0.5 opacity-70">{n.count} listings</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <ImageWithShimmer
                    src={current.image || LAGOS_IMAGES.hero.main}
                    alt={current.name}
                    className="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                      {current.name}
                    </h3>
                    <p className="text-sm text-white/80 mb-1">{current.description}</p>
                    <p className="text-xs text-amber-400 font-semibold mb-4">
                      {current.count} listings available
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/properties?neighborhood=${encodeURIComponent(current.name)}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/30 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" /> View Properties
                      </Link>
                      <a
                        href={getWhatsAppInquiryLink({ title: `${current.name} Inquiry`, location: current.description })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shine-sweep inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-semibold uppercase tracking-wider hover:bg-amber-600 transition-colors"
                      >
                        <Home className="w-3.5 h-3.5" /> Inquire About {current.name}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
