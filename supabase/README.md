# Supabase setup
We define the database layout in `schemas`.

## Updating remote
You can diff your local database and save to a file by saving a migration (or a database dump) in `migrations`, and running
```shell
supabase db diff -f [your_name_for_the_migration]
```
This will make a new migration in the same directory. It can be looked at, or copied over to prod. Please please please make sure you don't insert dev data into prod, unsure how we should be dealing with this.

This is not a particularly clean solution, uploading remote like this will be painful. Supabase seems to really prefer referencing a remote database. In the long run, we might want to set up the server so that the dev database just copies the schemas from prod. That way we'd be fighting the Supabase CLI a lot less, and updating the database on the server would be a lot easier.