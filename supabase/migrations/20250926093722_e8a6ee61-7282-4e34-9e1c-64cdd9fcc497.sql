-- Remove the foreign table that exposes Azure connection data
DROP FOREIGN TABLE IF EXISTS "azureserve.database.windows.net";

-- Log the security remediation
INSERT INTO public.security_audit_log (
  event_type,
  event_data,
  user_id
) VALUES (
  'foreign_table_removed',
  jsonb_build_object(
    'table_name', 'azureserve.database.windows.net',
    'reason', 'security_vulnerability_remediation',
    'action_taken', 'dropped_foreign_table'
  ),
  NULL
);