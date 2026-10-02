"use client"

import { useId, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import type { Property } from "@/lib/data/properties"
import PropertySpecs from "@/components/properties/PropertySpecs"
import WhatsAppInquiryButton from "@/components/properties/WhatsAppInquiryButton"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"

interface PropertyCardProps {
  property: Property
  className?: string
}

const GALLERY_SIZES = "(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"

/** Canonical listing card: scroll-snap gallery, price-first hierarchy, concierge-routed inquiry. */
export default function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const titleId = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [index, setIndex] = useState(0)
  const [liveText, setLiveText] = useState("")

  const images = property.images
  const total = images.length
  const [amount, period] = property.priceLabel.split(" / ")

  function isReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  function onTrackScroll() {
    const track = trackRef.current
    if (!track) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth)
      setIndex(Math.max(0, Math.min(total - 1, i)))
    })
  }

  function scrollTo(i: number) {
    const track = trackRef.current
    if (!track) return
    const next = Math.max(0, Math.min(total - 1, i))
    track.scrollBy({
      left: (next - index) * track.clientWidth,
      behavior: isReducedMotion() ? "auto" : "smooth",
    })
    setLiveText(`Photo ${next + 1} of ${total}`)
  }

  return (
    <article
      aria-labelledby={titleId}
      className={`group rounded-card overflow-hidden bg-bg-primary border border-line transition-shadow duration-300 ease-out hover:shadow-raised ${className}`}
    >
      <div className="relative bg-ink">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${property.title} photos`}
          className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain motion-reduce:scroll-auto"
        >
          {images.map((src, i) => (
            <div
              key={src + i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden"
            >
              <ImageWithShimmer
                src={src}
                alt={i === 0 ? property.title : `${property.title}, photo ${i + 1}`}
                className="h-full w-full"
                sizes={GALLERY_SIZES}
                imgClassName="transition-transform duration-[280ms] ease-out group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>

        <div className="absolute top-3 left-3 bg-ink/85 text-fg-on-dark text-[13px] font-medium px-2.5 py-1 rounded-control">
          {property.status}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              disabled={index === 0}
              onClick={() => scrollTo(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-fg-on-dark transition-opacity disabled:opacity-30 disabled:cursor-default opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              disabled={index === total - 1}
              onClick={() => scrollTo(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-fg-on-dark transition-opacity disabled:opacity-30 disabled:cursor-default opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div
              aria-hidden="true"
              className="absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 text-fg-on-dark text-[13px] font-medium px-2.5 py-1 tabular-nums"
            >
              {index + 1} / {total}
            </div>
            <span aria-live="polite" className="sr-only">
              {liveText}
            </span>
          </>
        )}
      </div>

      <div className="p-5 space-y-3">
        <p className="font-heading font-bold text-2xl tabular-nums text-fg">
          {amount}
          {period && <span className="text-sm font-semibold text-fg-muted"> / {period}</span>}
        </p>
        <div>
          <h3 id={titleId} className="font-heading font-semibold text-lg text-fg line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-fg-muted text-sm mt-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>
        <PropertySpecs bedrooms={property.bedrooms} bathrooms={property.bathrooms} sqft={property.sqft} />
        <WhatsAppInquiryButton
          title={property.title}
          location={property.location}
          price={property.priceLabel}
        />
      </div>
    </article>
  )
}
