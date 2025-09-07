-- Enable leaked password protection in Supabase Auth
-- This enhances security by checking passwords against breach databases
UPDATE auth.config 
SET password_min_length = 8, 
    password_require_uppercase = true, 
    password_require_lowercase = true, 
    password_require_numbers = true, 
    password_require_symbols = false,
    password_max_length = 128,
    password_check_haveibeenpwned = true;