-- Fix security vulnerability: Restrict appointments table access to authenticated users only
-- This prevents any potential information leakage to anonymous/unauthenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "appointments_select_admin_or_own" ON appointments;
DROP POLICY IF EXISTS "appointments_insert_own" ON appointments;
DROP POLICY IF EXISTS "appointments_update_admin_or_own" ON appointments;
DROP POLICY IF EXISTS "appointments_delete_admin_or_own" ON appointments;

-- Recreate policies with explicit 'TO authenticated' to ensure only logged-in users can access
CREATE POLICY "appointments_select_admin_or_own"
ON appointments
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR auth.uid() = user_id
);

CREATE POLICY "appointments_insert_own"
ON appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "appointments_update_admin_or_own"
ON appointments
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR auth.uid() = user_id
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  OR auth.uid() = user_id
);

CREATE POLICY "appointments_delete_admin_or_own"
ON appointments
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR auth.uid() = user_id
);

-- Add security comment
COMMENT ON TABLE appointments IS 'Contains sensitive customer contact information. All policies restricted to authenticated users only.';