-- ============================================
-- HORIZON — Agent-Connection Platform
-- Migration 0003: Seller properties + auth pivot
--
-- NOTE: Rewritten for the LIVE project schema, which differs from the
-- repo's original 0000/0001/0002 migrations (they were never applied to
-- this project). The live DB carries a further-evolved rental-portal
-- schema (units, applications, messages, conversations, documents,
-- favorites, maintenance_requests, notifications, reviews, leases,
-- payments, old properties) — all empty. This migration drops the entire
-- abandoned portal direction and rebuilds the seller-properties model.
-- ============================================

-- ============================================
-- Drop the abandoned tenant-portal tables
-- (destructive: all were verified empty before running)
-- ============================================
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS leases CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- ============================================
-- Drop the abandoned portal enums (old property_type
-- has values apartment/condo/house/... that clash with
-- the new enum of the same name)
-- ============================================
DROP TYPE IF EXISTS application_status;
DROP TYPE IF EXISTS lease_status;
DROP TYPE IF EXISTS listing_status;
DROP TYPE IF EXISTS maintenance_priority;
DROP TYPE IF EXISTS maintenance_status;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS payment_type;
DROP TYPE IF EXISTS unit_status;
DROP TYPE IF EXISTS property_type;

-- ============================================
-- Drop dead portal-era SECURITY DEFINER helpers
-- (their tables are gone; they're attack surface now; also they depend
-- on the old user_role type, so they must go before the type pivot)
-- ============================================
DROP FUNCTION IF EXISTS get_available_units(uuid);
DROP FUNCTION IF EXISTS get_user_role();
DROP FUNCTION IF EXISTS is_landlord();
DROP EVENT TRIGGER IF EXISTS ensure_rls;
DROP FUNCTION IF EXISTS rls_auto_enable();

-- ============================================
-- Update profiles.role: tenant/landlord/admin -> seller/admin
-- (the old landlord policy must be dropped first: Postgres refuses to
-- change a column's type while a policy definition references it)
-- ============================================
DROP POLICY IF EXISTS "Public can view landlord profiles" ON profiles;

ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('seller', 'admin');
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE profiles
  ALTER COLUMN role TYPE user_role
  USING (CASE WHEN role::text = 'admin' THEN 'admin' ELSE 'seller' END)::user_role;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'seller';
DROP TYPE user_role_old;

-- ============================================
-- New enums for the property schema
-- ============================================
CREATE TYPE property_status AS ENUM ('For Rent', 'For Sale', 'Off-Plan', 'Land');
CREATE TYPE property_type AS ENUM (
  'Apartment', 'Maisonette', 'Penthouse', 'Townhouse', 'Terrace',
  'Detached Duplex', 'Semi-Detached', 'Detached Bungalow',
  'Residential Land', 'Commercial Land', 'Industrial Land',
  'Mixed-Use Land', 'Commercial'
);
CREATE TYPE property_category AS ENUM ('rental', 'off-plan', 'commercial', 'land', 'resale');
CREATE TYPE publish_status AS ENUM ('live', 'pending', 'archived');

-- ============================================
-- PROPERTIES
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,  -- loose reference to src/lib/data/agents.ts, not a DB FK
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  location TEXT NOT NULL,
  status property_status NOT NULL,
  property_type property_type NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms NUMERIC(3,1) NOT NULL DEFAULT 0,
  sqft INTEGER,
  price NUMERIC(14,2) NOT NULL,
  price_label TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  category property_category NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  publish_status publish_status NOT NULL DEFAULT 'live',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_seller ON properties(seller_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX idx_properties_publish_status ON properties(publish_status);
CREATE INDEX idx_properties_price ON properties(price);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view live properties" ON properties
  FOR SELECT TO public
  USING (publish_status = 'live');

CREATE POLICY "Sellers can view own properties" ON properties
  FOR SELECT TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert own properties" ON properties
  FOR INSERT TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update own properties" ON properties
  FOR UPDATE TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own properties" ON properties
  FOR DELETE TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL TO authenticated
  USING (public.is_admin());

-- ============================================
-- Trigger function: harden the shared updated_at trigger
-- (live copy was NOT security definer; align with repo convention:
-- SECURITY DEFINER + pinned search_path + EXECUTE revoked)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION update_updated_at_column() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER properties_set_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICY FIXUPS ON PROFILES (pivot fallout)
-- ============================================

-- handle_new_user() defaulted role to 'tenant', which no longer exists in
-- user_role after the pivot. Without this, every new signup would fail on
-- the trigger's enum cast and never create a profile row.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path TO 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::user_role,
      'seller'::user_role
    )
  );
  RETURN NEW;
END;
$$;

-- The public-view policy referenced role = 'landlord', which no longer
-- exists. Sellers are the new public-facing role, so scope it to them.
CREATE POLICY "Public can view seller profiles" ON profiles
  FOR SELECT TO public
  USING (
    role = 'seller'
    OR id = auth.uid()
  );

-- ============================================
-- STORAGE: property-images bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view property images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'property-images');

CREATE POLICY "Sellers can upload own property images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Sellers can delete own property images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );