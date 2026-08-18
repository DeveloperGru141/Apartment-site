// NOTE: Hand-authored to match supabase/migrations/20260818090000_seller_properties.sql
// while the Supabase project is paused. Regenerate once the project is live:
//   supabase gen types typescript --project-id <ref> --schema public > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employer: string | null
          annual_income: number | null
          credit_score: number | null
          background_check_status: string | null
          background_check_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employer?: string | null
          annual_income?: number | null
          credit_score?: number | null
          background_check_status?: string | null
          background_check_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employer?: string | null
          annual_income?: number | null
          credit_score?: number | null
          background_check_status?: string | null
          background_check_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      properties: {
        Row: {
          id: string
          seller_id: string
          agent_id: string
          slug: string
          title: string
          description: string
          neighborhood: string
          location: string
          status: Database["public"]["Enums"]["property_status"]
          property_type: Database["public"]["Enums"]["property_type"]
          bedrooms: number
          bathrooms: number
          sqft: number | null
          price: number
          price_label: string
          images: string[]
          category: Database["public"]["Enums"]["property_category"]
          featured: boolean
          publish_status: Database["public"]["Enums"]["publish_status"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          agent_id: string
          slug: string
          title: string
          description: string
          neighborhood: string
          location: string
          status: Database["public"]["Enums"]["property_status"]
          property_type: Database["public"]["Enums"]["property_type"]
          bedrooms?: number
          bathrooms?: number
          sqft?: number | null
          price: number
          price_label: string
          images?: string[]
          category: Database["public"]["Enums"]["property_category"]
          featured?: boolean
          publish_status?: Database["public"]["Enums"]["publish_status"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          agent_id?: string
          slug?: string
          title?: string
          description?: string
          neighborhood?: string
          location?: string
          status?: Database["public"]["Enums"]["property_status"]
          property_type?: Database["public"]["Enums"]["property_type"]
          bedrooms?: number
          bathrooms?: number
          sqft?: number | null
          price?: number
          price_label?: string
          images?: string[]
          category?: Database["public"]["Enums"]["property_category"]
          featured?: boolean
          publish_status?: Database["public"]["Enums"]["publish_status"]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "seller" | "admin"
      property_status: "For Rent" | "For Sale" | "Off-Plan" | "Land"
      property_type:
        | "Apartment"
        | "Maisonette"
        | "Penthouse"
        | "Townhouse"
        | "Terrace"
        | "Detached Duplex"
        | "Semi-Detached"
        | "Detached Bungalow"
        | "Residential Land"
        | "Commercial Land"
        | "Industrial Land"
        | "Mixed-Use Land"
        | "Commercial"
      property_category: "rental" | "off-plan" | "commercial" | "land" | "resale"
      publish_status: "live" | "pending" | "archived"
    }
    CompositeTypes: Record<string, never>
  }
}

type DefaultUser = Record<string, unknown>

type AuthTables = {
  users: {
    Row: {
      id: string
      email: string | null
      created_at: string
      updated_at: string
      raw_user_meta_data: DefaultUser
      [key: string]: unknown
    }
    Insert: Record<string, unknown>
    Update: Record<string, unknown>
    Relationships: []
  }
}

export type Tables<T extends keyof (Database["public"]["Tables"] & AuthTables)> = (Database["public"]["Tables"] & AuthTables)[T]["Row"]

export type TablesInsert<T extends keyof (Database["public"]["Tables"] & AuthTables)> = (Database["public"]["Tables"] & AuthTables)[T]["Insert"]

export type TablesUpdate<T extends keyof (Database["public"]["Tables"] & AuthTables)> = (Database["public"]["Tables"] & AuthTables)[T]["Update"]

export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]