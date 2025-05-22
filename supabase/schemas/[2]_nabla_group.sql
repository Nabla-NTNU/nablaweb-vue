-- Enums used by groups
CREATE TYPE nablaweb_vue.group_kind AS ENUM (
    'committee',
    'interest_group',
    'class'
);

-- Actual table
CREATE TABLE nablaweb_vue.nabla_groups (
    group_mail text NOT NULL,
    group_kind text DEFAULT 'INTEREST GROUP'::text NOT NULL,
    logo text NOT NULL,
    group_name text NOT NULL,
    group_url text NOT NULL,
    group_leader text
);

-- Constraints
ALTER TABLE ONLY nablaweb_vue.nabla_groups ADD CONSTRAINT nabla_groups_group_name_key UNIQUE (group_name);
ALTER TABLE ONLY nablaweb_vue.nabla_groups ADD CONSTRAINT nabla_groups_group_url_key UNIQUE (group_url);
ALTER TABLE ONLY nablaweb_vue.nabla_groups ADD CONSTRAINT nabla_groups_pkey PRIMARY KEY (group_url);
ALTER TABLE ONLY nablaweb_vue.nabla_groups ADD CONSTRAINT nabla_groups_group_leader_fkey FOREIGN KEY (group_leader) REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE;

-- Descriptions for Supabase Studio
COMMENT ON TYPE nablaweb_vue.group_kind IS 'Nabla has two kinds of groups which follow different regulations';
COMMENT ON TABLE nablaweb_vue.nabla_groups IS 'Committees, interest groups, etc';
