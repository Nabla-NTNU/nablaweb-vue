GRANT USAGE ON SCHEMA nablaweb_vue TO anon, authenticated, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA nablaweb_vue TO authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA nablaweb_vue TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA nablaweb_vue TO authenticated, service_role;