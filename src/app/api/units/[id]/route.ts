import { getMockListing } from '@/lib/api/mock-listings'
import { apiError, apiData } from '@/lib/api/response'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = getMockListing(id)
  if (!result) return apiError('Listing not found', 404)
  return apiData(result)
}
