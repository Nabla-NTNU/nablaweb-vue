-- Actual table
CREATE TABLE nablaweb_vue.nabla_group_members (
    "user"      TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    "group"     TEXT NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
    member_role TEXT                        NOT NULL DEFAULT '',
    date_joined TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT now(),
    is_active   BOOLEAN                     NOT NULL DEFAULT true ,
    "order"     INTEGER                     NOT NULL DEFAULT 0,
    
    -- Constraints
    PRIMARY KEY ("group", "user"),
    UNIQUE ("group", "order")
);

-- Security
ALTER TABLE nablaweb_vue.nabla_group_members ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_group_members TO anon, authenticated, service_role;

CREATE POLICY "Everyone can see group memberships"
    ON nablaweb_vue.nabla_group_members
    FOR SELECT
    USING (true);
    
CREATE POLICY "Group leaders can edit their group's members"
    ON nablaweb_vue.nabla_group_members
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabla_groups as g
            JOIN nablaweb_vue.nabla_users as u
            ON u.username = g.leader
            WHERE u.supabase_id = (SELECT auth.uid())
            AND g.id = nablaweb_vue.nabla_group_members."group"
        )
    )
    WITH CHECK(
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabla_groups as g
            JOIN nablaweb_vue.nabla_users as u
            ON u.username = g.leader
            WHERE u.supabase_id = (SELECT auth.uid())
            AND g.id = nablaweb_vue.nabla_group_members."group"
        )
    );

-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.nabla_group_members IS 'What members are part of what group';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members."user" IS 'Member''s username';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members.member_role IS 'Short user-editable string';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members."group" IS 'The groups unique group_url';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members."order" IS 'How a group shows its members';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members.date_joined IS 'Date of first entry intro group';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members.is_active IS 'Is member of group';