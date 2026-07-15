import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') ?? 'tenant'

    let query = supabase.from('leases').select(
      `id, status, start_date, end_date, monthly_rent, security_deposit,
       signed_at, created_at,
       unit:units(id, monthly_rent, bedrooms, bathrooms,
         property:properties(title, city, state, cover_image))`
    )

    if (role === 'landlord') {
      query = query.eq('landlord_id', user.id)
    } else {
      query = query.eq('tenant_id', user.id)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.unit_id || !body.tenant_id) {
      return NextResponse.json(
        { error: 'unit_id and tenant_id are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('leases')
      .insert({
        ...body,
        landlord_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
