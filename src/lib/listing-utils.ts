import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

type PropertyStatus = Database["public"]["Enums"]["property_status"]
type PropertyType = Database["public"]["Enums"]["property_type"]
type PropertyCategory = Database["public"]["Enums"]["property_category"]

export function deriveCategory(status: PropertyStatus, propertyType: PropertyType): PropertyCategory {
  if (status === "For Rent") return "rental"
  if (propertyType === "Commercial") return "commercial"
  return "resale"
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export async function uniqueSlug(
  supabase: SupabaseClient<Database>,
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title)
  if (!base) throw new Error("Title must contain at least one letter or number")

  const { data } = await supabase
    .from("properties")
    .select("slug")
    .like("slug", `${base}%`)

  const taken = new Set(
    (data ?? []).filter((row) => row.slug !== excludeId).map((row) => row.slug)
  )

  if (!taken.has(base)) return base

  let n = 2
  while (taken.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}