-- ============================================
-- APARTMENT RENTAL PLATFORM - DATABASE SCHEMA
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('tenant', 'landlord', 'admin');
CREATE TYPE property_type AS ENUM ('apartment', 'condo', 'house', 'townhouse', 'loft', 'studio');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'pending', 'rented', 'archived');
CREATE TYPE unit_status AS ENUM ('active', 'inactive', 'maintenance', 'renovating');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'withdrawn', 'signed');
CREATE TYPE lease_status AS ENUM ('active', 'expired', 'terminated', 'renewed');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'partial');
CREATE TYPE payment_type AS ENUM ('rent', 'deposit', 'application_fee', 'late_fee', 'pet_fee', 'parking_fee', 'other');
CREATE TYPE maintenance_status AS ENUM ('open', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE maintenance_priority AS ENUM ('low', 'medium', 'high', 'emergency');

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'tenant',
  date_of_birth DATE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  employer TEXT,
  annual_income INTEGER,
  credit_score INTEGER,
  background_check_status TEXT DEFAULT 'not_started',
  background_check_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================
-- PROPERTIES
-- ============================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  neighborhood TEXT,
  walk_score INTEGER,
  transit_score INTEGER,
  bike_score INTEGER,
  status listing_status NOT NULL DEFAULT 'draft',
  amenities JSONB DEFAULT '[]',
  rules JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  virtual_tour_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(city, state, zip_code);
CREATE INDEX idx_properties_type ON properties(property_type);

-- ============================================
-- UNITS
-- ============================================

CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  floor INTEGER,
  bedrooms DECIMAL(3,1) NOT NULL,
  bathrooms DECIMAL(3,1) NOT NULL,
  square_feet INTEGER,
  rent_price INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  available_from DATE NOT NULL,
  status unit_status NOT NULL DEFAULT 'active',
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  floor_plan_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(property_id, unit_number)
);

CREATE INDEX idx_units_property ON units(property_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_price ON units(rent_price);

-- ============================================
-- APPLICATIONS
-- ============================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  move_in_date DATE NOT NULL,
  lease_term_months INTEGER NOT NULL DEFAULT 12,
  monthly_income INTEGER,
  employer TEXT,
  employment_duration_months INTEGER,
  previous_address TEXT,
  previous_landlord_name TEXT,
  previous_landlord_phone TEXT,
  reason_for_moving TEXT,
  pets JSONB DEFAULT '[]',
  vehicles JSONB DEFAULT '[]',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  reference_list JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  background_check_consent BOOLEAN DEFAULT FALSE,
  credit_check_consent BOOLEAN DEFAULT FALSE,
  application_fee_paid BOOLEAN DEFAULT FALSE,
  application_fee_amount INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_unit ON applications(unit_id);
CREATE INDEX idx_applications_applicant ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- LEASES
-- ============================================

CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id),
  status lease_status NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_amount INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL,
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_paid_at TIMESTAMPTZ,
  rent_due_day INTEGER NOT NULL DEFAULT 1,
  late_fee_amount INTEGER DEFAULT 50,
  late_fee_grace_days INTEGER DEFAULT 5,
  auto_renew BOOLEAN DEFAULT FALSE,
  renewal_notice_days INTEGER DEFAULT 60,
  terms TEXT,
  addendums JSONB DEFAULT '[]',
  signed_by_tenant_at TIMESTAMPTZ,
  signed_by_landlord_at TIMESTAMPTZ,
  signed_tenant_ip INET,
  signed_landlord_ip INET,
  terminated_at TIMESTAMPTZ,
  termination_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leases_unit ON leases(unit_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_leases_landlord ON leases(landlord_id);
CREATE INDEX idx_leases_status ON leases(status);
CREATE INDEX idx_leases_dates ON leases(start_date, end_date);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  type payment_type NOT NULL,
  description TEXT,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  transaction_id TEXT,
  payment_method TEXT,
  payment_method_details JSONB,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  refunded_amount INTEGER DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_lease ON payments(lease_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);

-- ============================================
-- MAINTENANCE REQUESTS
-- ============================================

CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority maintenance_priority NOT NULL DEFAULT 'medium',
  status maintenance_status NOT NULL DEFAULT 'open',
  images JSONB DEFAULT '[]',
  preferred_dates JSONB DEFAULT '[]',
  access_instructions TEXT,
  pets_present BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  completion_notes TEXT,
  cost_estimate INTEGER,
  actual_cost INTEGER,
  landlord_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_unit ON maintenance_requests(unit_id);
CREATE INDEX idx_maintenance_tenant ON maintenance_requests(tenant_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);

-- ============================================
-- CONVERSATIONS & MESSAGES
-- ============================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT,
  related_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  related_lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
  related_maintenance_id UUID REFERENCES maintenance_requests(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(participant_1, participant_2, related_unit_id, related_lease_id, related_maintenance_id)
);

CREATE INDEX idx_conversations_p1 ON conversations(participant_1);
CREATE INDEX idx_conversations_p2 ON conversations(participant_2);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
  maintenance_rating INTEGER CHECK (maintenance_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT,
  pros TEXT,
  cons TEXT,
  would_recommend BOOLEAN,
  landlord_response TEXT,
  landlord_responded_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lease_id, reviewer_id)
);

CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating);

-- ============================================
-- FAVORITES
-- ============================================

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, unit_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================
-- DOCUMENTS
-- ============================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  related_type TEXT,
  related_id UUID,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  category TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_related ON documents(related_type, related_id);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - PROFILES
-- ============================================

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Public can view landlord profiles" ON profiles
  FOR SELECT USING (role = 'landlord');

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

-- ============================================
-- RLS POLICIES - PROPERTIES
-- ============================================

CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Landlords can view own properties" ON properties
  FOR SELECT USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can insert own properties" ON properties
  FOR INSERT WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update own properties" ON properties
  FOR UPDATE USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can delete own draft properties" ON properties
  FOR DELETE USING (landlord_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can manage all properties" ON properties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- RLS POLICIES - UNITS
-- ============================================

CREATE POLICY "Anyone can view active units of active properties" ON units
  FOR SELECT USING (
    status = 'active'
    AND EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.status = 'active'
    )
  );

CREATE POLICY "Landlords can view own units" ON units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can insert units for own properties" ON units
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can update own units" ON units
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can delete own units" ON units
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = units.property_id
      AND p.landlord_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - APPLICATIONS
-- ============================================

CREATE POLICY "Applicants can view own applications" ON applications
  FOR SELECT USING (applicant_id = auth.uid());

CREATE POLICY "Landlords can view applications for own units" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = applications.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can create applications" ON applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Landlords can update applications for own units" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = applications.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - LEASES
-- ============================================

CREATE POLICY "Tenants can view own leases" ON leases
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Landlords can view leases for own units" ON leases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = leases.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can create leases for approved applications" ON leases
  FOR INSERT WITH CHECK (
    landlord_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = leases.application_id
      AND a.status = 'approved'
    )
  );

CREATE POLICY "Landlords can update own leases" ON leases
  FOR UPDATE USING (landlord_id = auth.uid());

-- ============================================
-- RLS POLICIES - PAYMENTS
-- ============================================

CREATE POLICY "Payers can view own payments" ON payments
  FOR SELECT USING (payer_id = auth.uid());

CREATE POLICY "Landlords can view payments for own leases" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leases l
      JOIN units u ON l.unit_id = u.id
      JOIN properties p ON u.property_id = p.id
      WHERE l.id = payments.lease_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "System can insert payments" ON payments
  FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS POLICIES - MAINTENANCE REQUESTS
-- ============================================

CREATE POLICY "Tenants can view own requests" ON maintenance_requests
  FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Tenants can create requests" ON maintenance_requests
  FOR INSERT WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Landlords can view requests for own properties" ON maintenance_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = maintenance_requests.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can update requests for own properties" ON maintenance_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN properties p ON u.property_id = p.id
      WHERE u.id = maintenance_requests.unit_id
      AND p.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Assigned staff can update requests" ON maintenance_requests
  FOR UPDATE USING (assigned_to = auth.uid());

-- ============================================
-- RLS POLICIES - CONVERSATIONS
-- ============================================

CREATE POLICY "Participants can view conversations" ON conversations
  FOR SELECT USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

CREATE POLICY "Participants can create conversations" ON conversations
  FOR INSERT WITH CHECK (participant_1 = auth.uid() OR participant_2 = auth.uid());

-- ============================================
-- RLS POLICIES - MESSAGES
-- ============================================

CREATE POLICY "Participants can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1 = auth.uid() OR c.participant_2 = auth.uid())
    )
  );

-- ============================================
-- RLS POLICIES - REVIEWS
-- ============================================

CREATE POLICY "Public can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Tenants can create reviews for completed leases" ON reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM leases l
      WHERE l.id = reviews.lease_id
      AND l.tenant_id = auth.uid()
      AND l.status IN ('active', 'expired', 'terminated')
    )
  );

CREATE POLICY "Reviewers can update own reviews" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid());

CREATE POLICY "Landlords can respond to reviews" ON reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = reviews.property_id
      AND p.landlord_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES - FAVORITES
-- ============================================

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- RLS POLICIES - DOCUMENTS
-- ============================================

CREATE POLICY "Owners can view own documents" ON documents
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can manage own documents" ON documents
  FOR ALL USING (owner_id = auth.uid());

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is landlord
CREATE OR REPLACE FUNCTION is_landlord()
RETURNS BOOLEAN AS $$
  SELECT role = 'landlord' FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT role = 'admin' FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get available units for a property
CREATE OR REPLACE FUNCTION get_available_units(property_uuid UUID)
RETURNS TABLE (
  id UUID,
  unit_number TEXT,
  bedrooms DECIMAL(3,1),
  bathrooms DECIMAL(3,1),
  square_feet INTEGER,
  rent_price INTEGER,
  deposit_amount INTEGER,
  available_from DATE,
  images JSONB
) AS $$
  SELECT u.id, u.unit_number, u.bedrooms, u.bathrooms, u.square_feet,
         u.rent_price, u.deposit_amount, u.available_from, u.images
  FROM units u
  WHERE u.property_id = property_uuid
  AND u.status = 'active'
  AND u.available_from <= CURRENT_DATE
  ORDER BY u.rent_price ASC;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active listings with property info
CREATE VIEW active_listings AS
SELECT
  u.id AS unit_id,
  u.unit_number,
  u.bedrooms,
  u.bathrooms,
  u.square_feet,
  u.rent_price,
  u.deposit_amount,
  u.available_from,
  u.images,
  u.amenities,
  p.id AS property_id,
  p.title AS property_title,
  p.property_type,
  p.address_line1,
  p.city,
  p.state,
  p.zip_code,
  p.neighborhood,
  p.walk_score,
  p.latitude,
  p.longitude,
  pr.full_name AS landlord_name,
  pr.avatar_url AS landlord_avatar
FROM units u
JOIN properties p ON u.property_id = p.id
JOIN profiles pr ON p.landlord_id = pr.id
WHERE u.status = 'active'
AND p.status = 'active'
AND u.available_from <= CURRENT_DATE;

-- Application summary for landlords
CREATE VIEW landlord_application_summary AS
SELECT
  a.id,
  a.status,
  a.submitted_at,
  a.move_in_date,
  ap.full_name AS applicant_name,
  ap.email AS applicant_email,
  ap.phone AS applicant_phone,
  ap.annual_income,
  ap.credit_score,
  u.unit_number,
  u.rent_price,
  p.title AS property_title,
  p.id AS property_id
FROM applications a
JOIN profiles ap ON a.applicant_id = ap.id
JOIN units u ON a.unit_id = u.id
JOIN properties p ON u.property_id = p.id
WHERE p.landlord_id = auth.uid()
ORDER BY a.submitted_at DESC;

-- Lease summary for tenants
CREATE VIEW tenant_lease_summary AS
SELECT
  l.id,
  l.status,
  l.start_date,
  l.end_date,
  l.rent_amount,
  l.deposit_amount,
  l.rent_due_day,
  u.unit_number,
  p.title AS property_title,
  p.address_line1,
  p.city,
  p.state,
  p.zip_code,
  pr.full_name AS landlord_name,
  pr.phone AS landlord_phone,
  pr.email AS landlord_email
FROM leases l
JOIN units u ON l.unit_id = u.id
JOIN properties p ON u.property_id = p.id
JOIN profiles pr ON p.landlord_id = pr.id
WHERE l.tenant_id = auth.uid()
AND l.status = 'active';

-- Payment summary for leases
CREATE VIEW lease_payment_summary AS
SELECT
  l.id AS lease_id,
  COALESCE(SUM(CASE WHEN p.status = 'completed' AND p.type = 'rent' THEN p.amount END), 0) AS total_rent_paid,
  COALESCE(SUM(CASE WHEN p.status = 'completed' AND p.type = 'deposit' THEN p.amount END), 0) AS total_deposit_paid,
  COALESCE(SUM(CASE WHEN p.status = 'pending' AND p.type = 'rent' THEN p.amount END), 0) AS pending_rent,
  MAX(CASE WHEN p.type = 'rent' AND p.status = 'completed' THEN p.paid_at END) AS last_rent_payment,
  COUNT(CASE WHEN p.type = 'rent' AND p.status = 'failed' THEN 1 END) AS failed_payments
FROM leases l
LEFT JOIN payments p ON l.id = p.lease_id
GROUP BY l.id;
