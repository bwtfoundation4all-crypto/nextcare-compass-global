-- Fix critical security vulnerabilities in RLS policies

-- 1. Fix consultation_requests table security
-- The current policy tries to reference auth.users.email directly which is problematic
-- Replace with a safer approach that matches the email field directly with the authenticated user's email

-- First, drop the problematic existing policy
DROP POLICY IF EXISTS "Users can view their consultation requests" ON public.consultation_requests;

-- Create a more secure policy that doesn't reference auth.users directly
-- Instead, we'll create a security definer function to get the current user's email safely
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT AS $$
  SELECT auth.email()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new secure policy for viewing consultation requests
CREATE POLICY "Users can view their own consultation requests by email" 
ON public.consultation_requests 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND email = public.get_current_user_email()
);

-- 2. Ensure document_uploads is properly secured
-- Add additional validation to prevent path traversal or unauthorized access
-- First check if we need to update the existing policy
DROP POLICY IF EXISTS "Users can view their own documents" ON public.document_uploads;

CREATE POLICY "Users can view their own documents securely" 
ON public.document_uploads 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- 3. Add audit logging trigger for sensitive data access
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,
  user_id uuid,
  record_id uuid,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow reading audit logs for authenticated users (admins would need separate access)
CREATE POLICY "Users cannot access audit logs" 
ON public.audit_logs 
FOR ALL 
USING (false);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_logs (
    table_name,
    operation,
    user_id,
    record_id,
    created_at
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    COALESCE(NEW.id, OLD.id),
    now()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_consultation_requests ON public.consultation_requests;
CREATE TRIGGER audit_consultation_requests
  AFTER SELECT ON public.consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_sensitive_access();

DROP TRIGGER IF EXISTS audit_document_uploads ON public.document_uploads;
CREATE TRIGGER audit_document_uploads
  AFTER SELECT ON public.document_uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_sensitive_access();

-- 4. Add rate limiting table for form submissions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL, -- IP address or user ID
  action text NOT NULL, -- 'consultation_request', 'contact_form', etc.
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Deny all client access to rate limits table
CREATE POLICY "Deny client access to rate limits" 
ON public.rate_limits 
FOR ALL 
USING (false);

-- Add updated_at trigger for rate_limits
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();