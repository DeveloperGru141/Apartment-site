import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, Mail } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { agents } from "@/lib/data/agents";
import { properties } from "@/lib/data/properties";
import { getWhatsAppInquiryLink } from "@/lib/whatsapp";
import { ScrollRevealItem } from "@/components/shared/ScrollReveal";

export function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const agent = agents.find((a) => a.slug === slug);
  return {
    title: agent ? `${agent.name} — HORIZON Lagos` : "Agent — HORIZON Lagos",
    description: agent?.bio,
  };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = agents.find((a) => a.slug === slug);

  if (!agent) notFound();

  const listings = properties.filter((p) => p.agentId === agent.id);

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/agents" className="hover:text-text-primary transition-colors">Agents</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{agent.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-16">
          <div>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={agent.photo} alt={agent.name} className="w-full aspect-[4/5] object-cover" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">{agent.name}</h1>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-500 mt-1">
              {agent.role}
            </p>
            <p className="text-text-body leading-relaxed mt-6 max-w-2xl">{agent.bio}</p>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={getWhatsAppInquiryLink({ title: `Consultation with ${agent.name}`, agentWhatsapp: agent.whatsapp })}
                target="_blank"
                rel="noopener noreferrer"
                className="shine-sweep inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold uppercase tracking-wider rounded-xl px-6 py-3.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-text-primary text-sm font-semibold rounded-xl px-6 py-3.5 transition-colors"
                >
                  <Mail className="w-4 h-4" /> {agent.email}
                </a>
              )}
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-text-muted">
              <span>
                <strong className="text-text-primary font-bold">{listings.length}</strong> active listings
              </span>
              <span>Available for private viewings across Lagos</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">
            Listings by {agent.name}
          </h2>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((p, i) => (
                <ScrollRevealItem key={p.id} index={i} variant="fade-up">
                  <PropertyCard property={p} className="h-full" />
                </ScrollRevealItem>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">New listings are on their way — reach out directly.</p>
          )}
        </div>
      </div>
    </section>
  );
}