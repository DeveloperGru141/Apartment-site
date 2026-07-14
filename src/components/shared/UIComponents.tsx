import { ReactNode, Fragment } from "react";

export function ViewProjectLink({ children, className = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      className={`inline-block mt-4 text-text-primary font-body font-semibold text-sm tracking-normal border-b border-text-primary pb-0.5 transition-all duration-300 group-hover:border-b-2 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function ArticleCard({
  title,
  category,
  image,
  featured = false,
  onClick,
}: {
  title: string;
  category: string;
  image: string;
  featured?: boolean;
  onClick?: () => void;
}) {
  if (featured) {
    return (
      <a href="#" className="group" onClick={onClick}>
        <img
          src={image}
          alt={title}
          className="w-full h-80 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        <div className="mt-6">
          <span className="font-heading font-medium text-xs tracking-widest text-text-muted uppercase">{category}</span>
          <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary mt-2">{title}</h3>
        </div>
      </a>
    );
  }

  return (
    <a href="#" className="group flex gap-6" onClick={onClick}>
      <img
        src={image}
        alt={title}
        className="w-32 h-32 object-cover transition-transform duration-700 group-hover:scale-105 flex-shrink-0"
      />
      <div>
        <span className="font-heading font-medium text-xs tracking-widest text-text-muted uppercase">{category}</span>
        <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary mt-1">{title}</h3>
        <p className="font-body font-normal text-base leading-relaxed text-text-body mt-2">
          Discover the latest trends and insights shaping the world of luxury real estate and interior design.
        </p>
      </div>
    </a>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-heading font-bold text-3xl md:text-4xl text-text-primary">{value}</p>
      <p className="font-body font-medium text-sm text-text-meta mt-1">{label}</p>
    </div>
  );
}

export function ServiceCard({ title, image }: { title: string; image: string }) {
  return (
    <a href="#" className="group relative h-72 md:h-96 overflow-hidden cursor-pointer">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/40" />
      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary text-white">{title}</h3>
      </div>
    </a>
  );
}

export function PortfolioCard({
  title,
  tag,
  image,
  date,
  reverse = false,
}: {
  title: string;
  tag: string;
  image: string;
  date: string;
  reverse?: boolean;
}) {
  return (
    <a href="#" className="group grid md:grid-cols-2 gap-8 items-center">
      <div className={reverse ? "md:order-2" : ""}>
        <img src={image} alt={title} className="w-full h-72 md:h-96 object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>
      <div className={reverse ? "md:order-1 md:text-right" : ""}>
        <span className="font-heading font-medium text-xs tracking-widest text-text-muted uppercase">{tag}</span>
        <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary mt-2 mb-3">{title}</h3>
        <p className="font-body font-normal text-base leading-relaxed text-text-body">
          A meticulously crafted living space that redefines modern luxury through thoughtful design and premium materials.
        </p>
        <ViewProjectLink>VIEW PROJECT</ViewProjectLink>
      </div>
    </a>
  );
}

export function ConciergeStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-7xl md:text-9xl font-bold text-gray-100 leading-none mb-4 md:mb-6 select-none">{number}</p>
      <h3 className="font-heading font-bold text-lg md:text-xl text-text-primary tracking-wider mb-4">{title}</h3>
      <p className="font-body font-normal text-base leading-relaxed text-text-body">{description}</p>
    </div>
  );
}