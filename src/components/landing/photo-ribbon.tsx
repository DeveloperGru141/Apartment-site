import { images } from "@/lib/images";

const ribbonImages = images.photoRibbon

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
