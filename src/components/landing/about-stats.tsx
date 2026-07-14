export default function AboutStats() {
  return (
    <section className="py-16 md:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary mb-6 md:mb-8">
              CRAFTING LUXURY HOMES,
              <br />
              DEFINING MODERN
              <br />
              LIVING
            </h2>
            <p className="font-body font-normal text-base leading-relaxed text-text-body mb-10 md:mb-12">
              At LUXORA, we curate exceptional living spaces that blend
              architectural brilliance with uncompromising comfort. Each
              property in our portfolio is selected for its unique character
              and premium craftsmanship.
            </p>

<div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-8 md:pt-10">
                <div>
                  <p className="font-heading font-bold text-3xl md:text-4xl text-text-primary">1238+</p>
                  <p className="font-body font-medium text-sm text-text-meta mt-1">Properties</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-3xl md:text-4xl text-text-primary">100%</p>
                  <p className="font-body font-medium text-sm text-text-meta mt-1">Satisfaction</p>
                </div>
                <div>
                  <p className="font-heading font-bold text-3xl md:text-4xl text-text-primary">2.4K+</p>
                  <p className="font-body font-medium text-sm text-text-meta mt-1">Clients</p>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"
                alt="Luxury living room"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
            <img
              src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&q=80"
              alt="Modern kitchen"
              className="w-full h-48 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
              alt="Luxury bathroom"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
