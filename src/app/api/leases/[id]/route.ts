import { createClient } from '@/lib/supabase/server'
import { apiData, apiError } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'

interface ListingEmbed {
  id: string
  title: string
  price_monthly: string | number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  image_urls: string[] | null
}

interface LeaseDetailRow {
  id: string
  listing_id: string
  tenant_id: string
  landlord_id: string
  lease_status: 'pending' | 'active' | 'terminated' | 'expired'
  start_date: string | null
  end_date: string | null
  monthly_rent: string | number | null
  signed_at: string | null
  created_at: string
  listing: ListingEmbed | ListingEmbed[] | null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const supabase = await createClient()

    const { data: lease, error } = await supabase
      .from('leases')
      .select(`
        id, listing_id, tenant_id, landlord_id, lease_status, start_date, end_date,
        monthly_rent, signed_at, created_at,
        listing:listing_id (
          id, title, price_monthly, currency, location, bedrooms, bathrooms, image_urls
        )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error || !lease) return apiError('Lease not found', 404)

    if (lease.tenant_id !== user.id && lease.landlord_id !== user.id) {
      return apiError('Not authorized to view this lease', 403)
    }

    const listing = Array.isArray(lease.listing)
      ? lease.listing[0] ?? null
      : lease.listing

    const result = {
      id: lease.id,
      lease_status: lease.lease_status,
      start_date: lease.start_date,
      end_date: lease.end_date,
      monthly_rent: lease.monthly_rent != null ? Number(lease.monthly_rent) : null,
      signed_at: lease.signed_at,
      created_at: lease.created_at,
      listing: listing ? {
        id: listing.id,
        price_monthly: Number(listing.price_monthly),
        bedrooms: Number(listing.bedrooms),
        bathrooms: Number(listing.bathrooms),
        title: listing.title,
        location: listing.location,
        image_urls: listing.image_urls ?? [],
      } : null,
    }

    return apiData(result)
  } catch (err) {
    return apiError(err, 401)
  }
}