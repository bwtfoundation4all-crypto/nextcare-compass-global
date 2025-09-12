-- Security Fix 1: Remove public access to services table and require authentication
DROP POLICY IF EXISTS "Public can view active services" ON public.services;

-- Create new policy requiring authentication to view services
CREATE POLICY "Authenticated users can view active services" 
ON public.services 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Security Fix 2: Prevent role escalation - users cannot modify their own roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate admin policy with proper restrictions
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Prevent users from modifying their own roles
CREATE POLICY "Users cannot modify their own roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (false)
WITH CHECK (false);

-- Prevent users from inserting roles for themselves (except through admin)
CREATE POLICY "Prevent self role assignment" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Security Fix 3: Add audit logging for role changes
CREATE TABLE IF NOT EXISTS public.role_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  target_user_id uuid NOT NULL,
  old_role app_role,
  new_role app_role,
  performed_by uuid NOT NULL,
  performed_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb
);

-- Enable RLS on audit log
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view role audit logs" 
ON public.role_audit_log 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger function for role audit logging
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (action, target_user_id, new_role, performed_by)
    VALUES ('ASSIGN', NEW.user_id, NEW.role, auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.role_audit_log (action, target_user_id, old_role, new_role, performed_by)
    VALUES ('UPDATE', NEW.user_id, OLD.role, NEW.role, auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (action, target_user_id, old_role, performed_by)
    VALUES ('REMOVE', OLD.user_id, OLD.role, auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role changes
DROP TRIGGER IF EXISTS role_changes_audit ON public.user_roles;
CREATE TRIGGER role_changes_audit
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_changes();

-- Security Fix 4: Enhanced rate limiting for consultation requests
CREATE OR REPLACE FUNCTION public.validate_consultation_request_enhanced()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email IS NULL OR NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate name is not empty and reasonable length
  IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) < 2 OR LENGTH(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  
  -- Validate phone format if provided
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^[\+]?[1-9][\d]{0,15}$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;
  
  -- Sanitize message input
  IF NEW.message IS NOT NULL AND LENGTH(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message too long (max 2000 characters)';
  END IF;
  
  -- Enhanced rate limiting: max 2 requests per email per hour (reduced from 3)
  IF (
    SELECT COUNT(*) 
    FROM consultation_requests 
    WHERE email = NEW.email 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 2 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting another request.';
  END IF;
  
  -- Additional security: Check for suspicious patterns
  IF NEW.message IS NOT NULL AND (
    NEW.message ILIKE '%<script%' OR 
    NEW.message ILIKE '%javascript:%' OR
    NEW.message ILIKE '%vbscript:%' OR
    NEW.message ILIKE '%onload=%' OR
    NEW.message ILIKE '%onerror=%'
  ) THEN
    RAISE EXCEPTION 'Invalid content detected';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update trigger to use enhanced validation
DROP TRIGGER IF EXISTS validate_consultation_request_trigger ON public.consultation_requests;
CREATE TRIGGER validate_consultation_request_trigger
  BEFORE INSERT ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION public.validate_consultation_request_enhanced();