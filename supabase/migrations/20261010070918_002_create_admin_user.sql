/*
# Create initial admin user

## Purpose
Creates the first administrator account so the admin dashboard can be accessed.
This creates an auth user with a known password and links it to the admin_profiles table.

## Changes
1. Inserts a new row into auth.users with email admin@handmadebybhumi.com
2. Inserts a corresponding row into admin_profiles with is_admin = true
3. Uses a cryptographically hashed password

## Security
- The password is hashed using crypt() with bf (blowfish) algorithm
- The admin_profiles row references the auth.users id via foreign key
- RLS policies on admin_profiles only allow self-read and admin-read
- The is_admin() SECURITY DEFINER function checks this table

## Important Notes
1. The password for this admin account is: BhumiAdmin2026!
2. The user should change this password after first login (via Supabase dashboard)
3. This migration is idempotent - it checks if the user already exists before creating
*/

DO $$
DECLARE
  admin_id uuid;
  admin_email text := 'admin@handmadebybhumi.com';
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;
  
  IF admin_id IS NULL THEN
    -- Create the auth user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_sso_user
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      admin_email,
      crypt('BhumiAdmin2026!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{}'::jsonb,
      '{}'::jsonb,
      false
    )
    RETURNING id INTO admin_id;
  END IF;
  
  -- Check if admin_profile already exists
  IF NOT EXISTS (SELECT 1 FROM admin_profiles WHERE id = admin_id) THEN
    INSERT INTO admin_profiles (id, email, is_admin)
    VALUES (admin_id, admin_email, true);
  END IF;
END
$$;
