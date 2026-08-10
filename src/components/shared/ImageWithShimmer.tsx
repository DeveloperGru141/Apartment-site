"use client"

import { useEffect, useRef, useState } from "react"

interface ImageWithShimmerProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

export default function ImageWithShimmer({ src, alt, className = "", imgClassName = "" }: ImageWithShimmerProps) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true)
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 animate-shimmer" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  )
}