"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import type { Property } from "@/lib/data/properties"
import { agents } from "@/lib/data/agents"
import { useCarousel } from "@/components/properties/use-carousel"
import PropertySpecs from "@/components/properties/PropertySpecs"
import WhatsAppInquiryButton from "@/components/properties/WhatsAppInquiryButton"

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const { index: imageIndex, go, setIndex: setImageIndex } = useCarousel(property.images.length)

  const agent = agents.find((a) => a.id === property.agentId)
  const images = property.images

  return (
    <div
      className={`group rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-white/90 hover:-translate-y-1 ${className}`}
    >
      <Link href={`/properties/${property.slug}`} className="block">
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ viewTransitionName: `listing-img-${property.id}`, contain: "layout" }}
        >
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.preventDefault()
                  go(-1)
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-slate-950/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-950/80"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.preventDefault()
                  go(1)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-slate-950/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-950/80"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {images.map((src, i) => (
            <div
              key={src + i}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === imageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={property.title} className="w-full h-full object-cover" />
            </div>
          ))}

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Image ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setImageIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imageIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md z-10">
            {property.status}
          </div>
          {property.featured && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md z-10">
              Featured
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-heading font-bold text-lg text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-text-muted text-sm mb-3">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          <PropertySpecs bedrooms={property.bedrooms} bathrooms={property.bathrooms} sqft={property.sqft} />
          <p className="font-heading font-extrabold text-xl text-text-primary mb-2">
            {property.priceLabel}
          </p>
          {agent && <p className="text-xs text-text-muted mb-4">Listed by {agent.name}</p>}
        </div>
      </Link>

      <div className="px-5 pb-5">
        <WhatsAppInquiryButton
          title={property.title}
          location={property.location}
          price={property.priceLabel}
          agentWhatsapp={agent?.whatsapp}
        />
      </div>
    </div>
  )
}