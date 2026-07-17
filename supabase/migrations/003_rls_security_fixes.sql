-- Migration 003: RLS and security fixes
-- Adds security_invoker to views, sets search_path on functions,
-- revokes EXECUTE from anon/authenticated on trigger-only functions

-- 1. Enable security_invoker on all views so they respect RLS
ALTER VIEW public.active_listings SET (security_invoker = true);
ALTER VIEW public.landlord_application_summary SET (security_invoker = true);
ALTER VIEW public.tenant_lease_summary SET (security_invoker = true);
ALTER VIEW public.lease_payment_summary SET (security_invoker = true);

-- 2. Fix mutable search_path on trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 3. Fix mutable search_path on SECURITY DEFINER helper functions
CREATE OR REPLACE FUNCTION public.get_available_units(property_uuid uuid)
 RETURNS TABLE(id uuid, unit_number text, bedrooms numeric, bathrooms numeric, square_feet integer, rent_price integer, deposit_amount integer, available_from date, images jsonb)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT u.id, u.unit_number, u.bedrooms, u.bathrooms, u.square_feet,
         u.rent_price, u.deposit_amount, u.available_from, u.images
  FROM units u
  WHERE u.property_id = property_uuid
  AND u.status = 'active'
  AND u.available_from <= CURRENT_DATE
  ORDER BY u.rent_price ASC;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$function$;

CREATE OR REPLACE FUNCTION public.is_landlord()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role = 'landlord' FROM profiles WHERE id = auth.uid();
$function$;

-- 4. Revoke EXECUTE from PUBLIC for functions that should not be callable via REST API
REVOKE EXECUTE ON FUNCTION public.get_available_units(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- 5. Revoke EXECUTE directly from anon and authenticated roles for trigger-only functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;