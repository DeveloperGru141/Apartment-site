"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { testimonials } from "@/lib/data/testimonials"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [resetKey, setResetKey] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => {
      setDir(1)
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [resetKey])

  function go(dir: 1 | -1) {
    setDir(dir)
    setActive((prev) => (prev + dir + testimonials.length) % testimonials.length)
    setResetKey((k) => k + 1)
  }

  return (
    <section className="py-20 bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollRevealItem variant="fade-up">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-amber-400 mb-2">
                Client Verbatim
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">What Our Clients Say</h2>
            </div>
            <div className="hidden sm:flex gap-3">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => go(-1)}
                className="border border-white/20 p-2.5 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => go(1)}
                className="border border-white/20 p-2.5 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollRevealItem>

        <ScrollRevealItem variant="fade-up" index={1}>
          <div className="relative min-h-[240px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={active}
                custom={dir}
                initial={{ opacity: 0, x: reduced ? 0 : dir * 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduced ? 0 : dir * -48 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto text-center"
              >
                <Quote className="w-10 h-10 text-amber-400 mx-auto mb-6" />
                <blockquote className="text-xl md:text-2xl font-light leading-relaxed">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 ring-2 ring-amber-400/60 flex items-center justify-center">
                    <span className="font-heading font-bold text-amber-400">
                      {testimonials[active].name
                        .split("&")
                        .map((part) =>
                          part
                            .trim()
                            .split(" ")
                            .filter((w) => w.length > 0 && /^[A-Z]/.test(w))
                            .map((w) => w[0])
                            .join("")
                        )
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-center gap-1 mb-1" aria-label={`${testimonials[active].rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < testimonials[active].rating ? "text-amber-400" : "text-white/20"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="font-heading font-bold text-white">{testimonials[active].name}</p>
                    {testimonials[active].context && (
                      <p className="text-sm text-amber-400/80 mt-1">{testimonials[active].context}</p>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <div className="mt-10 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => {
                    setDir(i > active ? 1 : -1)
                    setActive(i)
                    setResetKey((k) => k + 1)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === i ? "w-8 bg-amber-400" : "w-4 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </ScrollRevealItem>
      </div>
    </section>
  )
}