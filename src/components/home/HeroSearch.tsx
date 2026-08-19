"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Phone } from "lucide-react"
import { LAGOS_IMAGES } from "@/lib/images"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

const HERO_SLIDES = [
  {
    image: LAGOS_IMAGES.hero.main,
    title: "Ultra-Luxury Living in Eko Atlantic & Ikoyi",
    sub: "Discover curated oceanfront sky suites and waterfront mansions.",
  },
  {
    image: LAGOS_IMAGES.neighborhoods.bananaIsland.image,
    title: "Banana Island Private Waterfront Estates",
    sub: "Exclusive mansions featuring private jetties and world-class security.",
  },
  {
    image: LAGOS_IMAGES.neighborhoods.lekkiPhase1.image,
    title: "Contemporary Maisonettes in Lekki Phase 1",
    sub: "Smart-enabled architectural homes designed for modern luxury.",
  },
]

export default function HeroSearch() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none select-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SLIDES[currentSlide].image}
            alt="Lagos Luxury Real Estate"
            className="w-full h-full object-cover object-center kenburns"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === i
                ? "w-10 bg-amber-500"
                : "w-6 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs tracking-widest uppercase mb-6 backdrop-blur-md"
        >
          HORIZON Lagos Luxury Portfolio
        </motion.div>

        <motion.h1
          key={`title-${currentSlide}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-white mb-4"
        >
          {HERO_SLIDES[currentSlide].title}
        </motion.h1>

        <motion.p
          key={`sub-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg text-slate-300 font-light max-w-2xl mx-auto mb-10"
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
            className="shine-sweep inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-4 px-8 transition-all shadow-lg hover:shadow-amber-500/20"
          >
            <ArrowDown className="w-4 h-4" /> Explore the Portfolio
          </a>
          <a
            href={getWhatsAppInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-amber-400/60 hover:text-amber-400 text-white text-xs font-semibold uppercase tracking-wider py-4 px-8 transition-colors"
          >
            <Phone className="w-4 h-4" /> Speak with Concierge
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 inline-grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 border border-white/15 bg-slate-950/40 backdrop-blur-md rounded-lg overflow-hidden"
        >
          {[
            { value: "28+", label: "Active Listings" },
            { value: "7", label: "Prime Neighborhoods" },
            { value: "100%", label: "Vetted & Verified" },
            { value: "24/7", label: "Concierge Support" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-4 text-left">
              <p className="font-heading text-xl sm:text-2xl font-bold text-amber-400">{s.value}</p>
              <p className="text-[11px] uppercase tracking-widest text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}