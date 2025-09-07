-- Ensure RLS is explicitly restrictive for writes on payments while preserving existing SELECT policy
-- This keeps edge functions with the service role unaffected (they bypass RLS)

-- Make sure RLS is enabled (no-op if already enabled)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create explicit deny policies for INSERT, UPDATE, DELETE
DO $$
BEGIN
  -- Deny INSERTs from client contexts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'deny_insert_payments'
  ) THEN
    EXECUTE 'CREATE POLICY "deny_insert_payments" ON public.payments
      FOR INSERT
      WITH CHECK (false);';
  END IF;

  -- Deny UPDATEs from client contexts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'deny_update_payments'
  ) THEN
    EXECUTE 'CREATE POLICY "deny_update_payments" ON public.payments
      FOR UPDATE
      USING (false)
      WITH CHECK (false);';
  END IF;

  -- Deny DELETEs from client contexts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'deny_delete_payments'
  ) THEN
    EXECUTE 'CREATE POLICY "deny_delete_payments" ON public.payments
      FOR DELETE
      USING (false);';
  END IF;
END $$;