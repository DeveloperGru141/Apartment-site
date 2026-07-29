-- ============================================
-- HORIZON — Luxury Apartment Platform
-- Migration 0000: Initial Schema & RLS Lockdown
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('tenant', 'landlord', 'admin');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'rented', 'archived');
CREATE TYPE lease_status AS ENUM ('pending', 'active', 'terminated', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- ============================================
-- TABLES
-- ============================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'tenant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- 2. LISTINGS
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  location TEXT,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms NUMERIC(3,1) NOT NULL DEFAULT 0,
  sqft INTEGER,
  amenities TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  status listing_status NOT NULL DEFAULT 'draft',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listings_landlord ON listings(landlord_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_price ON listings(price_monthly);

-- 3. LEASES
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent NUMERIC(10,2) NOT NULL,
  lease_status lease_status NOT NULL DEFAULT 'pending',
  digital_signature_hash TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leases_listing ON leases(listing_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_leases_landlord ON leases(landlord_id);
CREATE INDEX idx_leases_status ON leases(lease_status);

-- 4. PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT UNIQUE,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_lease ON payments(lease_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);

-- 5. SAVED LISTINGS (Favorites)
CREATE TABLE saved_listings (
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, listing_id)
);

CREATE INDEX idx_saved_listings_tenant ON saved_listings(tenant_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_landlord()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role = 'landlord' FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- ============================================
-- RLS POLICIES — PROFILES
-- ============================================

CREATE POLICY "Public can view landlord profiles" ON profiles
  FOR SELECT USING (
    role = 'landlord'
    OR id = auth.uid()
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES — LISTINGS
-- ============================================

CREATE POLICY "Public can view active listings" ON listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Landlords can view own listings" ON listings
  FOR SELECT USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can insert listings" ON listings
  FOR INSERT WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update own listings" ON listings
  FOR UPDATE USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can delete own listings" ON listings
  FOR DELETE USING (landlord_id = auth.uid());

CREATE POLICY "Admins can manage all listings" ON listings
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES — LEASES
-- ============================================

CREATE POLICY "Tenants can view own leases" ON leases
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Landlords can view own leases" ON leases
  FOR SELECT USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can update own leases" ON leases
  FOR UPDATE USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Admins can manage all leases" ON leases
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES — PAYMENTS
-- ============================================

-- Tenants can view their own payments
CREATE POLICY "Tenants can view own payments" ON payments
  FOR SELECT USING (tenant_id = auth.uid());

-- Landlords can view payments on their listings
CREATE POLICY "Landlords can view payments on own listings" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leases l
      JOIN listings p ON l.listing_id = p.id
      WHERE l.id = payments.lease_id
      AND p.landlord_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (public.is_admin());

-- No INSERT/UPDATE/DELETE policies exist for public or authenticated roles.
-- Payments are created server-side via Stripe webhooks (service_role key).

-- ============================================
-- RLS POLICIES — SAVED LISTINGS
-- ============================================

CREATE POLICY "Users can view own saved listings" ON saved_listings
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Users can save listings" ON saved_listings
  FOR INSERT WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users can remove own saved listings" ON saved_listings
  FOR DELETE USING (tenant_id = auth.uid());

-- ============================================
-- TRIGGER: auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path TO 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::user_role,
      'tenant'::user_role
    )
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- TRIGGER: prevent role escalation via API
-- ============================================

CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path TO 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Role cannot be changed via standard API';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_profile_role_change BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION prevent_role_change();

-- ============================================
-- TRIGGER: prevent landlords from self-verifying listings
-- ============================================

CREATE OR REPLACE FUNCTION prevent_self_verify()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path TO 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only administrators can verify listings';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_listing_self_verify BEFORE UPDATE ON listings
  FOR EACH ROW
  WHEN (OLD.is_verified IS DISTINCT FROM NEW.is_verified)
  EXECUTE FUNCTION prevent_self_verify();

-- ============================================
-- TRIGGER: prevent signature tampering on leases
-- ============================================

CREATE OR REPLACE FUNCTION prevent_signature_tampering()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path TO 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.digital_signature_hash IS NOT NULL THEN
    IF NEW.digital_signature_hash IS DISTINCT FROM OLD.digital_signature_hash
       OR NEW.signed_at IS DISTINCT FROM OLD.signed_at THEN
      RAISE EXCEPTION 'Signature fields cannot be modified once set';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_lease_signature_tampering BEFORE UPDATE ON leases
  FOR EACH ROW
  WHEN (
    OLD.digital_signature_hash IS DISTINCT FROM NEW.digital_signature_hash
    OR OLD.signed_at IS DISTINCT FROM NEW.signed_at
  )
  EXECUTE FUNCTION prevent_signature_tampering();

-- ============================================
-- VIEW: active listings with landlord info
-- ============================================

CREATE VIEW active_listings WITH (security_invoker = true) AS
SELECT
  l.id,
  l.title,
  l.description,
  l.price_monthly,
  l.currency,
  l.location,
  l.bedrooms,
  l.bathrooms,
  l.sqft,
  l.amenities,
  l.image_urls,
  l.created_at,
  p.full_name AS landlord_name,
  p.avatar_url AS landlord_avatar
FROM listings l
JOIN profiles p ON l.landlord_id = p.id
WHERE l.status = 'active';

-- ============================================
-- REVOKE EXECUTE on trigger-only functions
-- ============================================

REVOKE EXECUTE ON FUNCTION handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION prevent_role_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION prevent_self_verify() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION prevent_signature_tampering() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION update_updated_at_column() FROM PUBLIC, anon, authenticated;
