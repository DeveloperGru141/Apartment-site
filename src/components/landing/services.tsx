const services = [
  {
    title: "CONCIERGE SERVICES",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
  {
    title: "ELEGANT INTERIORS",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    title: "PRIVATE AMENITIES",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
  },
];

export default function Services() {
  return (
    <section className="py-16 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-[#111111] mb-10 md:mb-16">
          PREMIUM SERVICES DESIGNED
          <br />
          FOR LUXURY LIVING
        </h2>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {services.map((service) => (
            <a
              key={service.title}
              href="#"
              className="group relative h-72 md:h-96 overflow-hidden cursor-pointer"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <h3 className="font-heading font-bold text-lg md:text-xl text-[#111111] text-white">
                  {service.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
