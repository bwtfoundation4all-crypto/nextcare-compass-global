-- Set up initial admin users and fix service access policies

-- First, let's assign admin role to the first user (you can change this to your preferred email)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('9fc6442e-62ca-4e99-b01c-29b88583352c', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Fix service access - require authentication to view services
DROP POLICY IF EXISTS "Authenticated users can view active services" ON public.services;

CREATE POLICY "Authenticated users can view active services"
ON public.services
FOR SELECT
TO authenticated
USING (is_active = true AND auth.uid() IS NOT NULL);

-- Allow admins to manage services
CREATE POLICY "Admins can manage all services"
ON public.services
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create a function to help admins assign roles safely
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can assign roles
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Only admins can assign roles';
  END IF;
  
  -- Insert or update the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Log the role assignment
  INSERT INTO public.role_audit_log (
    target_user_id, 
    action, 
    new_role, 
    performed_by,
    metadata
  ) VALUES (
    target_user_id,
    'role_assigned',
    new_role,
    auth.uid(),
    jsonb_build_object('assigned_at', now())
  );
END;
$$;