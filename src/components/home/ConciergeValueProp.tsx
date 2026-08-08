"use client"

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

export default function ConciergeValueProp() {
  return (
    <section className="py-24 bg-bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="md:flex md:gap-16 lg:gap-24 items-center">
          <div className="grid grid-cols-2 gap-8 mb-12 md:mb-0 md:w-1/2">
            {stats.map((s, i) => (
              <ScrollRevealItem key={s.value} index={i} variant="scale-up">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <p className="text-4xl md:text-5xl font-bold">{s.value}</p>
                <p className="text-gray-400 mt-1">{s.label}</p>
              </div>
              </ScrollRevealItem>
            ))}
          </div>

          <div className="relative md:w-1/2">
            <img
              src={LAGOS_IMAGES.categories.waterfront || LAGOS_IMAGES.hero.main}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-lg"
              aria-hidden
            />
            <div className="relative z-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
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
