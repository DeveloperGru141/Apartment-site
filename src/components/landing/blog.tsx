import Link from "next/link";
import { images } from "@/lib/images";

const blg = images.blog

const articles = [
  {
    title: "THE ART OF MODERN LIVING ROOM DESIGN",
    category: "Interior Design",
    image: blg[0],
    featured: true,
  },
  {
    title: "TOP 10 PENTHOUSE TRENDS FOR 2026",
    category: "Architecture",
    image: blg[1],
    featured: false,
  },
  {
    title: "SUSTAINABLE LUXURY: THE NEW STANDARD",
    category: "Sustainability",
    image: blg[2],
    featured: false,
  },
];

export default function Blog() {
  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <section id="blog" className="py-16 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary mb-10 md:mb-16">
          EXPLORING THOUGHTFUL
          <br />
          DESIGN AND LUXURY
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <Link href="/signup" className="group">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-80 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="mt-6">
              <span className="font-heading font-medium text-xs tracking-widest text-text-muted uppercase">
                {featured.category}
              </span>
              <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary mt-2">
                {featured.title}
              </h3>
            </div>
          </Link>

          <div className="space-y-8">
            {others.map((article) => (
              <Link key={article.title} href="/signup" className="group flex gap-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-32 h-32 object-cover transition-transform duration-700 group-hover:scale-105 flex-shrink-0"
                />
                <div>
<span className="font-heading font-medium text-xs tracking-widest text-text-muted uppercase">
                    {article.category}
                  </span>
                  <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary mt-1">
                    {article.title}
                  </h3>
                  <p className="font-body font-normal text-base leading-relaxed text-text-body mt-2">
                    Discover the latest trends and insights shaping the world of
                    luxury real estate and interior design.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
