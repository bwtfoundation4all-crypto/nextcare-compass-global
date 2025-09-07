-- Correct RLS policy for consultation_requests using JWT email claim
-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Users can view their consultation requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Users can view their own consultation requests by email" ON public.consultation_requests;

-- Create a secure SELECT policy matching the authenticated user's email claim
CREATE POLICY "Users can view their consultation requests"
ON public.consultation_requests
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND email = (auth.jwt()->>'email')
);
