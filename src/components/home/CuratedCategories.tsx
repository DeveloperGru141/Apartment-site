"use client"

import Link from "next/link"
import { LAGOS_IMAGES } from "@/lib/images"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"
import { properties } from "@/lib/data/properties"

const categories = [
  {
    label: "Top Rentals",
    description: "Prime leased apartments & maisonettes across the islands",
    param: "category",
    value: "rental",
    image: LAGOS_IMAGES.categories.maisonettes,
    className: "relative min-h-[300px] md:col-span-1 md:row-span-2 md:min-h-[500px]",
  },
  {
    label: "Off-Plan Properties",
    description: "Towers and estates breaking ground now — lock in from plan",
    param: "category",
    value: "off-plan",
    image: LAGOS_IMAGES.categories.penthouses,
    className: "relative min-h-[260px] md:col-span-1 md:row-span-1",
  },
  {
    label: "Commercial Properties",
    description: "Office, retail, and mixed-use spaces on the island and mainland",
    param: "category",
    value: "commercial",
    image: LAGOS_IMAGES.categories.commercial,
    className: "relative min-h-[260px] md:col-span-1 md:row-span-1",
  },
  {
    label: "Landed Opportunities",
    description: "Certified residential, commercial, and industrial plots",
    param: "category",
    value: "land",
    image: LAGOS_IMAGES.categories.waterfront,
    className: "relative min-h-[260px] md:col-span-2 md:row-span-1",
  },
]

export default function CuratedCategories() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
            Browse by Transaction
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Curated Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:auto-rows-fr">
          {categories.map(({ label, description, value, image, className }, i) => {
            const count = properties.filter((p) => p.category === value).length
            return (
              <ScrollRevealItem key={value} index={i} variant="unblur" className={className}>
                <Link
                  href={`/properties?category=${value}`}
                  className="group absolute inset-0 block overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <ImageWithShimmer
                      src={image}
                      alt={label}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/20 backdrop-blur-[1px] group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-500">
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-white">
                      {label}
                    </h3>
                    <p className="mt-2 text-sm text-white/60 max-w-xs">{description}</p>
                    <p className="mt-3 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      {count} {count === 1 ? "listing" : "listings"}
                    </p>
                  </div>
                </Link>
              </ScrollRevealItem>
            )
          })}
        </div>
      </div>
    </section>
  )
}