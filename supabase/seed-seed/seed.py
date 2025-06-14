from faker import Faker
from faker.providers import profile, person
from numpy.random import randint
from pathlib import Path
from uuid import uuid4

FILE_PATH = Path("./../seed.sql")
N_USERS = 100


faker = Faker(locale="no")
faker.add_provider(person)
# faker.add_provider(profile)

users = dict()

class User():
    def __init__(self):
        self.first_name = faker.first_name()
        self.last_name = faker.last_name()
        self.username = ''
        while self.username in users.keys() or self.username == '':
            self.username = self.first_name[:randint(2, len(self.first_name))].lower() + self.last_name[:randint(2, len(self.first_name))].lower()
        self.supabase_id = uuid4()
        self.ntnu_email = self.username + ('@stud.ntnu.no' if randint(0, 10) < 3 else '@ntnu.no')
        self.list_email = self.ntnu_email if randint(0, 10) == 0 else faker.ascii_email()
        self._class = "kull" + str(randint(20, 26))
        self.profile_picture = r"https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg"
        self.about = faker.text(150).replace('\n', ' ') # bad solution, pls fix
        self.website = faker.url()
        self.public_email = self.ntnu_email if randint(0, 10) == 0 else faker.ascii_email()
        self.is_active = "true"
        self.birthday = '' + str(randint(1998, 2008)) + '-' + str(randint(1,13)).zfill(2) + '-' + str(randint(1,29)).zfill(2)
    def toSQL(self):
        return f"    ('{self.username}', '{self.supabase_id}', '{self.ntnu_email}', '{self.list_email}', '{self.first_name}', '{self.last_name}', '{self._class}', '{self.profile_picture}', '{self.about}', '{self.website}', '{self.public_email}', {self.is_active}, '{self.birthday}')"

def generate_users():
    users = set()


with open(FILE_PATH, 'w') as file:
    file.write("-- Seed-file generated via seed.py in supabase/seed-seed\n")
    file.write("\n")
    file.write("-- Users\n")
    file.write("INSERT INTO nablaweb_vue.nabla_users(\n")
    file.write("    username, supabase_id, ntnu_email, list_email, first_name, last_name, class, profile_picture, about, website, public_email, is_active, birthday\n")
    file.write(") VALUES\n")
    
    admin = User()
    admin.username = 'admin'
    admin.first_name = 'Admin'
    admin.last_name = 'Adminsdotter'
    admin.ntnu_email = 'admin@stud.ntnu.no'
    file.write(admin.toSQL() + ',\n')

    user = User()
    user.username = 'user'
    user.first_name = 'User'
    user.last_name = 'Userssønn'
    user.ntnu_email = 'user@stud.ntnu.no'
    file.write(user.toSQL() + ',\n')

    for i in range(N_USERS - 2):
        new_user = User()
        users[new_user.username] = new_user
        file.write(new_user.toSQL() + (',\n' if i < (N_USERS - 3) else ';\n'))

    file.write("\n")
    file.write("-- Admins\n")
    file.write('INSERT INTO nablaweb_vue.nabladmins("user", reason, "date")\n')
    file.write("VALUES ('admin', 'administration', '1943-03-20');\n")

    file.write('\n')
    file.write('-- Log-in-able users\n')
    file.write('INSERT INTO auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_super_admin, encrypted_password, created_at, updated_at, last_sign_in_at, email_confirmed_at)\n')
    file.write('VALUES\n')
    file.write(f"    ('{admin.supabase_id}', '{admin.supabase_id}', 'authenticated', 'authenticated', '{admin.ntnu_email}', '{{\"provider\":\"email\",\"providers\":[\"email\"]}}'::jsonb, '{{\"dev\": true}}'::jsonb, false, crypt('{admin.username}', gen_salt('bf', 10)), now(), now(), now(), now()),\n")
    file.write(f"    ('{user.supabase_id}', '{user.supabase_id}', 'authenticated', 'authenticated', '{user.ntnu_email}', '{{\"provider\":\"email\",\"providers\":[\"email\"]}}'::jsonb, '{{\"dev\": true}}'::jsonb, false, crypt('{user.username}', gen_salt('bf', 10)), now(), now(), now(), now());\n")
    file.write('INSERT INTO auth.identities (id, provider, provider_id, user_id, identity_data, last_sign_in_at, created_at, updated_at)\n')
    file.write('VALUES\n')
    file.write(f"    ('{admin.supabase_id}', 'email', '{admin.ntnu_email}', '{admin.supabase_id}', '{{}}'::jsonb, now(), '1943-03-20'::timestamp, now()),\n")
    file.write(f"    ('{user.supabase_id}', 'email', '{user.ntnu_email}','{user.supabase_id}', '{{}}'::jsonb, now(), '1943-03-20'::timestamp, now());\n")
    
    file.write('\n')
    file.write('-- Groups \n')

