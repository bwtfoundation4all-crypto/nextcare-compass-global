-- Remove admin role from brownmller@gmail.com
DELETE FROM public.user_roles 
WHERE user_id = 'f4f41a60-f97a-4290-9a66-0932bcdbba9c' AND role = 'admin'::app_role;

-- Add admin role to brownkings947@gmail.com
INSERT INTO public.user_roles (user_id, role) 
VALUES ('4d289fa0-e705-4745-b697-a90a2718d3c6', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;