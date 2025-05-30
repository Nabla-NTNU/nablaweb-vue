-- Make the schema ;))
CREATE SCHEMA nablaweb_vue;

-- Allow access to database
GRANT USAGE ON SCHEMA nablaweb_vue TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA nablaweb_vue TO authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA nablaweb_vue TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA nablaweb_vue TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;