"use client"

import { journalPosts } from "@/lib/data/journal"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"
import ImageWithShimmer from "@/components/shared/ImageWithShimmer"

export default function JournalInsights() {
  const articles = journalPosts.slice(0, 3)

  return (
    <section id="journal" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <p className="text-sm font-semibold text-text-primary/60 uppercase tracking-wider mb-2">
            Latest from HORIZON
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
            Journal &amp; Market Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <ScrollRevealItem key={article.slug} index={i} variant="unblur">
              <article className="group p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100/80 hover:border-amber-500/30 hover:bg-white shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4 bg-slate-900">
                  <ImageWithShimmer
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full"
                    priority={i === 0}
                    imgClassName="group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-md border border-white/40 shadow-sm text-text-primary">
                    {article.category}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-1.5 font-medium">{article.date}</p>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-1.5 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
              </article>
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  )
}