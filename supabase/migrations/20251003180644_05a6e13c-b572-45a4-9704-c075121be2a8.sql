-- Fix security vulnerability: Make user_id non-nullable in appointments table
-- This ensures all appointments are properly protected by RLS policies

-- First, update any existing records with NULL user_id (if any)
-- We'll need to handle this carefully - for this fix, we'll delete any orphaned records
DELETE FROM appointments WHERE user_id IS NULL;

-- Now make user_id NOT NULL
ALTER TABLE appointments 
ALTER COLUMN user_id SET NOT NULL;

-- Add a comment explaining the security requirement
COMMENT ON COLUMN appointments.user_id IS 'User ID is required for RLS protection - must never be NULL';