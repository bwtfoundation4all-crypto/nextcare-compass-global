-- Security Fix 3: Enhanced input validation and rate limiting
CREATE OR REPLACE FUNCTION public.validate_consultation_request_enhanced()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email IS NULL OR NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
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