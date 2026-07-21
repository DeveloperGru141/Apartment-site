import Link from "next/link";
import { images } from "@/lib/images";

const pf = images.portfolio

const portfolio = [
  {
    title: "LUXURY COLLECTION",
    tag: "PENTHOUSE",
    image: pf[0],
    date: "2026",
  },
  {
    title: "EXCLUSIVE HOMES",
    tag: "RESIDENCE",
    image: pf[1],
    date: "2025",
  },
  {
    title: "URBAN SANCTUARY",
    tag: "APARTMENT",
    image: pf[2],
    date: "2026",
  },
  {
    title: "OCEANFRONT LIVING",
    tag: "VILLA",
    image: pf[3],
    date: "2025",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-16 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary mb-10 md:mb-16">
          TIMELESS DESIGNS ACROSS
          <br />
          OUR LUXURY PORTFOLIO
        </h2>

        <div className="space-y-12">
          {portfolio.map((item, i) => (
            <Link
              key={item.title}
              href="/signup"
              className="group grid md:grid-cols-2 gap-8 items-center"
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div className={i % 2 === 1 ? "md:order-1 md:text-right" : ""}>
                <span className="font-heading font-medium text-xs tracking-widest text-text-muted uppercase">
                  {item.tag}
                </span>
                <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="font-body font-normal text-base leading-relaxed text-text-body">
                  A meticulously crafted living space that redefines modern
                  luxury through thoughtful design and premium materials.
                </p>
                <span className="inline-block mt-4 text-text-primary font-body font-semibold text-sm tracking-normal border-b border-text-primary pb-0.5 transition-all duration-300 group-hover:border-b-2">
                  VIEW PROJECT
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
