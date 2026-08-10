"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type SectionVariant = "default" | "parallax" | "fade" | "zoom"

interface ScrollBlurProps {
  children: ReactNode
  className?: string
  variant?: SectionVariant
}

// Section is considered "in view" when any part of it enters this band of the
// viewport (top/bottom 12% shrunk). IntersectionObserver keeps re-firing on
// every enter/exit, so the blur fades in AND out on each scroll pass — unlike
// the framer-motion useScroll implementation, which relied on native
// ScrollTimeline (motion >= 12.30) whose scroll-linked values can freeze
// after the first pass until a refresh.
export function ScrollBlurSection({ children, className = "", variant = "default" }: ScrollBlurProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [sharp, setSharp] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setSharp(entry.isIntersecting),
      { rootMargin: "-12% 0px -12% 0px", threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        sharp ? "opacity-100" : "opacity-60"
      } ${className}`}
      data-blur-variant={variant}
    >
      {children}
    </div>
  )
}

export type { SectionVariant }
