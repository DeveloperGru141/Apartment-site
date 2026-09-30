"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, Phone } from "lucide-react"
import { LAGOS_IMAGES } from "@/lib/images"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"
import { SHIMMER_BLUR } from "@/components/shared/ImageWithShimmer"

const HERO_SLIDES = [
  {
    image: LAGOS_IMAGES.hero.main,
    alt: "Oceanfront luxury residences in Eko Atlantic, Lagos",
    title: "Ultra-Luxury Living in Eko Atlantic & Ikoyi",
    sub: "Discover curated oceanfront sky suites and waterfront mansions.",
  },
  {
    image: LAGOS_IMAGES.neighborhoods.bananaIsland.image,
    alt: "Private waterfront estate with a jetty on Banana Island, Lagos",
    title: "Banana Island Private Waterfront Estates",
    sub: "Exclusive mansions featuring private jetties and world-class security.",
  },
  {
    image: LAGOS_IMAGES.neighborhoods.lekkiPhase1.image,
    alt: "Contemporary maisonette with a terrace in Lekki Phase 1, Lagos",
    title: "Contemporary Maisonettes in Lekki Phase 1",
    sub: "Smart-enabled architectural homes designed for modern luxury.",
  },
]

interface HeroSearchProps {
  listingCount: number
  neighborhoodCount: number
}

export default function HeroSearch({ listingCount, neighborhoodCount }: HeroSearchProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  function go(i: number) {
    setPrevSlide(currentSlide)
    setCurrentSlide(i)
  }

  useEffect(() => {
    if (reduced || hovered || focused || hidden) return
    const timer = setInterval(() => {
      go((currentSlide + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, hovered, focused, hidden, currentSlide])

  return (
    <section
      id="top"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches?.(":focus-visible")) setFocused(true)
      }}
      onBlur={() => setFocused(false)}
      className="relative min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden bg-ink text-fg-on-dark"
    >
      {/* Stacked slide layers crossfade by opacity — no blank frame between slides */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          aria-hidden={i !== currentSlide}
          className="absolute inset-0 z-0 pointer-events-none select-none transition-opacity duration-[900ms] ease-out"
          style={{ opacity: i === currentSlide ? 1 : 0 }}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : "auto"}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={SHIMMER_BLUR}
            className={`object-cover object-center ${(i === currentSlide || i === prevSlide) && !reduced ? "kenburns" : ""}`}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Show slide ${i + 1}: ${slide.title}`}
            aria-current={currentSlide === i}
            onClick={() => go(i)}
            className="flex items-center justify-center w-11 h-11"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i
                  ? "w-10 bg-accent"
                  : "w-6 bg-white/40 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        <motion.h1
          key={`title-${currentSlide}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="type-display text-fg-on-dark mb-4"
        >
          {HERO_SLIDES[currentSlide].title}
        </motion.h1>

        <motion.p
          key={`sub-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg text-fg-on-dark-muted max-w-2xl mx-auto mb-10"
        >
          {HERO_SLIDES[currentSlide].sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-fg font-semibold text-sm py-4 px-8 transition-colors shadow-lg"
          >
            <ArrowDown className="w-4 h-4" /> Explore the portfolio
          </a>
          <a
            href={getWhatsAppInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-line-dark hover:border-accent hover:text-accent text-fg-on-dark text-sm font-semibold py-4 px-8 transition-colors"
          >
            <Phone className="w-4 h-4" /> Speak with concierge
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 inline-grid grid-cols-2 sm:grid-cols-4 divide-x divide-line-dark border border-line-dark bg-ink/60 rounded-lg overflow-hidden"
        >
          {[
            { value: String(listingCount), label: "Active listings" },
            { value: String(neighborhoodCount), label: "Prime neighborhoods" },
            { value: "100%", label: "Vetted & verified" },
            { value: "24/7", label: "Concierge support" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-4 text-left">
              <p className="font-heading text-xl sm:text-2xl font-bold tabular-nums text-accent">{s.value}</p>
              <p className="text-[13px] text-fg-on-dark-muted mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}