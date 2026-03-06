-- Categories (FTV, ITV, PTV, KTV)
CREATE TABLE nablaweb_vue.trusted_member_categories (
    id           TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,    
    "order"      INTEGER NOT NULL DEFAULT 0
);

-- Specific Roles (e.g., "Fysmat kull 24" or "Institutt for fysikk")
CREATE TABLE nablaweb_vue.trusted_member_areas (
    id           TEXT PRIMARY KEY, 
    category     TEXT NOT NULL REFERENCES nablaweb_vue.trusted_member_categories(id) ON UPDATE CASCADE,
    name         TEXT NOT NULL,    
    area_mail    TEXT,             -- Optional role mail
    "order"      INTEGER NOT NULL DEFAULT 0
);

-- Assignments (Linking users to the roles)
CREATE TABLE nablaweb_vue.trusted_member_assignments (
    "area"       TEXT NOT NULL REFERENCES nablaweb_vue.trusted_member_areas(id) ON UPDATE CASCADE ON DELETE CASCADE,
    "user"       TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    "order"      INTEGER NOT NULL DEFAULT 0,
    
    PRIMARY KEY ("area", "user"),
    UNIQUE ("area", "order")
);

-- Security 
GRANT USAGE ON SCHEMA nablaweb_vue TO anon, authenticated, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA nablaweb_vue TO anon, authenticated, service_role;

-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.trusted_member_categories IS 'Top level groupings for trusted members';
COMMENT ON TABLE nablaweb_vue.trusted_member_areas IS 'Specific positions or student councils';
COMMENT ON COLUMN nablaweb_vue.trusted_member_areas.area_mail IS 'The official role email, e.g. ftv@...';