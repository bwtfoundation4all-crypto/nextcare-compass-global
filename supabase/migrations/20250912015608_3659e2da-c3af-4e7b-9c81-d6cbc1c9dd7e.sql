-- Create family_members table for family account management
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  family_member_user_id UUID,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  emergency_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_timeline table for health history tracking
CREATE TABLE public.health_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('appointment', 'medication', 'symptom', 'test_result', 'diagnosis', 'treatment', 'note')),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_chat_sessions table for AI health assistant
CREATE TABLE public.ai_chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_chat_messages table for chat history
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  appointment_reminders BOOLEAN DEFAULT true,
  follow_up_reminders BOOLEAN DEFAULT true,
  health_tips BOOLEAN DEFAULT true,
  family_updates BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_analytics table for tracking key metrics
CREATE TABLE public.admin_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family_members
CREATE POLICY "Users can manage their family members" 
ON public.family_members 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Family members can view their own records" 
ON public.family_members 
FOR SELECT 
USING (auth.uid() = family_member_user_id);

CREATE POLICY "Admins can view all family members" 
ON public.family_members 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for health_timeline
CREATE POLICY "Users can manage their health timeline" 
ON public.health_timeline 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all health timelines" 
ON public.health_timeline 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for ai_chat_sessions
CREATE POLICY "Users can manage their chat sessions" 
ON public.ai_chat_sessions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat sessions" 
ON public.ai_chat_sessions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for ai_chat_messages
CREATE POLICY "Users can view messages from their sessions" 
ON public.ai_chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ai_chat_sessions s 
    WHERE s.id = ai_chat_messages.session_id 
    AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their sessions" 
ON public.ai_chat_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_chat_sessions s 
    WHERE s.id = ai_chat_messages.session_id 
    AND s.user_id = auth.uid()
  )
);

-- RLS Policies for notification_settings
CREATE POLICY "Users can manage their notification settings" 
ON public.notification_settings 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for admin_analytics
CREATE POLICY "Only admins can access analytics" 
ON public.admin_analytics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_timeline_updated_at
  BEFORE UPDATE ON public.health_timeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at
  BEFORE UPDATE ON public.ai_chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default notification settings for existing users
INSERT INTO public.notification_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT DO NOTHING;

-- Function to automatically create default notification settings for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger to create notification settings for new users
CREATE TRIGGER on_auth_user_created_notifications
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_notifications();