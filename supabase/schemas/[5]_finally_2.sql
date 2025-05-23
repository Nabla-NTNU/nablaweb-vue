COMMIT;

INSERT INTO nablaweb_vue.nabla_group_pages("group", about, group_image) VALUES ('webkom', '', '.');
INSERT INTO nablaweb_vue.nabla_group_pages("group", about, group_image) VALUES ('kultkom', '', '.');
INSERT INTO nablaweb_vue.nabla_group_pages("group", about, group_image) VALUES ('quizkom', '', '.');
INSERT INTO nablaweb_vue.nabla_group_pages("group", about, group_image) VALUES ('revy', '', '.');
INSERT INTO nablaweb_vue.nabla_group_pages("group", about, group_image) VALUES ('styret', '', '.');

-- admin admin
INSERT INTO
  auth.users (
    id,
    instance_id,
    ROLE,
    aud,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    encrypted_password,
    created_at,
    updated_at,
    last_sign_in_at,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@stud.ntnu.no',
    '{"provider":"email","providers":["email"]}',
    '{}',
    TRUE,
    crypt('admin', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

INSERT INTO
  auth.identities (
    id,
    provider_id,
    provider,
    user_id,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
VALUES
  (
    (SELECT id FROM auth.users WHERE email = 'admin@stud.ntnu.no'),
    (SELECT id FROM auth.users WHERE email = 'admin@stud.ntnu.no'),
    'email',
    (SELECT id FROM auth.users WHERE email = 'admin@stud.ntnu.no'),
    json_build_object('sub', (SELECT id FROM auth.users WHERE email = 'admin@stud.ntnu.no')),
    NOW(),
    NOW(),
    NOW()
  );

-- user user
INSERT INTO
  auth.users (
    id,
    instance_id,
    ROLE,
    aud,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    encrypted_password,
    created_at,
    updated_at,
    last_sign_in_at,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'user@stud.ntnu.no',
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    crypt('user', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

INSERT INTO
  auth.identities (
    id,
    provider_id,
    provider,
    user_id,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  )
VALUES
  (
    (SELECT id FROM auth.users WHERE email = 'user@stud.ntnu.no'),
    (SELECT id FROM auth.users WHERE email = 'user@stud.ntnu.no'),
    'email',
    (SELECT id FROM auth.users WHERE email = 'user@stud.ntnu.no'),
    json_build_object('sub', (SELECT id FROM auth.users WHERE email = 'user@stud.ntnu.no')),
    NOW(),
    NOW(),
    NOW()
  );

GRANT USAGE ON SCHEMA nablaweb_vue TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA nablaweb_vue TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA nablaweb_vue TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA nablaweb_vue TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA nablaweb_vue GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;