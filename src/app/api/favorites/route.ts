import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, requireCSRF } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'
import { UUID_RE } from '@/lib/constants'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('saved_listings')
      .select(
        'listing_id, created_at, listing:listings(id, title, price_monthly, bedrooms, bathrooms, image_urls, currency, location)'
      )
      .eq('tenant_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return apiError(error)

    return apiData(data ?? [])
  } catch (err) {
    return apiError(err, 401)
  }
}

export async function POST(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const user = await requireAuth()
    const supabase = await createClient()

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.listing_id) return apiError('listing_id is required', 400)
    if (typeof body.listing_id !== 'string' || !UUID_RE.test(body.listing_id))
      return apiError('Invalid listing_id format', 400)

    const { data, error } = await supabase
      .from('saved_listings')
      .insert({ tenant_id: user.id, listing_id: body.listing_id })
      .select()
      .single()

    if (error) {
      if (error.message?.includes('duplicate') || error.code === '23505')
        return apiError('Already saved', 409)
      if (error.code === '23503')
        return apiError('Listing not found', 404)
      return apiError(error)
    }

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}

export async function DELETE(request: Request) {
  try {
    const csrf = requireCSRF(request)
    if (csrf) return csrf

    const user = await requireAuth()
    const supabase = await createClient()

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    if (!body.listing_id) return apiError('listing_id is required', 400)
    if (typeof body.listing_id !== 'string' || !UUID_RE.test(body.listing_id))
      return apiError('Invalid listing_id format', 400)

    const { data: existing } = await supabase
      .from('saved_listings')
      .select('listing_id')
      .eq('tenant_id', user.id)
      .eq('listing_id', body.listing_id)
      .maybeSingle()

    if (!existing) return apiError('Saved listing not found', 404)

    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('tenant_id', user.id)
      .eq('listing_id', body.listing_id)

    if (error) return apiError(error)

    return apiData({ message: 'Removed from saved listings' })
  } catch (err) {
    return apiError(err, 401)
  }
}
