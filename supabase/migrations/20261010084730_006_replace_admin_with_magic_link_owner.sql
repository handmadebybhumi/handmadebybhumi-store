/*
# Replace placeholder admin with real store owner (magic-link auth)

## Purpose
1. Removes the placeholder admin user admin@handmadebybhumi.com (which used a
   hardcoded password committed in a migration file).
2. Sets up a trigger so that when the real owner (handmadebybhumi@gmail.com)
   signs in via magic link for the first time, the admin_profiles row is
   created automatically — no manual database step needed.
3. No password is set or stored anywhere. Auth is passwordless via Supabase
   magic link (email OTP link).

## Security
- The old auth.users row for admin@handmadebybhumi.com is deleted, which
  cascades to its admin_profiles row via FK ON DELETE CASCADE.
- A trigger on auth.users INSERT checks if the new user's email is the
  authorized owner email and, if so, inserts an admin_profiles row with
  is_admin = true. Only this one email is recognized.
- No passwords are stored or referenced anywhere.
- is_admin() SECURITY DEFINER function checks admin_profiles table.

## Manual step required
The site owner must sign in once at /AdminLogin with handmadebybhumi@gmail.com.
Supabase will send a magic-link email. Clicking it creates the auth session
and the trigger creates the admin profile automatically.
*/

-- 1. Delete the old placeholder admin auth user (cascades to admin_profiles)
DELETE FROM auth.users WHERE email = 'admin@handmadebybhumi.com';

-- 2. Clean up any orphaned admin_profiles rows
DELETE FROM admin_profiles WHERE email = 'admin@handmadebybhumi.com';

-- 3. Trigger: when a new auth.users row is created (via magic link sign-in),
--    if the email is the authorized owner, create the admin_profiles row.
CREATE OR REPLACE FUNCTION public.create_admin_profile_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'handmadebybhumi@gmail.com' THEN
    INSERT INTO admin_profiles (id, email, is_admin)
    VALUES (NEW.id, NEW.email, true)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_admin_profile_on_auth_user ON auth.users;
CREATE TRIGGER create_admin_profile_on_auth_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_profile_on_signup();
