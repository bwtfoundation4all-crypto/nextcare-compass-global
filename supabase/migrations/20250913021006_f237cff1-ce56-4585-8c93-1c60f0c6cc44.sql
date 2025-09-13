-- Assign admin role to the first user (brownmller@gmail.com)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('f4f41a60-f97a-4290-9a66-0932bcdbba9c', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;