# `seed.sql` generator

# DOES NOT WORK YET (created users are impossible to log in to)

Not really a dependancy unless you want to make a new `seed.sql`, was just a bit tired of js/ts/npm.

You're probably familiar with pipenv / anything, we're only using `python3.13`, `numpy`, and `faker`.

```shell
pipenv install
pipenv sync --dev
pipenv run python seed.py
```

When this works, the following (could be set as an npm script) will seed the file correctly.

```shell
psql postgres://postgres:postgres@localhost:54322/postgres -f ./supabase/seed.sql
```
