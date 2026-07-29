import { createClient } from '@/lib/supabase/server'
import { apiError, apiData, requireCSRF } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'
import { UUID_RE } from '@/lib/constants'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('property_id')

    if (!propertyId) return apiError('property_id is required', 400)
    if (!UUID_RE.test(propertyId)) return apiError('Invalid property_id format', 400)

    const { data, error } = await supabase
      .from('reviews')
      .select(
        'id, overall_rating, title, comment, created_at, author:profiles(full_name, avatar_url)'
      )
      .eq('property_id', propertyId)
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

    if (!body.property_id)
      return apiError('property_id is required', 400)
    if (typeof body.property_id !== 'string' || !UUID_RE.test(body.property_id))
      return apiError('Invalid property_id format', 400)

    if (body.comment != null) {
      if (typeof body.comment !== 'string' || body.comment.length < 1)
        return apiError('comment must be a non-empty string', 400)
    }
    if (body.title != null && (typeof body.title !== 'string' || body.title.length < 1))
      return apiError('title must be a non-empty string', 400)

    if (body.overall_rating == null)
      return apiError('overall_rating is required', 400)

    const rating = Number(body.overall_rating)
    if (!Number.isFinite(rating) || rating < 1 || rating > 5)
      return apiError('overall_rating must be a number between 1 and 5', 400)

    if (!body.lease_id)
      return apiError('lease_id is required', 400)
    if (typeof body.lease_id !== 'string' || !UUID_RE.test(body.lease_id))
      return apiError('Invalid lease_id format', 400)

    const allowed = {
      property_id: body.property_id,
      lease_id: body.lease_id,
      overall_rating: rating,
      title: body.title ?? null,
      comment: body.comment ?? null,
      reviewer_id: user.id,
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(allowed)
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}
