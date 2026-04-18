-- Make the schema ;))
CREATE SCHEMA IF NOT EXISTS nablaweb_vue;

-- Allow access to database
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;