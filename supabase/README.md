# Supabase setup
We define the database layout in `schemas` declaratively in SQL. It is what 

## Updating schemas
Once you update the schemas you'll need to rebuild the database. This can be done once you've started the database using
```shell
supabase db reset
```
To update the typescript types to be updated, you can run
```shell
supabase gen types typescript --local > src/lib/types/database.types.ts
```
This connects to the running database, and exports the type to the typefile the supabase client in `/src/lib/supabaseClient.ts` uses for type checking the whole database.

## Updating remote
You can diff your local database and save to a file by saving a migration (or a database dump) in `migrations`, and running
```shell
supabase db diff -f [your_name_for_the_migration]
```
This will make a new migration in the same directory. It can be looked at, or copied over to prod. Please please please make sure you don't insert dev data into prod, unsure how we should be dealing with this.

This is not a particularly clean solution, uploading remote like this will be painful. Supabase seems to really prefer referencing a remote database. In the long run, we might want to set up the server so that the dev database just copies the schemas from prod. That way we'd be fighting the Supabase CLI a lot less, and updating the database on the server would be a lot easier.