"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Building, ChevronDown, Sparkles } from "lucide-react"
import { LAGOS_IMAGES } from "@/lib/images"
import { properties } from "@/lib/data/properties"

const NEIGHBORHOODS = [...new Set(properties.map((p) => p.neighborhood))]

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
  const [activeTab, setActiveTab] = useState<"FOR_RENT" | "FOR_SALE" | "SHORT_LET">("FOR_RENT")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  function handleSearch() {
    const params = new URLSearchParams()
    if (activeTab === "FOR_RENT") params.set("status", "For Rent")
    if (activeTab === "FOR_SALE") params.set("status", "For Sale")
    if (selectedNeighborhood) params.set("neighborhood", selectedNeighborhood)
    if (selectedType) params.set("propertyType", selectedType)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs tracking-widest uppercase mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" /> HORIZON Lagos Luxury Portfolio
        </motion.div>

        <motion.h1
          key={`title-${currentSlide}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-white mb-4"
        >
          {HERO_SLIDES[currentSlide].title}
        </motion.h1>

        <motion.p
          key={`sub-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-slate-300 font-light max-w-2xl mx-auto mb-10"
        >
          {HERO_SLIDES[currentSlide].sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 p-3 sm:p-4 shadow-2xl max-w-4xl mx-auto"
        >
          <div className="flex gap-2 border-b border-slate-800 pb-3 mb-4">
            {(["FOR_RENT", "FOR_SALE", "SHORT_LET"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
                  activeTab === tab
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs pl-10 pr-8 py-3.5 focus:outline-none focus:border-amber-400 appearance-none"
              >
                <option value="">All Locations</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 text-white text-xs pl-10 pr-8 py-3.5 focus:outline-none focus:border-amber-400 appearance-none"
              >
                <option value="">Property Type (All)</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Apartment">Luxury Apartment</option>
                <option value="Maisonette">Maisonette / Duplex</option>
                <option value="Terrace">Terrace / Townhouse</option>
                <option value="Residential Land">Land / Plots</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button
              onClick={handleSearch}
              className="shine-sweep bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 px-6 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <Search className="w-4 h-4" /> Search Portfolio
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
