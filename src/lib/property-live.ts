import type { Property } from "@/lib/data/properties"
import type { Database } from "@/types/database.types"
import { createClient } from "@/lib/supabase/server"

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

export async function fetchLiveProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("publish_status", "live")
    .order("created_at", { ascending: false })

  return (data ?? []).map(mapPropertyRow)
}

export async function fetchLivePropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("publish_status", "live")
    .maybeSingle()

  return data ? mapPropertyRow(data) : null
}