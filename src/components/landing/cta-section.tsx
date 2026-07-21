import { images } from "@/lib/images";

export default function CtaSection() {
  const imgs = images.ctaSection
  return (
    <section id="contact" className="py-16 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary">
            LET&apos;S CREATE HOMES
            <br />
            WITH MEANING
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
          {imgs.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full aspect-square object-cover" />
          ))}
        </div>
      </div>
    </section>
  );
}
