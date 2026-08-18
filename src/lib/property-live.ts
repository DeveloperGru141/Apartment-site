import { unstable_cache } from "next/cache"
import type { Property } from "@/lib/data/properties"
import type { Database } from "@/types/database.types"
import { createAnonClient } from "@/lib/supabase/anon"

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"]

export function mapPropertyRow(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    neighborhood: row.neighborhood,
    location: row.location,
    status: row.status,
    propertyType: row.property_type,
    bedrooms: row.bedrooms,
    bathrooms: Number(row.bathrooms),
    sqft: row.sqft ?? 0,
    price: Number(row.price),
    priceLabel: row.price_label,
    images: row.images,
    agentId: row.agent_id,
    category: row.category,
    featured: row.featured,
    createdAt: row.created_at,
  }
}

async function queryLiveProperties(): Promise<PropertyRow[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("publish_status", "live")
    .order("created_at", { ascending: false })

  return data ?? []
}

async function queryLivePropertyBySlug(slug: string): Promise<PropertyRow | null> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("publish_status", "live")
    .maybeSingle()

  return data ?? null
}

const fetchCachedLiveProperties = unstable_cache(queryLiveProperties, ["live-properties"], {
  tags: ["properties"],
  revalidate: 60,
})

const fetchCachedLivePropertyBySlug = unstable_cache(
  (slug: string) => queryLivePropertyBySlug(slug),
  ["live-property-by-slug"],
  {
    tags: ["properties"],
    revalidate: 60,
  }
)

export async function fetchLiveProperties(): Promise<Property[]> {
  const rows = await fetchCachedLiveProperties()
  return rows.map(mapPropertyRow)
}

export async function fetchLivePropertyBySlug(slug: string): Promise<Property | null> {
  const row = await fetchCachedLivePropertyBySlug(slug)
  return row ? mapPropertyRow(row) : null
}