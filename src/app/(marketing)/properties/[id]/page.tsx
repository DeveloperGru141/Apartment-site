import { notFound } from "next/navigation"
import Link from "next/link"
import { Section } from "@/components/shared/Section"
import { LAGOS_IMAGES } from "@/lib/images"
import { formatPriceShort, parsePrice } from "@/lib/format"
import { getWhatsAppInquiryLink } from "@/lib/whatsapp"

export const dynamic = "force-static"

export function generateStaticParams() {
  return LAGOS_IMAGES.listings.map((listing) => ({
    id: listing.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = LAGOS_IMAGES.listings.find((l) => l.id === id)
  if (!listing) return {}
  return { title: `${listing.title} | HORIZON` }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = LAGOS_IMAGES.listings.find((l) => l.id === id)
  if (!listing) notFound()

  const numericPrice = parsePrice(listing.price)
  const shortPrice = formatPriceShort(numericPrice)

  return (
    <Section>
      <div className="py-12">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          &larr; Back to Properties
        </Link>

        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          <img
            src={listing.image || LAGOS_IMAGES.hero.main}
            alt={listing.title}
            className="w-full h-full object-cover"
            style={{ viewTransitionName: `listing-img-${listing.id}`, contain: "layout" } as React.CSSProperties}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
            <p className="font-heading font-bold text-lg">{listing.price}</p>
          </div>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary mb-2">
              {listing.title}
            </h1>
            <p className="text-text-muted flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {listing.location}
            </p>

          </div>
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-accent/10 backdrop-blur-sm border border-accent/20 text-accent rounded-full whitespace-nowrap">
            {listing.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Beds", value: listing.beds },
            { label: "Baths", value: listing.baths },
            { label: "Sqft", value: listing.sqft.toLocaleString() },
            { label: "Price", value: shortPrice },
          ].map((item) => (
            <div key={item.label} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
              <p className="text-sm text-text-muted">{item.label}</p>
              <p className="font-heading font-bold text-xl">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">Description</h2>
          <p className="text-text-muted leading-relaxed">
            Experience unparalleled luxury in one of Lagos&rsquo;s most prestigious locations.
            This meticulously designed {listing.type?.toLowerCase() || "residence"} offers world-class finishes,
            breathtaking views, and an unrivaled living experience in the heart of the city.
          </p>
        </div>

        <a
          href={getWhatsAppInquiryLink({ title: listing.title, location: listing.location, price: listing.price })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-xl border border-amber-400/30 transition-all duration-300"
        >
          Inquire via WhatsApp
        </a>
      </div>
    </Section>
  )
}
