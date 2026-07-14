import { ReactNode, Fragment } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "alt";
  padding?: "default" | "tight";
}

export function Section({
  children,
  className = "",
  variant = "primary",
  padding = "default",
}: SectionProps) {
  const bgClass = variant === "alt" ? "bg-bg-alt" : "bg-bg-primary";
  const pyClass = padding === "tight" ? "py-16 md:py-24" : "py-16 md:py-32";

  return (
    <section className={`${bgClass} ${pyClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  className = "",
  align = "left",
}: {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  const alignClasses = {
    left: "",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`${alignClasses[align]} mb-10 md:mb-16 ${className}`}>
      {title && <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary">{title}</h2>}
      {subtitle && <p className="font-body font-normal text-base leading-relaxed text-text-body mt-4">{subtitle}</p>}
    </div>
  );
}

export function SplitHeading({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <h2 className={`font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary ${className}`}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </h2>
  );
}