-- Categories (FTV, ITV, PTV, KTV)
CREATE TABLE IF NOT EXISTS nablaweb_vue.trusted_member_categories (
    id          TEXT PRIMARY KEY,
    display_name        TEXT NOT NULL,
    "order"     INTEGER NOT NULL DEFAULT 0
);

-- Roles (e.g., "Fysmat kull 24" or "Institutt for fysikk")
CREATE TABLE IF NOT EXISTS nablaweb_vue.trusted_member_areas (
    id           TEXT PRIMARY KEY, 
    category     TEXT NOT NULL REFERENCES nablaweb_vue.trusted_member_categories(id) ON UPDATE CASCADE,
    display_name TEXT NOT NULL,    
    area_mail    TEXT,             -- Optional role mail
    "order"      INTEGER NOT NULL DEFAULT 0
);

-- Assignments (Linking users to the roles)
CREATE TABLE IF NOT EXISTS nablaweb_vue.trusted_member_assignments (
    area_id       TEXT NOT NULL REFERENCES nablaweb_vue.trusted_member_areas(id) ON UPDATE CASCADE ON DELETE CASCADE,
    username     TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    "order"      INTEGER NOT NULL DEFAULT 0,
    
    PRIMARY KEY (area_id, username),
    UNIQUE (area_id, "order")
);

-- Security 
GRANT SELECT ON TABLE nablaweb_vue.trusted_member_categories, nablaweb_vue.trusted_member_areas, nablaweb_vue.trusted_member_assignments
TO anon, authenticated, service_role;


ALTER TABLE nablaweb_vue.trusted_member_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nablaweb_vue.trusted_member_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE nablaweb_vue.trusted_member_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view trusted member categories"
    ON nablaweb_vue.trusted_member_categories
    FOR ALL
    TO anon, authenticated, service_role;

CREATE POLICY "Everyone can view trusted member areas"
    ON nablaweb_vue.trusted_member_areas
    FOR ALL
    TO anon, authenticated, service_role;

CREATE POLICY "Everyone can view trusted members"
    ON nablaweb_vue.trusted_member_assignments
    FOR ALL
    TO anon, authenticated, service_role;

-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.trusted_member_categories IS 'Top level groupings for trusted members';
COMMENT ON TABLE nablaweb_vue.trusted_member_areas IS 'Specific areas of responsibility or student councils';
COMMENT ON TABLE nablaweb_vue.trusted_member_assignments IS 'Assigning trusted members to their area of responsibility';