"use client"

import Link from "next/link"
import { LAGOS_IMAGES } from "@/lib/images"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"

const categories = [
  {
    label: "Penthouses",
    description: "Skyline-defining luxury living at its peak",
    type: "penthouse",
    image: LAGOS_IMAGES.categories.penthouses,
    className: "min-h-[300px] md:col-span-1 md:row-span-2 md:min-h-[500px]",
  },
  {
    label: "Waterfront Homes",
    description: "Serene escapes along the water's edge",
    type: "waterfront",
    image: LAGOS_IMAGES.categories.waterfront,
    className: "min-h-[260px] md:col-span-1 md:row-span-1",
  },
  {
    label: "Maisonettes",
    description: "Boutique duplex living with urban charm",
    type: "maisonette",
    image: LAGOS_IMAGES.categories.maisonettes,
    className: "min-h-[260px] md:col-span-1 md:row-span-1",
  },
  {
    label: "New Developments",
    description: "Brand-new landmark residences coming soon",
    type: "new-development",
    image: LAGOS_IMAGES.categories.commercial,
    className: "min-h-[260px] md:col-span-2 md:row-span-1",
  },
]

export default function CuratedCategories() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-12">
          Curated Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:auto-rows-fr">
          {categories.map(({ label, description, type, image, className }, i) => (
            <ScrollRevealItem key={type} index={i} variant="unblur" className={className}>
              <Link
                href={`/listings?type=${type}`}
                className="group relative overflow-hidden rounded-2xl w-full h-full"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={image || LAGOS_IMAGES.hero.main}
                    alt={label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/20 backdrop-blur-[1px] group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-500">
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-white">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm text-white/60 max-w-xs">
                    {description}
                  </p>
                </div>
              </Link>
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  )
}
