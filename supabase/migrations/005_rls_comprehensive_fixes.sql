-- Migration 005: Comprehensive RLS policy fixes
-- 
-- Issues fixed:
--   1. profiles: missing INSERT policy (callback edge case)
--   2. properties: UPDATE missing WITH CHECK (landlord could reassign)
--   3. units: UPDATE missing WITH CHECK (landlord could reassign property)
--   4. applications: tenants can't withdraw their own applications
--   5. applications: UPDATE missing WITH CHECK for landlords
--   6. leases: UPDATE missing WITH CHECK for landlords
--   7. maintenance_requests: tenants can't cancel their own requests
--   8. maintenance_requests: UPDATE missing WITH CHECK for landlords
--   9. favorites: refactor FOR ALL into explicit SELECT/INSERT/DELETE policies
--  10. Cross-table: admins need ALL access on every table
--  11. profiles: admins need UPDATE/DELETE on any profile

-- ============================================
-- 1. PROFILES — add INSERT + admin overrides
-- ============================================

-- Allow authenticated user to insert their own profile (callback fallback)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Admin can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (public.is_admin());

-- Admin can delete any profile
CREATE POLICY "Admins can delete any profile" ON profiles
  FOR DELETE USING (public.is_admin());

-- ============================================
-- 2. PROPERTIES — add WITH CHECK to UPDATE
-- ============================================

DROP POLICY IF EXISTS "Landlords can update own properties" ON properties;

CREATE POLICY "Landlords can update own properties" ON properties
  FOR UPDATE USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- Admin overrides
DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;

CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 3. UNITS — add WITH CHECK to UPDATE
-- ============================================

DROP POLICY IF EXISTS "Landlords can update own units" ON units;

CREATE POLICY "Landlords can update own units" ON units
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.landlord_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.landlord_id = auth.uid()
    )
  );

-- Admin overrides
CREATE POLICY "Admins can manage all units" ON units
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 4. APPLICATIONS — tenant withdraw + WITH CHECK
-- ============================================

-- Tenant can withdraw their own pending applications
CREATE POLICY "Applicants can withdraw own applications" ON applications
  FOR UPDATE USING (applicant_id = auth.uid() AND status = 'pending')
  WITH CHECK (applicant_id = auth.uid() AND status = 'withdrawn');

DROP POLICY IF EXISTS "Landlords can update applications for own units" ON applications;

CREATE POLICY "Landlords can update applications for own units" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = applications.unit_id
      AND p.landlord_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = applications.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

-- Admin overrides
CREATE POLICY "Admins can manage all applications" ON applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. LEASES — add WITH CHECK to UPDATE
-- ============================================

DROP POLICY IF EXISTS "Landlords can update own leases" ON leases;

CREATE POLICY "Landlords can update own leases" ON leases
  FOR UPDATE USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- Admin overrides
CREATE POLICY "Admins can manage all leases" ON leases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 6. PAYMENTS — admin override
-- ============================================

CREATE POLICY "Admins can manage all payments" ON payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 7. MAINTENANCE REQUESTS — tenant cancel + WITH CHECK
-- ============================================

-- Tenant can cancel their own open requests
CREATE POLICY "Tenants can cancel own requests" ON maintenance_requests
  FOR UPDATE USING (tenant_id = auth.uid() AND status = 'open')
  WITH CHECK (tenant_id = auth.uid() AND status = 'cancelled');

DROP POLICY IF EXISTS "Landlords can update requests for own properties" ON maintenance_requests;

CREATE POLICY "Landlords can update requests for own properties" ON maintenance_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = maintenance_requests.unit_id
      AND p.landlord_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = maintenance_requests.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

-- Admin overrides
CREATE POLICY "Admins can manage all maintenance requests" ON maintenance_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 8. CONVERSATIONS — admin override
-- ============================================

CREATE POLICY "Admins can manage all conversations" ON conversations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 9. MESSAGES — admin override
-- ============================================

CREATE POLICY "Admins can manage all messages" ON messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 10. REVIEWS — admin override + WITH CHECK fix
-- ============================================

DROP POLICY IF EXISTS "Reviewers can update own reviews" ON reviews;

CREATE POLICY "Reviewers can update own reviews" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

DROP POLICY IF EXISTS "Landlords can respond to reviews" ON reviews;

CREATE POLICY "Landlords can respond to reviews" ON reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = reviews.property_id
      AND p.landlord_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = reviews.property_id
      AND p.landlord_id = auth.uid()
    )
  );

-- Admin overrides
CREATE POLICY "Admins can manage all reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 11. FAVORITES — explicit policies instead of FOR ALL
-- ============================================

DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (user_id = auth.uid());

-- Admin overrides
CREATE POLICY "Admins can manage all favorites" ON favorites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 12. NOTIFICATIONS — admin override
-- ============================================

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 13. DOCUMENTS — admin override
-- ============================================

CREATE POLICY "Admins can manage all documents" ON documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );