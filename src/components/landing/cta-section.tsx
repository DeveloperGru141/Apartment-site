export default function CtaSection() {
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
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80"
            alt=""
            className="w-full aspect-square object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80"
            alt=""
            className="w-full aspect-square object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&q=80"
            alt=""
            className="w-full aspect-square object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=300&q=80"
            alt=""
            className="w-full aspect-square object-cover"
          />
        </div>
      </div>
    </section>
  );
}
