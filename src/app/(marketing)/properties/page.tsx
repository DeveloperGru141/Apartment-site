import PropertyCard from "@/components/properties/PropertyCard"
import PropertyFilterSidebar from "@/components/properties/PropertyFilterSidebar"
import PropertyGrid from "@/components/properties/PropertyGrid"
import { Section } from "@/components/shared/Section"
import { LAGOS_IMAGES } from "@/lib/images"
import { parsePrice, formatPriceShort } from "@/lib/format"

export const metadata = {
  title: "Properties for Sale & Rent in Lagos | HORIZON",
}

export default function PropertiesPage() {
  return (
    <Section>
      <div className="flex gap-8 py-12">
        <div className="w-72 hidden lg:block">
          <PropertyFilterSidebar />
        </div>
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              Properties in Lagos
            </h1>
            <p className="text-text-muted mt-1">
              Viewing {LAGOS_IMAGES.listings.length} properties
            </p>
          </div>
          <PropertyGrid>
            {LAGOS_IMAGES.listings.map((listing) => (
              <PropertyCard
                key={listing.id}
                property={{
                  id: listing.id,
                  title: listing.title,
                  price_monthly: parsePrice(listing.price),
                  currency: listing.price.startsWith("$") ? "$" : "₦",
                  location: listing.location,
                  bedrooms: listing.beds,
                  bathrooms: listing.baths,
                  sqft: listing.sqft,
                  image_urls: [listing.image],
                }}
                forSale={listing.status === "FOR SALE"}
                priceLabel={listing.price}
              />
            ))}
          </PropertyGrid>
        </div>
      </div>
    </Section>
  )
}
