-- Create profiles table to satisfy potential signup triggers inserting into public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: users can view their own profile
DO $$ BEGIN
  CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS: users can insert their own profile
DO $$ BEGIN
  CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS: users can update their own profile
DO $$ BEGIN
  CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger to keep updated_at fresh for profiles
DO $$ BEGIN
  CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- Create notification_settings table to satisfy potential signup triggers inserting into public.notification_settings
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for notification_settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS: users can view their own notification settings
DO $$ BEGIN
  CREATE POLICY "Users can view their notification settings"
  ON public.notification_settings FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS: users can insert their own notification settings
DO $$ BEGIN
  CREATE POLICY "Users can create their notification settings"
  ON public.notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- RLS: users can update their own notification settings
DO $$ BEGIN
  CREATE POLICY "Users can update their notification settings"
  ON public.notification_settings FOR UPDATE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger to keep updated_at fresh for notification_settings
DO $$ BEGIN
  CREATE TRIGGER notification_settings_set_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
