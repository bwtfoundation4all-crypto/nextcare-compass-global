-- Fix security vulnerabilities that we have permission to modify

-- 1. Enhance consultation_requests security by removing public insert access
-- Drop the existing public policy that allows anyone to create requests
DROP POLICY IF EXISTS "Anyone can create consultation requests" ON public.consultation_requests;

-- Create new policy that only allows authenticated users to create consultation requests
CREATE POLICY "Authenticated users can create consultation requests"
ON public.consultation_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update the existing SELECT policy to be more secure
DROP POLICY IF EXISTS "Users can view their own consultation requests" ON public.consultation_requests;

-- Create improved SELECT policy
CREATE POLICY "Users can view their own consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (
  email = (auth.jwt() ->> 'email'::text) OR 
  has_role(auth.uid(), 'admin'::app_role)
);