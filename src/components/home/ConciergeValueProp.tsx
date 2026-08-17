"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { animate, useInView, useReducedMotion } from "framer-motion"
import { LAGOS_IMAGES } from "@/lib/images"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"

const stats = [
  { value: "$340M+", label: "Total Transaction Volume" },
  { value: "2,490+", label: "Units Closed" },
  { value: "99.2%", label: "Occupancy Rate" },
  { value: "8+", label: "Years Experience" },
]

const services = [
  "Personal Property Sourcing",
  "Interior Design & Staging",
  "Property Management",
  "Legal & Advisory Support",
  "Moving & Settlement Assistance",
]

interface ParsedStat {
  prefix: string
  suffix: string
  target: number
  decimals: number
  hasComma: boolean
  format: (v: number) => string
}

function parseStat(value: string): ParsedStat {
  const match = value.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) {
    return {
      prefix: "",
      suffix: "",
      target: 0,
      decimals: 0,
      hasComma: false,
      format: (v) => String(v),
    }
  }
  const [, prefix, rawNumber, suffix] = match
  const decimals = rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0
  const target = parseFloat(rawNumber.replace(/,/g, ""))
  const hasComma = rawNumber.includes(",")
  return {
    prefix,
    suffix,
    target,
    decimals,
    hasComma,
    format: (v) => {
      const fixed = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
      return hasComma ? Number(fixed).toLocaleString() : fixed
    },
  }
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const parsed = useMemo(() => parseStat(value), [value])
  const [progress, setProgress] = useState(0)

  const display = reduced ? parsed.format(parsed.target) : parsed.format(progress)

  useEffect(() => {
    if (!inView || reduced) return
    const controls = animate(0, parsed.target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(v),
    })
    return () => controls.stop()
  }, [inView, reduced, parsed])

  return (
    <div ref={ref} className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
      <p className="text-4xl md:text-5xl font-bold">
        {parsed.prefix}
        {display}
        {parsed.suffix}
      </p>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  )
}

export default function ConciergeValueProp() {
  return (
    <section className="py-24 bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="md:flex md:gap-16 lg:gap-24 items-center">
          <div className="grid grid-cols-2 gap-8 mb-12 md:mb-0 md:w-1/2">
            {stats.map((s, i) => (
              <ScrollRevealItem key={s.value} index={i} variant="scale-up">
                <AnimatedStat value={s.value} label={s.label} />
              </ScrollRevealItem>
            ))}
          </div>

          <div className="relative md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[3/3.4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LAGOS_IMAGES.concierge.lobby}
                alt="HORIZON Private Concierge Lobby"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <p className="text-sm font-medium tracking-widest uppercase text-amber-400">
                  HORIZON Concierge
                </p>
              </div>
            </div>
            <div className="relative z-10 p-6 -mt-16 md:-mt-20 md:mx-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight mb-6">
                Elevated Living, Curated for You
              </h2>
              <p className="font-body text-base leading-relaxed text-gray-300 mb-8">
                From property sourcing to interior design and management, our
                white-glove concierge service ensures every detail is handled
                with precision and care.
              </p>
              <ul className="space-y-4">
                {services.map((service, i) => (
                  <ScrollRevealItem key={service} index={i + 4} variant="fade-up">
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 shrink-0 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-body text-white">{service}</span>
                  </li>
                  </ScrollRevealItem>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
