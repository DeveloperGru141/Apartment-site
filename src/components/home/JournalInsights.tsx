"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { journalPosts } from "@/lib/data/journal"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"

export default function JournalInsights() {
  const articles = journalPosts.slice(0, 3)

  return (
    <section className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-text-primary/60 uppercase tracking-wider mb-2">
              Latest from HORIZON
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
              Journal &amp; Market Insights
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-amber-600 transition-colors"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <ScrollRevealItem key={article.slug} index={i} variant="unblur">
              <Link
                href={`/journal/${article.slug}`}
                className="group block p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <ImageWithShimmer
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full"
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/70 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded border border-white/30">
                    {article.category}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1">{article.date}</p>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-1">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <span className="text-sm font-semibold text-text-primary group-hover:text-amber-600 transition-colors">
                  Read More &rarr;
                </span>
              </Link>
            </ScrollRevealItem>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-amber-600 transition-colors"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}