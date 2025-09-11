-- Remove Dwolla-related columns from tables
ALTER TABLE public.profiles DROP COLUMN IF EXISTS dwolla_customer_id;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS dwolla_customer_id;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS dwolla_funding_source_id;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS dwolla_transfer_id;