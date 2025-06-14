# Testing

We run UI-tests (and probably will run other tests) via [Playwright](https://playwright.dev/docs/intro). These will most likely mostly live in a github action, however they can absolutely be run via

```shell
npx playwright test
```

with whatever arguments you wish. We test on all commonly available browsers, meaning some tests will fail if you don't have browsers installed.

The main attraction of writing tests is playwrights `codegen`. If you install it's toolchain via

```shell
npx playwright install --with-deps
```

you'll get all the browsers it can test on, and if you get your own local server (and db) going and run

```shell
npx playwright codegen
```

a chromium window will open where you can perform the actions you want the test to perform, and the code is written in a nearby window. I expect this is how a lot of our UI tests will run.

This all assumes a running instance of supabase of course, presumably a non-running supabase will kill a lot of your tests.

I've disabled the mobile viewport testing, however please reenable them ASAP, it's just past midnight and I can't be bothered figuring out the actual tests.

## Concurrency and DB-related testing

We've yet to find a good solution to writing tests that write to the DB and see what changes. As of right now the one test (group admin) only edits a single field in one of the tests, and ignores it if another test got to it first.

There must be a good solution to this, though unfortunately it may involve running a remote db. Or more likely, making the test make users for each device before testing. But that'll be in a hooooot second
