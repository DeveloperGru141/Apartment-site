import { apiError } from '@/lib/api/response'

export async function GET() {
  return apiError('Applications have been consolidated into leases. Use /api/leases instead.', 410)
}
