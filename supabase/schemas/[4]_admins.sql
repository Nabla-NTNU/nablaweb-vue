-- Actual table
CREATE TABLE nablaweb_vue.nabladmins (
    "user"      TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    reason      TEXT NOT NULL,
    "date"      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Constraints
    PRIMARY KEY ("user")
);
-- IN DEVELOPMENT
--      I think having a single table of admins should be enough. Hopefully
--  there isn't a need for more than one hierarchy of admins - I'm picturing
--  this as mostly a table for us in Webkom, effectively giving us superuser
--  privvilages, able to edit everything we may need to (that's not private)
--  to avoid locking people out.
--      Group leaders are their own thing, which we control. Nabladet and
--  the podcact should also have access to their things through their
--  respective groups (which we should consider not giving ourselves acecss
--  to outside of a dev environment.
--      Further - these should be reviewed regularly, given the date and
--  reason. Admins should be able to edit admins, and current websjef
--  should probably not be removable, so that someone can fix access
--  without going to server.

-- Security
ALTER TABLE nablaweb_vue.nabladmins ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabladmins TO anon, authenticated, service_role;

CREATE POLICY "Everyone can identify admins"
    ON nablaweb_vue.nabladmins
    FOR SELECT
    USING (true);
    
CREATE POLICY "Admins can edit groups"
    ON nablaweb_vue.nabla_groups
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u
            ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u
            ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );


CREATE POLICY "Admins can edit groups memberships"
    ON nablaweb_vue.nabla_group_members
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u
            ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u
            ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );
    
-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.nabladmins IS 'Nabladmins. As of now - probably developers.';