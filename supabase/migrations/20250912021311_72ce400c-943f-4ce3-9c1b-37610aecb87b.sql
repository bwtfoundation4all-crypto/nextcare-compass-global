-- Security Fix 1: Remove public access to services table and require authentication
DROP POLICY IF EXISTS "Public can view active services" ON public.services;

CREATE POLICY "Authenticated users can view active services" 
ON public.services 
FOR SELECT 
TO authenticated
USING (is_active = true);