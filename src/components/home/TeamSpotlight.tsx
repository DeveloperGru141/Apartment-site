"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { agents } from "@/lib/data/agents"
import { properties } from "@/lib/data/properties"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"

const FEATURED_AGENT_IDS = ["agent-chiamaka", "agent-ngozi", "agent-kunle", "agent-yemi", "agent-emeka"]

export default function TeamSpotlight() {
  const featured = agents.filter((a) => FEATURED_AGENT_IDS.includes(a.id))

  return (
    <section className="py-24 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
              Meet the Team
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
              The Names Behind the Mandates
            </h2>
          </div>
          <Link
            href="/agents"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-amber-600 transition-colors"
          >
            See All Agents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {featured.map((agent, i) => {
            const count = properties.filter((p) => p.agentId === agent.id).length
            return (
              <ScrollRevealItem key={agent.id} index={i} variant="fade-up">
                <Link
                  href={`/agents/${agent.slug}`}
                  className="group block text-center"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="font-heading font-bold text-text-primary text-sm mt-3">
                    {agent.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{agent.role}</p>
                  <p className="text-xs text-text-muted mt-1">{count} listings</p>
                </Link>
              </ScrollRevealItem>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-amber-600 transition-colors"
          >
            See All Agents <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}