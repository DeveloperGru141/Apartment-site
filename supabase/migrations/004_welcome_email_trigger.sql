-- Migration 004: Add welcome email invocation to handle_new_user trigger
-- Requires pg_net extension (installed separately)
-- Requires RESEND_API_KEY secret set on the Supabase project for email delivery

-- Update the handle_new_user trigger to call the send-welcome-email Edge Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  profile_role user_role;
  user_email text;
  user_name text;
BEGIN
  user_email := COALESCE(NEW.email, '');
  user_name := NEW.raw_user_meta_data ->> 'full_name';
  profile_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'tenant'::user_role);

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, user_email, user_name, profile_role);

  PERFORM
    net.http_post(
      url := 'https://vfftpuqtdhkpfeiourat.functions.supabase.co/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'email', user_email,
        'full_name', user_name
      ),
      timeout_milliseconds := 5000
    );

  RETURN NEW;
END;
$function$;