import { createClient } from '@/lib/supabase/server'
import { apiError, apiPaginated, getPagination, buildPagination } from '@/lib/api/response'
import { getMockImages } from '@/lib/mock-images'
import type { ActiveListing } from '@/types/database.types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const { page, limit, offset } = getPagination(searchParams)

    const city = searchParams.get('city')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    let query = supabase
      .from('active_listings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (city) query = query.ilike('location', `%${city}%`)
    if (bedrooms) query = query.gte('bedrooms', Number(bedrooms))
    if (bathrooms) query = query.gte('bathrooms', Number(bathrooms))
    if (minPrice) query = query.gte('price_monthly', Number(minPrice))
    if (maxPrice) query = query.lte('price_monthly', Number(maxPrice))

    const { data, error, count } = await query

    if (error) return apiError(error)

    const rows = (data ?? []).map((row: ActiveListing) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price_monthly: Number(row.price_monthly),
      currency: row.currency,
      location: row.location,
      bedrooms: Number(row.bedrooms),
      bathrooms: Number(row.bathrooms),
      sqft: row.sqft != null ? Number(row.sqft) : null,
      amenities: row.amenities ?? [],
      image_urls: row.image_urls?.length ? row.image_urls : getMockImages(row.id),
      created_at: row.created_at,
      landlord_name: row.landlord_name,
      landlord_avatar: row.landlord_avatar,
    }))

    return apiPaginated(rows, buildPagination(page, limit, count ?? 0))
  } catch (err) {
    return apiError(err)
  }
}