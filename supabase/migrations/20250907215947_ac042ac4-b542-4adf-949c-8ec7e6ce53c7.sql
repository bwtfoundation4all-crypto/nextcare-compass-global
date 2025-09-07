-- Consultation Requests RLS hardening
-- Restrict read access to authenticated users for their own requests only (by email from JWT)
DROP POLICY IF EXISTS "Users can view their consultation requests" ON public.consultation_requests;

CREATE POLICY "Users can view their own consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email'));

-- Keep public ability to submit requests (no change to existing INSERT policy)
-- Optionally, explicitly scope it to anon + authenticated for clarity
DROP POLICY IF EXISTS "Anyone can create consultation requests" ON public.consultation_requests;
CREATE POLICY "Anyone can create consultation requests"
ON public.consultation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
