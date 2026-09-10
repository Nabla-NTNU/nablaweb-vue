# Supabase setup

We define the database layout in `schemas` declaratively in SQL. This is possibly not ideal, as it gets in the way of the migration system. If someone reads this, please look into if there are better solutions.

## Updating local schemas

Once you update the schemas you'll need to rebuild the database. This can be done once you've started the database using

```shell
supabase db reset
```

To update the typescript types to be updated, you can run

```shell
supabase gen types typescript --local > src/lib/types/database.types.ts
```

This connects to the running database, and exports the type to the typefile the supabase client in `/src/lib/supabaseClient.ts` uses for type checking the whole database.

## Connecting to remote

This is poorly documented by Supabase. Since we don't want the database on the open web, you have to first open a port from your machiene to the server by (for example) running

```sh
ssh -L 6543:localhost:5432 euklid
```

The `--db-url` connection string to make the supabase-CLI work is then `postgresql://[postgres user]].[POOLER_TENANT_ID]:[POSTGRES_PASSWORD]@localhost:6543/postgres`. This also allows database-level access to both `psql`, but use this sparingly.

## Updating remote

This should probably be done using migrations. Don't see a clean solution that both keeps a declarative schema in the repo _and_ lets us push cleanly to the remote db. Please fix.

## Seeding remote

Should be done, haven't found a good solution. Please fix.
