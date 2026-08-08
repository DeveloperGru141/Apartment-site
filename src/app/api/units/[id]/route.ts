import { createClient } from '@/lib/supabase/server'
import { apiData, apiError } from '@/lib/api/response'
import { getMockImages } from '@/lib/mock-images'

interface LandlordProfile {
  full_name: string | null
  avatar_url: string | null
}

interface ListingWithLandlord {
  id: string
  title: string
  description: string | null
  price_monthly: string | number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  amenities: string[] | null
  image_urls: string[] | null
  status: 'draft' | 'active' | 'rented' | 'archived'
  is_verified: boolean
  created_at: string
  updated_at: string
  landlord: LandlordProfile | LandlordProfile[] | null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .select(
        'id, title, description, price_monthly, currency, location, bedrooms, bathrooms, sqft, amenities, image_urls, status, is_verified, created_at, updated_at, landlord:landlord_id(full_name, avatar_url)'
      )
      .eq('id', id)
      .maybeSingle()

    if (error || !listing) return apiError('Listing not found', 404)

    const landlord = Array.isArray(listing.landlord)
      ? listing.landlord[0] ?? null
      : listing.landlord

    return apiData({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price_monthly: Number(listing.price_monthly),
      currency: listing.currency,
      location: listing.location,
      bedrooms: Number(listing.bedrooms),
      bathrooms: Number(listing.bathrooms),
      sqft: listing.sqft != null ? Number(listing.sqft) : null,
      amenities: listing.amenities ?? [],
      image_urls: listing.image_urls?.length ? listing.image_urls : getMockImages(listing.id),
      status: listing.status,
      is_verified: listing.is_verified,
      created_at: listing.created_at,
      updated_at: listing.updated_at,
      landlord_name: landlord?.full_name ?? null,
      landlord_avatar: landlord?.avatar_url ?? null,
    })
  } catch (err) {
    return apiError(err)
  }
}