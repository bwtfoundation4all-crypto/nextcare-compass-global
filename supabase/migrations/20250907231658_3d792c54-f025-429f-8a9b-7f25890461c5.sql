-- Fix RLS policies for consultation_requests table
-- Enable RLS if not already enabled
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create consultation requests" ON public.consultation_requests;
DROP POLICY IF EXISTS "Users can view their own consultation requests" ON public.consultation_requests;

-- Create secure policies for consultation requests
-- Allow anonymous and authenticated users to insert consultation requests
CREATE POLICY "Anyone can create consultation requests"
ON public.consultation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only allow authenticated users to view their own consultation requests (by email)
CREATE POLICY "Authenticated users can view their own consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email'));

-- Create admin policy for viewing all consultation requests
-- This assumes you have an admin role or specific admin table
CREATE POLICY "Service role can view all consultation requests"
ON public.consultation_requests
FOR ALL
TO service_role
USING (true);

-- Ensure proper permissions for updating and deleting
CREATE POLICY "Service role can update consultation requests"
ON public.consultation_requests
FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Service role can delete consultation requests"
ON public.consultation_requests
FOR DELETE
TO service_role
USING (true);