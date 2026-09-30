"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import PropertyImagePlaceholder from "@/components/shared/PropertyImagePlaceholder"

interface ImageWithShimmerProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
}

/** Tiny warm blur-up placeholder for remote images (no static imports on the landing page). */
export const SHIMMER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9IiNmMWViZTBkZiIvPjwvc3ZnPg=="

export default function ImageWithShimmer({
  src,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  sizes = "100vw",
}: ImageWithShimmerProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!src && process.env.NODE_ENV === "development") {
      console.warn(`[images] missing src for "${alt}" — rendering placeholder`)
    }
  }, [src, alt])

  if (!src || failed) {
    return <PropertyImagePlaceholder className={className} label={alt} />
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 animate-shimmer" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        placeholder="blur"
        blurDataURL={SHIMMER_BLUR}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[images] failed to load "${src}" — rendering placeholder`)
          }
          setFailed(true)
        }}
        className={`object-cover transition-opacity duration-300 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  )
}
