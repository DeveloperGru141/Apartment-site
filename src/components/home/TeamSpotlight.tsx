"use client"

import { agents } from "@/lib/data/agents"
import type { Property } from "@/lib/data/properties"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

export default function TeamSpotlight({ properties }: { properties: Property[] }) {
  const leadAgent = agents[0]
  const count = properties.filter((p) => p.agentId === leadAgent.id).length

  return (
    <section id="team" className="py-24 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
            Mandate Advisory
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
            Featured Senior Executive
          </h2>
          <p className="mt-3 max-w-xl text-text-muted">
            One principal, one mandate — every portfolio below is negotiated and closed under
            Salami&rsquo;s direct oversight.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ScrollRevealItem index={0} variant="fade-up">
            <div className="group bg-white/90 backdrop-blur-md border border-white/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="shrink-0 relative w-36 h-36 sm:w-48 sm:h-48">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-400/40 via-transparent to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                  <div className="relative w-full h-full overflow-hidden rounded-2xl border-2 border-amber-500/30 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={leadAgent.photo}
                      alt={leadAgent.name}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
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
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                    <span className="text-xs font-semibold text-text-primary bg-bg-alt rounded-full px-3 py-1.5">
                      {count} active {count === 1 ? "listing" : "listings"} under mandate
                    </span>
                    <span className="text-xs font-semibold text-text-primary bg-bg-alt rounded-full px-3 py-1.5">
                      {leadAgent.email ?? "Private advisory"}
                    </span>
                  </div>

                  <a
                    href={getWhatsAppInquiryLink({
                      title: `Consultation with ${leadAgent.name}`,
                      agentWhatsapp: leadAgent.whatsapp,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shine-sweep inline-flex items-center gap-2 mt-6 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-colors"
                  >
                    Book a Private Consultation
                  </a>
                </div>
              </div>
            </div>
          </ScrollRevealItem>
        </div>
      </div>
    </section>
  )
}