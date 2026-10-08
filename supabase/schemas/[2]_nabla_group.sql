-- Enums used by groups
CREATE TYPE nablaweb_vue.group_kind AS ENUM (
    'Committee',
    'Interest group'
);



CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_groups (
    id              TEXT                    PRIMARY KEY,
    name            TEXT                    NOT NULL UNIQUE,
    mail_list       TEXT                    UNIQUE,
    date_began TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    is_active       BOOLEAN                 NOT NULL DEFAULT true

)

-- Indexing (For efficient user searching)
CREATE INDEX ON nablaweb_vue.nabla_groups USING btree (name);

-- Security
ALTER TABLE nablaweb_vue.nabla_groups ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_groups TO anon, authenticated, service_role;

CREATE POLICY "Everyone can see group data"
    ON nablaweb_vue.nabla_groups
    FOR SELECT
    USING (true);


-- Descriptions for Supabase Studio
COMMENT ON TABLE    nablaweb_vue.nabla_groups       IS 'All types of Nabla groups';
COMMENT ON COLUMN   nablaweb_vue.nabla_groups.id    IS 'The id of a group is a string of its name without capitalisation used as its URL for subgroups';
COMMENT ON COLUMN   nablaweb_vue.nabla_groups.name  IS 'The human-readable capitalised name of the group';


-- Actual table
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_subgroups (
    group           TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
    kind            nablaweb_vue.group_kind NOT NULL DEFAULT 'Interest group',
    logo            TEXT                    NOT NULL DEFAULT '',
    leader_mail     TEXT                    UNIQUE,
    -- Should leader be NOT-NULL? Unsure about ideology here.
    leader          TEXT REFERENCES nablaweb_vue.nabla_users(username),
    trusted_member  TEXT REFERENCES nablaweb_vue.nabla_users(username),
    about           TEXT                    NOT NULL DEFAULT '',
    group_photo     TEXT                    NOT NULL DEFAULT '',
);


-- Security
ALTER TABLE nablaweb_vue.nabla_subgroups ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_subgroups TO anon, authenticated, service_role;

CREATE POLICY "Everyone can see subgroup data"
    ON nablaweb_vue.nabla_subgroups
    FOR SELECT
    USING (true);

CREATE POLICY "Group leaders can update their subgroup's data"
    ON nablaweb_vue.nabla_subgroups
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabla_users as u
            WHERE u.username = nablaweb_vue.nabla_subgroups.leader
            AND u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK(
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabla_users as u
            WHERE u.username = nablaweb_vue.nabla_subgroups.leader
        )
    );

-- Descriptions for Supabase Studio
COMMENT ON TYPE     nablaweb_vue.group_kind         IS 'Nabla has two kinds of groups which follow different regulations';
COMMENT ON TABLE    nablaweb_vue.nabla_subgroups    IS 'Committees, interest groups';
