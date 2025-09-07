-- Tighten RLS on payments: remove overly permissive ALL policy
DO $$
BEGIN
  -- Drop the insecure catch-all policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'Service can manage payments'
  ) THEN
    EXECUTE 'DROP POLICY "Service can manage payments" ON public.payments;';
  END IF;
END $$;

-- NOTE: We intentionally do NOT add INSERT/UPDATE/DELETE policies for clients.
-- Trusted Edge Functions use the Service Role key and bypass RLS for writes.
-- Existing policy allowing users to view their own payments remains in place.