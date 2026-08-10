import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { journalPosts } from "@/lib/data/journal";
import { ScrollRevealItem } from "@/components/shared/ScrollReveal";
import ImageWithShimmer from "@/components/shared/ImageWithShimmer";

export const metadata: Metadata = {
  title: "Journal & Market Insights — HORIZON Lagos",
  description:
    "Market reports, buying guides, and design notes from the HORIZON Lagos team on luxury real estate across the city.",
};

export default function JournalIndexPage() {
  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-sm font-medium tracking-widest uppercase text-text-muted mb-2">
            Journal &amp; Market Insights
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">The Journal</h1>
          <p className="text-text-body mt-3 max-w-2xl">
            Original writing from the HORIZON desks: market reports, buying guides, and design notes
            from across Lagos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journalPosts.map((post, i) => (
            <ScrollRevealItem key={post.slug} index={i} variant="unblur">
              <Link
                href={`/journal/${post.slug}`}
                className="group block p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <ImageWithShimmer
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/70 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded border border-white/30">
                    {post.category}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1">{post.date}</p>
                <h2 className="font-heading font-bold text-lg text-text-primary mb-1">{post.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary group-hover:text-amber-600 transition-colors">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}