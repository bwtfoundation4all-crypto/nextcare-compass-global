-- Insert sample services data for the healthcare portal
INSERT INTO public.services (name, description, price, duration, features, is_active) VALUES
('Initial Healthcare Consultation', 'Comprehensive healthcare assessment and guidance session with our expert consultants', 99, '60 minutes', 
 ARRAY['Initial health assessment', 'Personalized healthcare plan', 'Insurance guidance', 'Provider recommendations', 'Follow-up support'], true),

('Insurance Navigation Service', 'Expert assistance with international health insurance selection and claims', 79, '45 minutes',
 ARRAY['Insurance plan comparison', 'Claims assistance', 'Coverage optimization', 'Provider network guidance', 'Documentation support'], true),

('Medical Travel Coordination', 'Complete support for medical treatment abroad including logistics and planning', 149, '90 minutes',
 ARRAY['Treatment facility research', 'Travel coordination', 'Visa assistance', 'Local support arrangements', 'Cost estimation'], true),

('Emergency Consultation', 'Urgent healthcare guidance for immediate needs and crisis situations', 199, '30 minutes',
 ARRAY['Immediate assessment', 'Emergency planning', 'Provider connections', 'Urgent care guidance', '24/7 follow-up'], true),

('Follow-up Consultation', 'Ongoing support and guidance for existing healthcare plans', 59, '30 minutes',
 ARRAY['Progress review', 'Plan adjustments', 'Additional resources', 'Continued support', 'Update recommendations'], true);

-- Fix potential WITH CHECK clause issues for existing policies
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
CREATE POLICY "Users can create their own appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upload their own documents" ON public.document_uploads;
CREATE POLICY "Users can upload their own documents" 
ON public.document_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_invoices" ON public.invoices;
CREATE POLICY "insert_own_invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);