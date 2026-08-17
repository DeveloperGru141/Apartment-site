"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCarousel } from "@/components/properties/use-carousel"

interface PropertyGalleryProps {
  images: string[]
  title: string
  propertyId?: string
}

export default function PropertyGallery({ images, title, propertyId }: PropertyGalleryProps) {
  const { index, go, setIndex } = useCarousel(images.length)

  return (
    <div>
      <div
        className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl border border-gray-100"
        style={propertyId ? { viewTransitionName: `listing-img-${propertyId}`, contain: "layout" } : undefined}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            alt={`${title} — photo ${index + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover animate-zoom-in"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/50 hover:bg-slate-950/80 text-white p-3 rounded-full backdrop-blur-md transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/50 hover:bg-slate-950/80 text-white p-3 rounded-full backdrop-blur-md transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-950/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`shrink-0 w-24 aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all ${
                i === index ? "border-amber-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}