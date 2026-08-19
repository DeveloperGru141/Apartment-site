"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { agents } from "@/lib/data/agents"
import type { Property } from "@/lib/data/properties"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"

export default function TeamSpotlight({ properties }: { properties: Property[] }) {
  const leadAgent = agents[0]
  const count = properties.filter((p) => p.agentId === leadAgent.id).length

  return (
    <section className="py-24 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
              Mandate Advisory
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
              Featured Senior Executive
            </h2>
          </div>
          <Link
            href="/agents"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-amber-600 transition-colors"
          >
            Meet the Advisory Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <ScrollRevealItem index={0} variant="fade-up">
            <div className="group bg-white/90 backdrop-blur-md border border-white/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="shrink-0 w-36 h-36 sm:w-48 sm:h-48 aspect-square overflow-hidden rounded-2xl border-2 border-amber-500/30 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={leadAgent.photo}
                    alt={leadAgent.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-2">
                    Lead Partner
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-text-primary">
                    {leadAgent.name}
                  </h3>
                  <p className="text-sm font-semibold text-amber-500 mt-0.5">{leadAgent.role}</p>
                  <p className="text-sm text-text-body leading-relaxed mt-3">{leadAgent.bio}</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
                    <Link
                      href={`/agents/${leadAgent.slug}`}
                      className="shine-sweep inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-colors"
                    >
                      View Listings ({count}) <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/agents"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors py-3"
                    >
                      All Agents &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollRevealItem>
        </div>
      </div>
    </section>
  )
}