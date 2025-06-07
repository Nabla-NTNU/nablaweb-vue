-- Enums used by users
CREATE TYPE nablaweb_vue.class AS ENUM (
    'ortogonal',
    'kull20',
    'kull21',
    'kull22',
    'kull23',
    'kull24',
    'kull25'
);

-- Actual table
CREATE TABLE nablaweb_vue.nabla_users (
    username        TEXT                PRIMARY KEY,
    supabase_id     UUID                NOT NULL UNIQUE,
    ntnu_email      TEXT                NOT NULL UNIQUE,
    list_email      TEXT                NOT NULL UNIQUE,
    first_name      TEXT                NOT NULL,
    last_name       TEXT                NOT NULL,
    class           nablaweb_vue.class  NOT NULL,
    profile_picture TEXT                NOT NULL DEFAULT '',
    about           text                NOT NULL DEFAULT '',
    website         text                NOT NULL DEFAULT '',
    public_email    text                NOT NULL DEFAULT '',
    is_active       BOOLEAN             NOT NULL DEFAULT true,
    birthday        DATE,
    first_name_last_name_username TEXT  GENERATED ALWAYS AS
        (first_name || ' ' || last_name || ' ' || username) STORED
);

-- Indexing (For efficient user searching)
CREATE INDEX ON nablaweb_vue.nabla_users USING btree (first_name_last_name_username);

-- Security
ALTER TABLE nablaweb_vue.nabla_users ENABLE ROW LEVEL SECURITY;

GRANT SELECT (username, first_name, last_name, class, profile_picture) ON TABLE nablaweb_vue.nabla_users TO anon;
GRANT SELECT ON TABLE nablaweb_vue.nabla_users TO authenticated, service_role;

CREATE POLICY "Everyone can see user data"
    ON nablaweb_vue.nabla_users
    FOR SELECT
    USING (true);

CREATE POLICY "Users can edit their data"
    ON nablaweb_vue.nabla_users
    FOR UPDATE
    TO authenticated
    USING (
        (SELECT auth.uid()) = supabase_id
    );

-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.nabla_users IS 'Table containing unique details of past and present nablausers';