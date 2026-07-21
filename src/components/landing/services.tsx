import Link from "next/link";
import { images } from "@/lib/images";

const svc = images.services

const services = [
  {
    title: "CONCIERGE SERVICES",
    image: svc[0],
  },
  {
    title: "ELEGANT INTERIORS",
    image: svc[1],
  },
  {
    title: "PRIVATE AMENITIES",
    image: svc[2],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary mb-10 md:mb-16">
          PREMIUM SERVICES DESIGNED
          <br />
          FOR LUXURY LIVING
        </h2>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href="/signup"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
