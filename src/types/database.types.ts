// ============================================
// HORIZON — Database Type Definitions
// 1:1 mapping with supabase/migrations/0000_initial_schema.sql
// ============================================

// ─── Enums ───────────────────────────────────

export type UserRole = 'tenant' | 'landlord' | 'admin'
export type ListingStatus = 'draft' | 'active' | 'rented' | 'archived'
export type LeaseStatus = 'pending' | 'active' | 'terminated' | 'expired'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

// ─── Row Types ───────────────────────────────

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  full_name?: string | null
  avatar_url?: string | null
  phone?: string | null
  role?: UserRole
}

export interface ProfileUpdate {
  full_name?: string | null
  avatar_url?: string | null
  phone?: string | null
}

export interface Listing {
  id: string
  landlord_id: string
  title: string
  description: string | null
  price_monthly: number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  amenities: string[] | null
  image_urls: string[] | null
  status: ListingStatus
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ListingInsert {
  landlord_id: string
  title: string
  description?: string | null
  price_monthly: number
  currency?: string
  location?: string | null
  bedrooms?: number
  bathrooms?: number
  sqft?: number | null
  amenities?: string[] | null
  image_urls?: string[] | null
  status?: ListingStatus
}

export interface ListingUpdate {
  title?: string
  description?: string | null
  price_monthly?: number
  currency?: string
  location?: string | null
  bedrooms?: number
  bathrooms?: number
  sqft?: number | null
  amenities?: string[] | null
  image_urls?: string[] | null
  status?: ListingStatus
}

export interface Lease {
  id: string
  listing_id: string
  tenant_id: string
  landlord_id: string
  start_date: string
  end_date: string
  monthly_rent: number
  lease_status: LeaseStatus
  digital_signature_hash: string | null
  signed_at: string | null
  created_at: string
  updated_at: string
}

export interface LeaseInsert {
  listing_id: string
  tenant_id: string
  landlord_id: string
  start_date: string
  end_date: string
  monthly_rent: number
  lease_status?: LeaseStatus
}

export interface LeaseUpdate {
  lease_status?: LeaseStatus
  digital_signature_hash?: string | null
  signed_at?: string | null
}

export interface Payment {
  id: string
  lease_id: string
  tenant_id: string
  amount: number
  currency: string
  stripe_payment_intent_id: string | null
  status: PaymentStatus
  created_at: string
}

export interface PaymentInsert {
  lease_id: string
  tenant_id: string
  amount: number
  currency?: string
  stripe_payment_intent_id?: string | null
  status?: PaymentStatus
}

export interface SavedListing {
  tenant_id: string
  listing_id: string
  created_at: string
}

export interface SavedListingInsert {
  tenant_id: string
  listing_id: string
}

// ─── View Types ──────────────────────────────

export interface ActiveListing {
  id: string
  title: string
  description: string | null
  price_monthly: number
  currency: string
  location: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  amenities: string[] | null
  image_urls: string[] | null
  created_at: string
  landlord_name: string
  landlord_avatar: string | null
}

// ─── Supabase Client Type Helper ─────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      listings: {
        Row: Listing
        Insert: ListingInsert
        Update: ListingUpdate
      }
      leases: {
        Row: Lease
        Insert: LeaseInsert
        Update: LeaseUpdate
      }
      payments: {
        Row: Payment
        Insert: PaymentInsert
        Update: never
      }
      saved_listings: {
        Row: SavedListing
        Insert: SavedListingInsert
        Update: never
      }
    }
    Views: {
      active_listings: {
        Row: ActiveListing
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_landlord: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
    }
    Enums: {
      user_role: UserRole
      listing_status: ListingStatus
      lease_status: LeaseStatus
      payment_status: PaymentStatus
    }
  }
}
