/*
# Add fulfillment status column, updated_at trigger, and admin order update function

## Purpose
This migration adds a separate fulfillment_status column to the orders table
(distinct from payment_status), creates an automatic updated_at trigger,
and adds a SECURITY DEFINER function that allows admins to safely update
order status, payment status, and fulfillment status with validation.

## Changes

### 1. New column: orders.fulfillment_status
- text, NOT NULL, default 'pending'
- Tracks order fulfilment independently of payment status
- Valid values: 'pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'

### 2. New column: orders.notes
- text, nullable
- Internal admin notes on the order (not visible to customers)

### 3. Updated_at trigger
- Automatically sets orders.updated_at to now() on any UPDATE

### 4. SECURITY DEFINER function: update_order_status
- Allows admin to update order status, payment_status, fulfillment_status, and notes
- Validates status values against allowlists to prevent arbitrary values
- Only callable by admins (is_admin() check)
- Returns the updated order row
*/

-- Add fulfillment_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'fulfillment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN fulfillment_status text NOT NULL DEFAULT 'pending';
  END IF;
END $$;

-- Add notes column for admin-internal notes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'notes'
  ) THEN
    ALTER TABLE orders ADD COLUMN notes text;
  END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger if it exists
DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- SECURITY DEFINER function for validated order status updates
CREATE OR REPLACE FUNCTION public.update_order_status(
  p_order_id uuid,
  p_status text DEFAULT NULL,
  p_payment_status text DEFAULT NULL,
  p_fulfillment_status text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  valid_statuses text[] := ARRAY['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  valid_payment text[] := ARRAY['pending', 'paid', 'failed', 'refunded', 'cod'];
  valid_fulfillment text[] := ARRAY['pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];
  updated_order public.orders;
BEGIN
  -- Only admins can update orders
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  -- Validate status if provided
  IF p_status IS NOT NULL AND NOT (p_status = ANY(valid_statuses)) THEN
    RAISE EXCEPTION 'Invalid order status: %', p_status;
  END IF;

  -- Validate payment_status if provided
  IF p_payment_status IS NOT NULL AND NOT (p_payment_status = ANY(valid_payment)) THEN
    RAISE EXCEPTION 'Invalid payment status: %', p_payment_status;
  END IF;

  -- Validate fulfillment_status if provided
  IF p_fulfillment_status IS NOT NULL AND NOT (p_fulfillment_status = ANY(valid_fulfillment)) THEN
    RAISE EXCEPTION 'Invalid fulfillment status: %', p_fulfillment_status;
  END IF;

  -- Build the UPDATE dynamically
  UPDATE public.orders SET
    status = COALESCE(p_status, status),
    payment_status = COALESCE(p_payment_status, payment_status),
    fulfillment_status = COALESCE(p_fulfillment_status, fulfillment_status),
    notes = COALESCE(p_notes, notes)
  WHERE id = p_order_id
  RETURNING * INTO updated_order;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  RETURN updated_order;
END;
$$;

-- Grant execute to authenticated (the function itself checks is_admin)
GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, text, text, text, text) TO authenticated;
