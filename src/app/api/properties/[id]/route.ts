import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        units (
          id,
          unit_number,
          floor,
          bedrooms,
          bathrooms,
          square_feet,
          rent_price,
          deposit_amount,
          available_from,
          status,
          amenities,
          images
        ),
        landlord:profiles!properties_landlord_id_fkey (
          id,
          full_name,
          avatar_url,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}