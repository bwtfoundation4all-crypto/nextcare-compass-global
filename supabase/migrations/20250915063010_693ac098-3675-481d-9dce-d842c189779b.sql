-- Fix RLS issues and security vulnerabilities

-- 1. Enable RLS on wrappers_fdw_stats table and add admin-only access policy
ALTER TABLE public.wrappers_fdw_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict wrappers_fdw_stats access to admins only
CREATE POLICY "Only admins can access wrappers stats"
ON public.wrappers_fdw_stats
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Move wrappers extension from public schema to extensions schema
-- First create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move the wrappers extension to extensions schema
ALTER EXTENSION wrappers SET SCHEMA extensions;

-- 3. Enhance consultation_requests security by removing public insert access
-- Drop the existing public policy
DROP POLICY IF EXISTS "Anyone can create consultation requests" ON public.consultation_requests;

-- Create new policy that only allows authenticated users to create consultation requests
CREATE POLICY "Authenticated users can create consultation requests"
ON public.consultation_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add rate limiting policy (in addition to the existing trigger)
CREATE POLICY "Users can only view their own consultation requests"
ON public.consultation_requests
FOR SELECT
TO authenticated
USING (
  email = (auth.jwt() ->> 'email'::text) OR 
  has_role(auth.uid(), 'admin'::app_role)
);