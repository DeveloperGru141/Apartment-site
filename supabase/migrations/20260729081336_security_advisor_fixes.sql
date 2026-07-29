-- ============================================
-- Migration 0001: Security Advisor Fixes
-- ============================================

-- 1. DROP unused SECURITY DEFINER functions (dead code + attack surface)
DROP FUNCTION IF EXISTS public.is_landlord();
DROP FUNCTION IF EXISTS public.get_user_role();

-- 2. Revoke PUBLIC/anon access on remaining helper, grant only to authenticated
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3. Drop unused extension
DROP EXTENSION IF EXISTS "pgcrypto";

-- 4. Add explicit TO authenticated clause to all auth-dependent policies
--    (prevents anon users from even evaluating these policies)

-- PROFILES
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL TO authenticated
  USING (public.is_admin());

-- LISTINGS
DROP POLICY IF EXISTS "Landlords can view own listings" ON listings;
CREATE POLICY "Landlords can view own listings" ON listings
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can insert listings" ON listings;
CREATE POLICY "Landlords can insert listings" ON listings
  FOR INSERT TO authenticated
  WITH CHECK (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can update own listings" ON listings;
CREATE POLICY "Landlords can update own listings" ON listings
  FOR UPDATE TO authenticated
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can delete own listings" ON listings;
CREATE POLICY "Landlords can delete own listings" ON listings
  FOR DELETE TO authenticated
  USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
CREATE POLICY "Admins can manage all listings" ON listings
  FOR ALL TO authenticated
  USING (public.is_admin());

-- LEASES
DROP POLICY IF EXISTS "Tenants can view own leases" ON leases;
CREATE POLICY "Tenants can view own leases" ON leases
  FOR SELECT TO authenticated
  USING (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can view own leases" ON leases;
CREATE POLICY "Landlords can view own leases" ON leases
  FOR SELECT TO authenticated
  USING (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can update own leases" ON leases;
CREATE POLICY "Landlords can update own leases" ON leases
  FOR UPDATE TO authenticated
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all leases" ON leases;
CREATE POLICY "Admins can manage all leases" ON leases
  FOR ALL TO authenticated
  USING (public.is_admin());

-- PAYMENTS
DROP POLICY IF EXISTS "Tenants can view own payments" ON payments;
CREATE POLICY "Tenants can view own payments" ON payments
  FOR SELECT TO authenticated
  USING (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can view payments on own listings" ON payments;
CREATE POLICY "Landlords can view payments on own listings" ON payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leases l
      JOIN listings p ON l.listing_id = p.id
      WHERE l.id = payments.lease_id
      AND p.landlord_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- SAVED LISTINGS
DROP POLICY IF EXISTS "Users can view own saved listings" ON saved_listings;
CREATE POLICY "Users can view own saved listings" ON saved_listings
  FOR SELECT TO authenticated
  USING (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users can save listings" ON saved_listings;
CREATE POLICY "Users can save listings" ON saved_listings
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users can remove own saved listings" ON saved_listings;
CREATE POLICY "Users can remove own saved listings" ON saved_listings
  FOR DELETE TO authenticated
  USING (tenant_id = auth.uid());

-- 5. Keep "Public can view landlord profiles" as TO PUBLIC (intentional for unauthenticated browsing)
--    No change needed.
