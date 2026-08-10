import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agents } from "@/lib/data/agents";
import { properties } from "@/lib/data/properties";
import { ScrollRevealItem } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "Our Agents — HORIZON Lagos",
  description:
    "Meet the HORIZON Lagos team: specialist sales, leasing, off-plan, and land advisory executives covering the island and mainland.",
};

export default function AgentsPage() {
  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-sm font-medium tracking-widest uppercase text-text-muted mb-2">
            The Team
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">Our Agents</h1>
          <p className="text-text-body mt-3 max-w-2xl">
            Every mandate at HORIZON is carried by a named specialist — your one point of contact
            from first viewing to handover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {agents.map((agent, i) => {
            const count = properties.filter((p) => p.agentId === agent.id).length;
            return (
              <ScrollRevealItem key={agent.id} index={i} variant="fade-up">
                <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                  <div className="aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="font-heading font-bold text-lg text-text-primary">{agent.name}</h2>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mt-0.5">
                      {agent.role}
                    </p>
                    <p className="text-sm text-text-muted mt-3 line-clamp-2">{agent.bio}</p>
                    <p className="text-xs text-text-muted mt-2">{count} active listings</p>
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-text-primary group-hover:text-amber-600 transition-colors"
                    >
                      See Listings <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollRevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}