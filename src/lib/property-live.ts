import { unstable_cache } from "next/cache"
import type { ListingStatus, Property, PropertyCategory, PropertyType } from "@/lib/data/properties"
import type { Database } from "@/types/database.types"
import { createAnonClient } from "@/lib/supabase/anon"

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"]

const LIVE_STATUSES = ["For Rent", "For Sale"] as const
const LIVE_TYPES = [
  "Apartment",
  "Maisonette",
  "Penthouse",
  "Townhouse",
  "Terrace",
  "Detached Duplex",
  "Semi-Detached",
  "Detached Bungalow",
  "Commercial",
] as const
const LIVE_CATEGORIES = ["rental", "commercial", "resale"] as const

function isLiveStatus(status: PropertyRow["status"]): status is ListingStatus {
  return LIVE_STATUSES.includes(status as (typeof LIVE_STATUSES)[number])
}

function isLiveType(propertyType: PropertyRow["property_type"]): propertyType is PropertyType {
  return LIVE_TYPES.includes(propertyType as (typeof LIVE_TYPES)[number])
}

function isLiveCategory(category: PropertyRow["category"]): category is PropertyCategory {
  return LIVE_CATEGORIES.includes(category as (typeof LIVE_CATEGORIES)[number])
}

export function mapPropertyRow(row: PropertyRow): Property | null {
  if (!isLiveStatus(row.status) || !isLiveType(row.property_type) || !isLiveCategory(row.category)) {
    return null
  }
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
    .in("status", [...LIVE_STATUSES])
    .in("property_type", [...LIVE_TYPES])
    .in("category", [...LIVE_CATEGORIES])
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
    .in("status", [...LIVE_STATUSES])
    .in("property_type", [...LIVE_TYPES])
    .in("category", [...LIVE_CATEGORIES])
    .maybeSingle()

  return data ?? null
}

const fetchCachedLiveProperties = unstable_cache(queryLiveProperties, ["live-properties"], {
  tags: ["properties"],
  revalidate: 300,
})

const fetchCachedLivePropertyBySlug = unstable_cache(
  (slug: string) => queryLivePropertyBySlug(slug),
  ["live-property-by-slug"],
  {
    tags: ["properties"],
    revalidate: 300,
  }
)

export async function fetchLiveProperties(): Promise<Property[]> {
  const rows = await fetchCachedLiveProperties()
  return rows
    .map(mapPropertyRow)
    .filter((p): p is Property => p !== null)
}

export async function fetchLivePropertyBySlug(slug: string): Promise<Property | null> {
  const row = await fetchCachedLivePropertyBySlug(slug)
  return row ? mapPropertyRow(row) : null
}