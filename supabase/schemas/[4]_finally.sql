
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



-- DELETE, SHOULD BE DONE IN JS
INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('alexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Alexander', 'Mitrokhin', 'alexamm', 'alexamm@ntnu.no', 'kull20');
INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('blexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Blexander', 'Mitrokhin', 'blexamm', 'blexamm@ntnu.no', 'kull21');
INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('clexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Clexander', 'Mitrokhin', 'clexamm', 'clexamm@ntnu.no', 'kull22');
INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('dlexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Dlexander', 'Mitrokhin', 'dlexamm', 'dlexamm@ntnu.no', 'kull23');
INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('elexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Elexander', 'Mitrokhin', 'elexamm', 'elexamm@ntnu.no', 'kull24');
INSERT INTO nablaweb_vue.nabla_users(list_email, profile_picture, first_name, last_name, username, ntnu_email, class) VALUES ('flexamm@ntnu.no', 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg', 'Flexander', 'Mitrokhin', 'flexamm', 'flexamm@ntnu.no', 'kull25');

COMMIT;

INSERT INTO nablaweb_vue.nabla_groups(group_mail, group_kind, logo, group_name, group_url, group_leader) VALUES ('webkom@nabla.no', 'komite', '.', 'Webkom', 'webkom', 'alexamm');
INSERT INTO nablaweb_vue.nabla_groups(group_mail, group_kind, logo, group_name, group_url, group_leader) VALUES ('kultkom@nabla.no', 'interessegruppe', '.', 'Kultkom', 'kultkom', 'blexamm');
INSERT INTO nablaweb_vue.nabla_groups(group_mail, group_kind, logo, group_name, group_url, group_leader) VALUES ('qizkom@nabla.no', 'interessegruppe', '.', 'Quizkom', 'quizkom', 'clexamm');
INSERT INTO nablaweb_vue.nabla_groups(group_mail, group_kind, logo, group_name, group_url, group_leader) VALUES ('revyen@nabla.no', 'interessegruppe', '.', 'Revyen', 'revy', 'dlexamm');
INSERT INTO nablaweb_vue.nabla_groups(group_mail, group_kind, logo, group_name, group_url, group_leader) VALUES ('styret@nabla.no', 'komite', '.', 'Styret', 'styret', 'elexamm');