/*
# Fix Security Advisor Findings

## Purpose
Addresses 8 security linter warnings:
1. Revoke EXECUTE on `is_admin()` from anon role (it still works inside RLS policies, just not callable directly by unauthenticated users via RPC)
2. Revoke EXECUTE on `update_order_status` from anon role (critical: prevents unauthenticated users from updating orders)
3. Set search_path on `generate_order_number`, `set_order_number`, `update_updated_at`, `set_updated_at` functions

## Security Changes
- `is_admin()`: Revoke EXECUTE from anon. Keep EXECUTE on authenticated (needed for RLS policy evaluation).
- `update_order_status()`: Revoke EXECUTE from anon. Keep on authenticated only.
- All trigger/helper functions get `SET search_path = public` to prevent search_path injection.
*/

-- 1. Revoke EXECUTE on is_admin from anon (it's still usable inside RLS policies)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;

-- 2. Revoke EXECUTE on update_order_status from anon (critical security fix)
REVOKE EXECUTE ON FUNCTION public.update_order_status(uuid, text, text, text, text) FROM anon;

-- 3. Fix search_path on helper functions
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE sql
SET search_path = public
AS $$
  SELECT 'HBB-' || EXTRACT(YEAR FROM now())::text || '-' || LPAD(nextval('order_number_seq')::text, 5, '0');
$$;

CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.order_number := public.generate_order_number();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
