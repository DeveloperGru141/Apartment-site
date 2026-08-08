"use client"

import { useState } from "react"
import Link from "next/link"
import { images, LAGOS_IMAGES } from "@/lib/images"
import { formatPriceShort } from "@/lib/format"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

interface Property {
  id: string
  title: string
  price_monthly: number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  image_urls?: string[] | null
}

interface Props {
  property: Property
  forSale?: boolean
  priceLabel?: string
}

export default function PropertyCard({ property, forSale = false, priceLabel }: Props) {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)

  const imgs = property.image_urls?.length
    ? property.image_urls
    : [LAGOS_IMAGES.hero.main, images.listingCardFallback]

  return (
    <div
      className="group bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:bg-white/90"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/listings/${property.id}`} className="block relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imgs[imgIdx]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ viewTransitionName: `listing-img-${property.id}`, contain: "layout" } as React.CSSProperties}
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/70 backdrop-blur-md text-text-primary rounded-md border border-white/30 shadow-sm">
                {forSale ? "For Sale" : "For Rent"}
              </span>
              {!forSale && property.price_monthly > 0 && (
                <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-accent/70 backdrop-blur-md text-white rounded-md border border-white/20 shadow-sm">
                  Featured
                </span>
              )}
          </div>

          {hovered && imgs.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); setImgIdx((p) => (p === 0 ? imgs.length - 1 : p - 1)) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); setImgIdx((p) => (p === imgs.length - 1 ? 0 : p + 1)) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" className="w-4 h-4">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {imgs.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <span key={i} className={`block rounded-full transition-all ${i === imgIdx ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 bg-white/30 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-heading font-bold text-base text-text-primary truncate">
              <Link href={`/listings/${property.id}`} className="hover:underline">
                {property.title}
              </Link>
            </h3>
            {property.location && (
              <p className="font-body text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {property.location}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            {priceLabel ? (
              <p className="font-heading font-bold text-lg text-text-primary leading-none">{priceLabel}</p>
            ) : (
              <p className="font-heading font-bold text-lg text-text-primary leading-none">
                {property.currency} {property.price_monthly.toLocaleString()}
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              {forSale ? "Total Price" : "per month"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 py-3 border-t border-gray-50">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v11m0-4h18m0 4V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4h18z" />
            </svg>
            {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
          </span>
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h16M7 16h.01M12 16h.01M17 16h.01M4 20h16M8 5l-2 3h12l-2-3M4 12V8a4 4 0 014-4h8a4 4 0 014 4v4" />
            </svg>
            {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
          </span>
          {property.sqft && (
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              {property.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        <a
          href={getWhatsAppInquiryLink({ title: property.title, location: property.location || undefined, price: priceLabel })}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
          Inquire via WhatsApp
        </a>
      </div>
    </div>
  )
}
