import { getMockListings } from '@/lib/api/mock-listings'
import { apiPaginated } from '@/lib/api/response'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = getMockListings(searchParams)
  return apiPaginated(result.data, result.pagination)
}
