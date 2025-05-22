
CREATE TABLE nablaweb_vue.nabla_group_pages (
    "group" text NOT NULL,
    about text,
    group_image text
);



CREATE TABLE nablaweb_vue.nabla_user_page (
    "user" text NOT NULL,
    about text NOT NULL,
    website text,
    public_email text
);

COMMENT ON TABLE nablaweb_vue.nabla_user_page IS 'Data every user publicly shares on their personal page';

ALTER TABLE ONLY nablaweb_vue.nabla_group_pages
    ADD CONSTRAINT nabkla_group_pages_pkey PRIMARY KEY ("group");

ALTER TABLE ONLY nablaweb_vue.nabla_user_page
    ADD CONSTRAINT nabla_user_page_pkey PRIMARY KEY ("user");

ALTER TABLE ONLY nablaweb_vue.nabla_group_pages
    ADD CONSTRAINT nabkla_group_pages_group_fkey FOREIGN KEY ("group") REFERENCES nablaweb_vue.nabla_groups(group_url) ON UPDATE CASCADE;

ALTER TABLE ONLY nablaweb_vue.nabla_group_pages
    ADD CONSTRAINT nabla_group_pages_group_fkey FOREIGN KEY ("group") REFERENCES nablaweb_vue.nabla_groups(group_url) ON UPDATE CASCADE;

ALTER TABLE ONLY nablaweb_vue.nabla_user_page
    ADD CONSTRAINT nabla_user_page_user_fkey FOREIGN KEY ("user") REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE;

INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('alexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Alexander', 'Mitrokhin', 'alexamm', 'alexamm@ntnu.no', 'kull23');
