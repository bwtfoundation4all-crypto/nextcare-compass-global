-- Add Dwolla customer id to profiles for mapping
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS dwolla_customer_id TEXT UNIQUE;

-- Optional index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_dwolla_customer_id ON public.profiles (dwolla_customer_id);
