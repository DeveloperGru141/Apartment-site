import { apiError } from '@/lib/api/response'

export async function GET() {
  return apiError('Maintenance requests are not yet available in this version.', 410)
}

export async function POST() {
  return apiError('Maintenance requests are not yet available in this version.', 410)
}
