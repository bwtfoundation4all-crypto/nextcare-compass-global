-- Fix function search path security issues
ALTER FUNCTION validate_consultation_request() SET search_path = public;
ALTER FUNCTION validate_appointment() SET search_path = public;