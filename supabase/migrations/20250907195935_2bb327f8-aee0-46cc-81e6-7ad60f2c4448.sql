-- Fix missing RLS policies for services table and improve security

-- Enable RLS on services table if not already enabled
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for services table (public read access since it's a service catalog)
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (is_active = true);

-- Admin/service management policies (for future admin functionality)
CREATE POLICY "Admin can manage services" 
ON public.services 
FOR ALL 
USING (false); -- Will be updated when admin system is implemented

-- Fix consultation_requests policies to add WITH CHECK clauses for security
DROP POLICY IF EXISTS "Users can upload their own documents" ON public.document_uploads;
CREATE POLICY "Users can upload their own documents" 
ON public.document_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add missing WITH CHECK for invoices insert policy
DROP POLICY IF EXISTS "insert_own_invoices" ON public.invoices;
CREATE POLICY "insert_own_invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix payments table policies to be more explicit
DROP POLICY IF EXISTS "deny_insert_payments" ON public.payments;
CREATE POLICY "deny_insert_payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (false);

DROP POLICY IF EXISTS "deny_update_payments" ON public.payments;
CREATE POLICY "deny_update_payments" 
ON public.payments 
FOR UPDATE 
USING (false)
WITH CHECK (false);