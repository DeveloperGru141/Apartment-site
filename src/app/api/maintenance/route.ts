import { createClient } from '@/lib/supabase/server'
import { apiError, apiData } from '@/lib/api/response'
import { requireAuth } from '@/lib/auth/server'
import { maintenanceSchema } from '@/lib/validations/schemas'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(
        `id, title, description, status, priority, created_at,
         unit:units(id, property:properties(title, city, state))`
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
    const user = await requireAuth()
    const supabase = await createClient()

    let raw: unknown
    try {
      raw = await request.json()
    } catch {
      return apiError('Invalid JSON body', 400)
    }

    const parsed = maintenanceSchema.safeParse(raw)
    if (!parsed.success)
      return apiError(parsed.error.issues[0].message, 400)

    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert({ ...parsed.data, tenant_id: user.id })
      .select()
      .single()

    if (error) return apiError(error)

    return apiData(data, 201)
  } catch (err) {
    return apiError(err, 401)
  }
}
