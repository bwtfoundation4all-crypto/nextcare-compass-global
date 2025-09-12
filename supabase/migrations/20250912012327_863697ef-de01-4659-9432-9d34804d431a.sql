-- Fix search path security issues for validation functions
-- Update functions to set proper search paths

CREATE OR REPLACE FUNCTION validate_consultation_request()
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
  
  -- Rate limiting: max 3 requests per email per hour
  IF (
    SELECT COUNT(*) 
    FROM consultation_requests 
    WHERE email = NEW.email 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting another request.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION validate_appointment()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id is set and matches authenticated user
  IF NEW.user_id IS NULL OR NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Validate email format
  IF NEW.contact_email IS NULL OR NEW.contact_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate appointment date is in the future
  IF NEW.appointment_date <= NOW() THEN
    RAISE EXCEPTION 'Appointment date must be in the future';
  END IF;
  
  -- Validate appointment type
  IF NEW.appointment_type NOT IN ('consultation', 'follow-up', 'emergency', 'general') THEN
    RAISE EXCEPTION 'Invalid appointment type';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;