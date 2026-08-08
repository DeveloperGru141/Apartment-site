"use client"

import Link from "next/link"
import { LAGOS_IMAGES } from "@/lib/images"
import { ScrollRevealItem } from "@/components/shared/ScrollReveal"

const articles = [
  {
    slug: "lagos-luxury-market-report-2026",
    image: LAGOS_IMAGES.listings[0].image,
    category: "Market Report",
    date: "Mar 15, 2026",
    title: "Lagos Luxury Market Report 2026",
    excerpt:
      "Comprehensive analysis of luxury real estate trends across Ikoyi, Victoria Island, and Lekki.",
  },
  {
    slug: "the-art-of-african-interior-design",
    image: LAGOS_IMAGES.listings[1].image,
    category: "Interior Design",
    date: "Mar 10, 2026",
    title: "The Art of African Interior Design",
    excerpt:
      "How contemporary African design is reshaping luxury living spaces in Lagos.",
  },
  {
    slug: "your-complete-guide-to-buying-in-lagos",
    image: LAGOS_IMAGES.listings[2].image,
    category: "Buying Guide",
    date: "Mar 5, 2026",
    title: "Your Complete Guide to Buying in Lagos",
    excerpt:
      "Essential steps for navigating Lagos' luxury real estate market as a first-time buyer.",
  },
]

export default function JournalInsights() {
  return (
    <section className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-text-primary/60 uppercase tracking-wider mb-2">
              Latest from CW
            </p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary">
              Journal &amp; Market Insights
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden sm:inline-flex text-sm font-semibold text-text-primary hover:underline underline-offset-4"
          >
            View All Articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <ScrollRevealItem key={article.slug} index={i} variant="unblur">
            <Link
              href={`/journal/${article.slug}`}
              className="group block p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <img
                  src={article.image || LAGOS_IMAGES.hero.main}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
              <span className="text-sm font-semibold text-text-primary group-hover:underline underline-offset-4">
                Read More &rarr;
              </span>
            </Link>
            </ScrollRevealItem>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/journal"
            className="inline-flex text-sm font-semibold text-text-primary hover:underline underline-offset-4"
          >
            View All Articles &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
