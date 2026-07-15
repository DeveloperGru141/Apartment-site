import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const role = await getUserRole()

    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unitId = searchParams.get('unit_id')

    let query = supabase
      .from('applications')
      .select(
        '*, unit:units(id, monthly_rent, property:properties(title, city, state))'
      )
      .order('created_at', { ascending: false })

    if (role === 'tenant') {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      query = query.eq('applicant_id', user!.id)
    }

    if (unitId) query = query.eq('unit_id', unitId)

    const { data, error } = await query

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

    if (!body.unit_id) {
      return NextResponse.json(
        { error: 'unit_id is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...body,
        applicant_id: user.id,
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
