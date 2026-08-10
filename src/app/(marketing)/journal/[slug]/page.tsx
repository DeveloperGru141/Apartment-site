import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { journalPosts } from "@/lib/data/journal";
import ReadingProgress from "@/components/shared/ReadingProgress";
import { ScrollRevealItem } from "@/components/shared/ScrollReveal";
import ImageWithShimmer from "@/components/shared/ImageWithShimmer";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);
  return {
    title: post ? `${post.title} — HORIZON Journal` : "Journal — HORIZON Lagos",
    description: post?.excerpt,
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = journalPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const others = journalPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <ReadingProgress>
      <section className="py-16 md:py-24 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <span className="bg-amber-500/10 border border-amber-400/30 text-amber-600 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <CalendarDays className="w-3.5 h-3.5" /> {post.date}
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-text-muted leading-relaxed mb-10">{post.excerpt}</p>

          <div className="rounded-2xl overflow-hidden mb-12">
            <ImageWithShimmer
              src={post.image}
              alt={post.title}
              className="aspect-[16/9] w-full"
            />
          </div>

          <article className="space-y-6 mb-16">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-text-body text-base md:text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>

          <div className="border-t border-gray-100 pt-12">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">Continue reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {others.map((other, i) => (
                <ScrollRevealItem key={other.slug} index={i} variant="fade-up">
                  <Link href={`/journal/${other.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                      <ImageWithShimmer
                        src={other.image}
                        alt={other.title}
                        className="h-full w-full"
                        imgClassName="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-xs text-text-muted mb-1">{other.category}</p>
                    <h3 className="font-heading font-bold text-base text-text-primary group-hover:text-amber-600 transition-colors">
                      {other.title}
                    </h3>
                  </Link>
                </ScrollRevealItem>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ReadingProgress>
  );
}