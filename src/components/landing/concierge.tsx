const steps = [
  {
    number: "01",
    title: "APPROACH",
    description:
      "We take a collaborative approach, working closely with you to understand your vision and transform it into a living space that exceeds expectations.",
  },
  {
    number: "02",
    title: "JOURNEY",
    description:
      "From initial consultation to final handover, our team guides you through every step of securing your ideal residence with complete transparency.",
  },
  {
    number: "03",
    title: "METHOD",
    description:
      "Our curated methodology combines market expertise with personalized service to find properties that truly resonate with your lifestyle.",
  },
];

export default function Concierge() {
  return (
    <section className="py-16 md:py-32 bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary mb-12 md:mb-20">
          PERSONALIZED CONCIERGE
          <br />
          FOR ELEVATED LIVING
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-16 mb-12 md:mb-20">
          {steps.map((step) => (
            <div key={step.number}>
              <p className="text-7xl md:text-9xl font-bold text-gray-100 leading-none mb-4 md:mb-6 select-none">
                {step.number}
              </p>
              <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary tracking-wider mb-4">
                {step.title}
              </h3>
              <p className="font-body font-normal text-base leading-relaxed text-text-body">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full min-h-[300px] md:min-h-[450px] bg-gray-200 overflow-hidden rounded-lg relative">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80"
            alt="Minimalist living room interior"
            className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
