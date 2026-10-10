/*
# Revoke PUBLIC EXECUTE on security-critical functions

## Purpose
The previous migration revoked EXECUTE from `anon` directly, but Postgres
grants EXECUTE to `PUBLIC` by default when a function is created. Since `anon`
inherits from `PUBLIC`, the revocation had no effect. This migration:

1. REVOKE EXECUTE FROM PUBLIC on both `is_admin()` and `update_order_status()`
2. RE-GRANT EXECUTE to `authenticated` only (so logged-in admins can call them)

## Security Impact
- After this change, unauthenticated (anon) users cannot call these functions
  via the REST API (`/rest/v1/rpc/...`).
- `is_admin()` still works inside RLS policy evaluation because policies run
  with the invoker's privileges and the function itself uses SECURITY DEFINER
  to read the admin_profiles table.
- `update_order_status()` is only callable by authenticated users. The function
  body additionally checks `is_admin()` and rejects non-admins.
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.update_order_status(uuid, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, text, text, text, text) TO authenticated;
