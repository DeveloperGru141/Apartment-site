import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Ruler, MapPin, Building2 } from "lucide-react";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyCard from "@/components/properties/PropertyCard";
import { fetchLivePropertyBySlug, fetchLiveProperties } from "@/lib/property-live";
import { agents } from "@/lib/data/agents";
import { getWhatsAppInquiryLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await fetchLivePropertyBySlug(slug);
  return {
    title: property ? `${property.title} — HORIZON Lagos` : "Property — HORIZON Lagos",
    description: property?.description,
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await fetchLivePropertyBySlug(slug);

  if (!property) notFound();

  const agent = agents.find((a) => a.id === property.agentId);

  const all = await fetchLiveProperties();
  const similar = all
    .filter(
      (p) =>
        p.slug !== property.slug &&
        (p.neighborhood === property.neighborhood || p.propertyType === property.propertyType)
    )
    .slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-text-primary transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-text-primary">{property.status}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2">
            <PropertyGallery images={property.images} title={property.title} propertyId={property.id} />
          </div>

          <div>
            <div className="rounded-2xl border border-gray-100 bg-bg-alt bg-opacity-60 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 px-3 py-1.5 rounded-full">
                  {property.status}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                  {property.propertyType}
                </span>
              </div>

              <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-text-muted text-sm mt-2">
                <MapPin className="w-4 h-4 shrink-0" /> {property.location}
              </p>

              <p className="font-heading text-3xl font-extrabold text-text-primary mt-6">
                {property.priceLabel}
              </p>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                  <BedDouble className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                  <p className="text-lg font-bold text-text-primary">{property.bedrooms}</p>
                  <p className="text-xs text-text-muted">Beds</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                  <Bath className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                  <p className="text-lg font-bold text-text-primary">{property.bathrooms}</p>
                  <p className="text-xs text-text-muted">Baths</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                  <Ruler className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                  <p className="text-lg font-bold text-text-primary">{property.sqft.toLocaleString()}</p>
                  <p className="text-xs text-text-muted">sqft</p>
                </div>
              </div>

              <div className="mt-8 p-5 rounded-xl bg-white border border-gray-100 flex items-center gap-4">
                {agent && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary truncate">{agent.name}</p>
                      <p className="text-xs text-text-muted">{agent.role}</p>
                    </div>
                  </>
                )}
              </div>

              <a
                href={getWhatsAppInquiryLink({
                  title: property.title,
                  location: property.location,
                  price: property.priceLabel,
                  agentWhatsapp: agent?.whatsapp,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="shine-sweep block w-full mt-5 text-center bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold uppercase tracking-wider rounded-xl py-4 transition-colors"
              >
                Inquire via WhatsApp
              </a>
              {agent && (
                <Link
                  href={`/agents/${agent.slug}`}
                  className="block w-full text-center text-sm text-text-muted hover:text-text-primary underline underline-offset-4 mt-3 transition-colors"
                >
                  View agent profile
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">About this home</h2>
            <p className="text-text-body text-base leading-relaxed">{property.description}</p>

            <div className="mt-10">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-text-primary mb-4">
                <Building2 className="w-5 h-5 text-amber-500" /> Listing details
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ["Neighborhood", property.neighborhood], 
                  ["Property type", property.propertyType],
                  ["Bedrooms", property.bedrooms ? String(property.bedrooms) : "—"],
                  ["Bathrooms", property.bathrooms ? String(property.bathrooms) : "—"],
                  ["Size", `${property.sqft.toLocaleString()} sqft`],
                  ["Listing", property.featured ? "Featured" : "Standard"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-gray-100 py-2.5">
                    <dt className="text-text-muted">{label}</dt>
                    <dd className="font-semibold text-text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 gap-6">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
              {similar.length === 0 && (
                <p className="text-text-muted">Explore the full portfolio for similar listings.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}