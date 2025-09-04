-- Create invoices table for Dwolla ACH payments and approvals
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | sent | approved | paid | canceled
  due_date TIMESTAMPTZ,
  dwolla_customer_id TEXT,
  dwolla_funding_source_id TEXT,
  dwolla_transfer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "select_own_invoices" ON public.invoices
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own_invoices" ON public.invoices
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_invoices" ON public.invoices
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "delete_own_invoices" ON public.invoices
FOR DELETE USING (auth.uid() = user_id);

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_invoices_updated_at ON public.invoices;
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();