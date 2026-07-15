import { createClient } from '@/lib/supabase/server'

export const STORAGE_BUCKETS = {
  propertyImages: 'property-images',
  avatars: 'avatars',
  documents: 'documents',
  leaseFiles: 'lease-files',
} as const

export type BucketName = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

/**
 * Upload a file to a Supabase Storage bucket and return its public URL.
 */
export async function uploadFile(
  bucket: BucketName,
  path: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, cacheControl: '3600' })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

/**
 * Delete a file from a Supabase Storage bucket.
 */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error: error?.message ?? null }
}

/**
 * Build a storage path for a property image, namespaced by owner + property.
 */
export function propertyImagePath(
  ownerId: string,
  propertyId: string,
  fileName: string
): string {
  return `${ownerId}/${propertyId}/${Date.now()}-${fileName}`
}
