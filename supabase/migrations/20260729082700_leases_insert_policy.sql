-- ============================================
-- Migration 0002: Leases INSERT RLS Policy
-- ============================================

-- Landlords can create leases for their own listings
CREATE POLICY "Landlords can insert leases" ON leases
  FOR INSERT TO authenticated
  WITH CHECK (
    landlord_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM listings
      WHERE id = listing_id
      AND landlord_id = auth.uid()
    )
  );
