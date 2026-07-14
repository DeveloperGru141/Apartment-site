const ribbonImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=400&q=80",
];

export default function PhotoRibbon() {
  return (
    <section className="overflow-hidden bg-bg-primary">
      <div className="flex gap-1 animate-scroll">
        {[...ribbonImages, ...ribbonImages].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-40 md:h-64 w-60 md:w-96 object-cover flex-shrink-0"
          />
        ))}
      </div>
    </section>
  );
}
