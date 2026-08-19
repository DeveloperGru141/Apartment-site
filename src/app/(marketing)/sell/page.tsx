import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake, Globe, LineChart, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { ScrollRevealItem } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "Sell with HORIZON — List Your Property",
  description:
    "List your Lagos property with HORIZON. We match you with a specialist agent, handle buyer inquiries, and keep you in control of every offer.",
};

const PITCH_POINTS = [
  {
    icon: Handshake,
    title: "Matched with a specialist agent",
    description:
      "Your listing is assigned to one of our named sales, leasing, or residential advisory executives — the same people buyers already trust.",
  },
  {
    icon: Globe,
    title: "Buyer inquiries handled",
    description:
      "Every WhatsApp inquiry routes straight to your agent's desk. You stay informed, they do the chasing.",
  },
  {
    icon: LineChart,
    title: "Prime portfolio placement",
    description:
      "Live listings surface across the HORIZON site — featured portfolio, neighborhood showcases, and category pages.",
  },
  {
    icon: ShieldCheck,
    title: "You stay in control",
    description:
      "Publish, edit, or archive your listing anytime from your seller dashboard. No phone calls required.",
  },
]

export default function SellPage() {
  return (
    <main className="bg-bg-primary">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <ScrollReveal variant="fade-up">
            <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs tracking-widest uppercase mb-6">
              For Property Owners
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto">
              List your property. Get connected. <span className="text-amber-400">We handle the rest.</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
              HORIZON connects sellers with specialist agents who manage buyer inquiries, viewings,
              and negotiations — while you watch everything from your dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link
                href="/auth/sign-up"
                className="shine-sweep inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-xl px-8 py-4 transition-colors"
              >
                List Your Property <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider rounded-xl px-8 py-4 border border-white/20 hover:bg-white/10 transition-colors"
              >
                Returning Seller? Log In
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal variant="fade-up" className="mb-14">
            <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
              How It Works
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
              From listing to buyer in four steps
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PITCH_POINTS.map((point, i) => (
              <ScrollRevealItem key={point.title} index={i} variant="fade-up" className="h-full">
                <div className="h-full p-6 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <point.icon className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="font-heading font-bold text-lg text-text-primary">{point.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed mt-2">{point.description}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-bg-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
              Ready to put your property in front of the right buyers?
            </h2>
            <p className="text-text-body mt-4 max-w-xl mx-auto">
              Create your seller account in under a minute. Upload photos, set your price, and your
              listing goes live with an agent attached.
            </p>
            <Link
              href="/auth/sign-up"
              className="shine-sweep inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider rounded-xl px-8 py-4 mt-8 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}