-- Actual table
CREATE TABLE nablaweb_vue.nabla_group_members (
    "user"      TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE,
    "group"     TEXT NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE,
    member_role TEXT DEFAULT '',
    date_joined TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    is_active   BOOLEAN DEFAULT true NOT NULL,
    "order"     INTEGER GENERATED ALWAYS AS IDENTITY,
    
    -- Constraints
    PRIMARY KEY ("group", "user"),
    UNIQUE ("group", "order")
);

-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.nabla_group_members IS 'What members are part of what group';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members."user" IS 'Member''s username';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members.member_role IS 'Short user-editable string';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members."group" IS 'The groups unique group_url';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members."order" IS 'How a group shows its members';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members.date_joined IS 'Date of first entry intro group';
COMMENT ON COLUMN nablaweb_vue.nabla_group_members.is_active IS 'Is member of group';