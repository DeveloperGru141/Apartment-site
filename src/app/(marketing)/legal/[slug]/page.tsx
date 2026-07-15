import Link from "next/link";
import { notFound } from "next/navigation";

const LEGAL_PAGES: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: "Our full privacy policy is being finalized. HORIZON is committed to protecting your personal information and will publish complete details here soon.",
  },
  terms: {
    title: "Terms of Service",
    body: "Our terms of service are being finalized. These will govern your use of the HORIZON platform and services.",
  },
  cookies: {
    title: "Cookie Policy",
    body: "Our cookie policy is being finalized. We use cookies to enhance your browsing experience and analyze site traffic.",
  },
  disclaimer: {
    title: "Disclaimer",
    body: "Our disclaimer is being finalized. Property listings, pricing, and availability are subject to change without notice.",
  },
};

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];

  if (!page) {
    notFound();
  }

  return (
    <section className="py-16 md:py-32 bg-bg-primary">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="font-body font-medium text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          &larr; Back to home
        </Link>
        <h1 className="font-heading font-bold text-3xl md:text-4xl tracking-tight text-text-primary mt-6">
          {page.title}
        </h1>
        <p className="font-body font-normal text-base leading-relaxed text-text-body mt-6">
          {page.body}
        </p>
      </div>
    </section>
  );
}
