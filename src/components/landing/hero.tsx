import Link from "next/link";
import { images } from "@/lib/images";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={images.hero}
          alt="Luxury apartment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-tighter text-text-primary uppercase text-white mb-6">
          WHERE DREAMS
          <br />
          MEET REALITY
        </h1>
        <Link
          href="/listings"
          className="inline-block px-8 py-3.5 md:px-10 md:py-4 bg-white text-text-primary font-body font-semibold text-sm tracking-normal transition-all duration-300 hover:bg-gray-100 hover:scale-105"
        >
          EXPLORE COLLECTION
        </Link>
        <p className="mt-6 text-white/70 font-body font-normal text-sm tracking-normal">
          Curated luxury residences in the world&apos;s most sought-after locations
        </p>
      </div>
    </section>
  );
}
