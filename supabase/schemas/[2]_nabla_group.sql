-- Enums used by groups
CREATE TYPE nablaweb_vue.group_kind AS ENUM (
    'Committee',
    'Interest group'
);

-- Actual table
CREATE TABLE nablaweb_vue.nabla_groups (
    id              TEXT                    PRIMARY KEY,
    name            TEXT                    NOT NULL UNIQUE,
    kind            nablaweb_vue.group_kind NOT NULL DEFAULT 'Interest group',
    logo            TEXT                    NOT NULL DEFAULT '',
    mail_list       TEXT                    UNIQUE,
    leader_mail     TEXT                    UNIQUE,
    leader          TEXT REFERENCES nablaweb_vue.nabla_users(username),
    about           TEXT                    NOT NULL DEFAULT '',
    group_image     TEXT                    NOT NULL DEFAULT '',
    date_began TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    is_active       BOOLEAN                 NOT NULL DEFAULT true
);

-- Indexing (For efficient user searching)
CREATE INDEX ON nablaweb_vue.nabla_groups USING btree (name);

-- Descriptions for Supabase Studio
COMMENT ON TYPE     nablaweb_vue.group_kind         IS 'Nabla has two kinds of groups which follow different regulations';
COMMENT ON TABLE    nablaweb_vue.nabla_groups       IS 'Committees, interest groups, etc';
COMMENT ON COLUMN   nablaweb_vue.nabla_groups.id    IS 'The id of a group is a string of its name without capitalisation used as its URL';
COMMENT ON COLUMN   nablaweb_vue.nabla_groups.name  IS 'The human-readable capitalised name of the group';
