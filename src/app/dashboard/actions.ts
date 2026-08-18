"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { deriveCategory, uniqueSlug } from "@/lib/listing-utils"
import { formatPrice } from "@/lib/format"
import { NEIGHBORHOODS } from "@/lib/images"
import type { Database } from "@/types/database.types"

type PropertyStatus = Database["public"]["Enums"]["property_status"]
type PropertyType = Database["public"]["Enums"]["property_type"]

const SUPPORTED_NEIGHBORHOODS = new Set(NEIGHBORHOODS)

function requiredString(formData: FormData, key: string): string {
  const value = formData.get(key)
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`)
  }
  return value.trim()
}

function optionalNumber(formData: FormData, key: string): number | null {
  const value = formData.get(key)
  if (value === null || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function saveListing(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const id = typeof formData.get("id") === "string" ? (formData.get("id") as string) : null

  const title = requiredString(formData, "title")
  const description = requiredString(formData, "description")
  const neighborhood = requiredString(formData, "neighborhood")
  const location = requiredString(formData, "location")
  const status = requiredString(formData, "status") as PropertyStatus
  const propertyType = requiredString(formData, "propertyType") as PropertyType
  const agentId = requiredString(formData, "agentId")

  const price = optionalNumber(formData, "price")
  if (price === null || price <= 0) throw new Error("price must be greater than 0")

  const bedrooms = optionalNumber(formData, "bedrooms") ?? 0
  const bathrooms = optionalNumber(formData, "bathrooms") ?? 0
  const sqft = optionalNumber(formData, "sqft")
  if (bedrooms < 0 || bathrooms < 0 || (sqft !== null && sqft < 0)) {
    throw new Error("bedrooms, bathrooms, and sqft cannot be negative")
  }

  const imagesRaw = formData.get("images")
  const images: string[] =
    typeof imagesRaw === "string" ? (JSON.parse(imagesRaw) as string[]) : []
  if (images.length === 0) throw new Error("At least one image is required")

  if (!SUPPORTED_NEIGHBORHOODS.has(neighborhood)) {
    throw new Error("Neighborhood must be one of the supported HORIZON neighborhoods")
  }

  const category = deriveCategory(status, propertyType)
  const priceLabel = formatPrice(price, status)
  const slug = await uniqueSlug(supabase, title, id ?? undefined)

  const payload = {
    title,
    description,
    neighborhood,
    location,
    status,
    property_type: propertyType,
    bedrooms,
    bathrooms,
    sqft,
    price,
    price_label: priceLabel,
    images,
    agent_id: agentId,
    category,
  }

  if (id) {
    const { data: updated, error } = await supabase
      .from("properties")
      .update({ ...payload, slug })
      .eq("id", id)
      .select("id")
    if (error) throw new Error(error.message)
    if (!updated || updated.length === 0) {
      throw new Error("Listing not found — you can only edit your own listings")
    }
  } else {
    const { error } = await supabase.from("properties").insert({
      ...payload,
      slug,
      seller_id: user.id,
    })
    if (error) throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/properties")
  revalidatePath("/", "layout")
  updateTag("properties")
  redirect("/dashboard")
}

export async function archiveListing(formData: FormData) {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) return

  const supabase = await createClient()
  await supabase.from("properties").update({ publish_status: "archived" }).eq("id", id)

  revalidatePath("/dashboard")
  revalidatePath("/properties")
  updateTag("properties")
}

export async function deleteListing(formData: FormData) {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) return

  const supabase = await createClient()
  await supabase.from("properties").delete().eq("id", id)

  revalidatePath("/dashboard")
  revalidatePath("/properties")
  updateTag("properties")
}

export async function unarchiveListing(formData: FormData) {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) return

  const supabase = await createClient()
  await supabase.from("properties").update({ publish_status: "live" }).eq("id", id)

  revalidatePath("/dashboard")
  revalidatePath("/properties")
  updateTag("properties")
  redirect("/dashboard")
}