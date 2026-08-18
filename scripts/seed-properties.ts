import { config } from "dotenv"
config({ path: ".env.local" })
import { createClient } from "@supabase/supabase-js"
import { properties } from "../src/lib/data/properties"
import type { Database } from "../src/types/database.types"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before running."
  )
  process.exit(1)
}

const admin = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SEED_EMAIL = "seed@horizon.ng"
const SEED_PASSWORD = "horizon-seed-2026"
const SEED_FULL_NAME = "HORIZON Seed"

async function getOrCreateSeedSeller(): Promise<string> {
  const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })

  const seedUser = existing?.users.find((u) => u.email === SEED_EMAIL)

  if (seedUser) {
    console.log(`Seed seller found: ${SEED_EMAIL} (${seedUser.id})`)
    return seedUser.id
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: SEED_FULL_NAME, role: "admin" },
  })

  if (createError || !created?.user) {
    console.error("Failed to create seed seller:", createError?.message)
    process.exit(1)
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: created.user.id,
    email: SEED_EMAIL,
    full_name: SEED_FULL_NAME,
    role: "admin",
  })

  if (profileError) {
    console.error("Failed to upsert seed profile:", profileError.message)
    process.exit(1)
  }

  console.log(`Seed seller created: ${SEED_EMAIL} (${created.user.id})`)
  return created.user.id
}

async function main() {
  const sellerId = await getOrCreateSeedSeller()

  const { data: existingProps } = await admin.from("properties").select("slug")

  const existingSlugs = new Set((existingProps ?? []).map((p) => p.slug))
  let inserted = 0
  let skipped = 0

  for (const p of properties) {
    if (existingSlugs.has(p.slug)) {
      skipped++
      continue
    }

    const { error } = await admin.from("properties").insert({
      seller_id: sellerId,
      agent_id: p.agentId,
      slug: p.slug,
      title: p.title,
      description: p.description,
      neighborhood: p.neighborhood,
      location: p.location,
      status: p.status,
      property_type: p.propertyType,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      price: p.price,
      price_label: p.priceLabel,
      images: p.images,
      category: p.category,
      featured: p.featured,
      publish_status: "live",
      created_at: p.createdAt ? `${p.createdAt}T00:00:00Z` : undefined,
    })

    if (error) {
      console.error(`Failed to insert ${p.slug}:`, error.message)
      continue
    }

    inserted++
  }

  console.log(
    `Done. Inserted ${inserted} properties, skipped ${skipped} existing (source total: ${properties.length}).`
  )
}

main().catch((err) => {
  console.error("Unexpected error:", err)
  process.exit(1)
})