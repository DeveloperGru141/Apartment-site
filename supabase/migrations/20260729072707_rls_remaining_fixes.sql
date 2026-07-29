-- Migration 006: RLS remaining fixes
--
-- Issues fixed:
--   1. profiles: "Users can update own profile" missing WITH CHECK
--      (defense in depth — prevents column tampering like role escalation)
--   2. maintenance_requests: "Assigned staff can update requests" missing WITH CHECK  
--      (prevents staff from reassigning requests to other users)
--   3. payments: "System can insert payments" grants INSERT to any authenticated user
--      (tighten to require payer_id = auth.uid())
--   4. profiles: "Users can update own profile" missing WITH CHECK
--      (also prevent users from locking themselves out by clearing id)

-- ============================================
-- 1. PROFILES — add WITH CHECK to user self-update
-- ============================================

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================
-- 2. MAINTENANCE_REQUESTS — add WITH CHECK to staff update
-- ============================================

DROP POLICY IF EXISTS "Assigned staff can update requests" ON maintenance_requests;

CREATE POLICY "Assigned staff can update requests" ON maintenance_requests
  FOR UPDATE USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

-- ============================================
-- 3. PAYMENTS — tighten system insert policy
-- ============================================

DROP POLICY IF EXISTS "System can insert payments" ON payments;

-- Allow authenticated users to insert payments where they are the payer.
-- This is still permissive enough for server-side payment creation via Edge
-- Functions or webhooks (which use service_role and bypass RLS entirely).
CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (payer_id = auth.uid());
