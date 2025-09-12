-- Security Fix 2: Role escalation prevention
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

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role audit logs" 
ON public.role_audit_log 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));