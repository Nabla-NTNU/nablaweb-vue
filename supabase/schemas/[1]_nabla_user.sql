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
    list_email text NOT NULL,
    profile_picture text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birthday date,
    username text NOT NULL,
    ntnu_email text NOT NULL,
    class text,
    first_name_last_name_username text GENERATED ALWAYS AS (((((first_name || ' '::text) || last_name) || ' '::text) || username)) STORED
);

-- Indexing (For efficient user searching)
CREATE INDEX idx_nabla_users_search_string ON nablaweb_vue.nabla_users USING btree (first_name_last_name_username);

--  Constraints
ALTER TABLE ONLY nablaweb_vue.nabla_users ADD CONSTRAINT "nablaUsers_listEmail_key" UNIQUE (list_email);
ALTER TABLE ONLY nablaweb_vue.nabla_users ADD CONSTRAINT nabla_users_ntnu_email_key UNIQUE (ntnu_email);
ALTER TABLE ONLY nablaweb_vue.nabla_users ADD CONSTRAINT nabla_users_pkey PRIMARY KEY (username);

-- Descriptions for Supabase Studio
COMMENT ON TABLE nablaweb_vue.nabla_users IS 'Table containing unique details of past and present nablausers';