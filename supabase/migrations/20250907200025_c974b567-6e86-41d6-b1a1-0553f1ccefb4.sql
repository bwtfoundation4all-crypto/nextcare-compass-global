-- Create services table for catalog of offerings used by checkout and booking
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0, -- price in whole dollars for simplicity
  duration TEXT DEFAULT '60 minutes',
  features TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view only active services (public catalog)
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
ON public.services
FOR SELECT
USING (is_active = true);

-- By default, block inserts/updates/deletes (no admin role yet)
DROP POLICY IF EXISTS "deny_modify_services" ON public.services;
CREATE POLICY "deny_modify_services"
ON public.services
FOR ALL
USING (false)
WITH CHECK (false);

-- Update updated_at automatically
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();