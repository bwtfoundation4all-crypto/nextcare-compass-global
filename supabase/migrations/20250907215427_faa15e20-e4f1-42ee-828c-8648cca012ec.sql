-- Fix RLS policies for appointments table
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;

CREATE POLICY "Users can view their own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" 
ON appointments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
ON appointments FOR UPDATE 
USING (auth.uid() = user_id);

-- Fix RLS policies for consultation_requests table  
DROP POLICY IF EXISTS "Users can view their consultation requests" ON consultation_requests;

CREATE POLICY "Users can view their consultation requests" 
ON consultation_requests FOR SELECT 
USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Fix RLS policies for document_uploads table
DROP POLICY IF EXISTS "Users can view their own documents" ON document_uploads;
DROP POLICY IF EXISTS "Users can upload their own documents" ON document_uploads;

CREATE POLICY "Users can view their own documents" 
ON document_uploads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents" 
ON document_uploads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
ON document_uploads FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
ON document_uploads FOR DELETE 
USING (auth.uid() = user_id);