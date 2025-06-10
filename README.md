# Installation for local dev
In short, you'll need to install the Supabase CLI, start the supabase server, seed it, install the node packages, and start node server before you can see the local website on your machiene.

### Git
If this is new - see the wiki (and we shoud write a wiki entry on this). Most likely this entails navigating to your directory of choice by your `cd`'s and `ls`'es, and running
```shell
git clone https://github.com/Nabla-NTNU/nablaweb-vue.git
```
Please do not commit to main, but please do send pull requests when they're ready.

### Supabase
You'll need to install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows&queryGroups=access-method&access-method=postgres), which we use to run the local database referenced by `.env.loval`. In case of uncertainty, follow [their guide](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows&queryGroups=access-method&access-method=postgres).

Note that Docker is a dependancy for running the supabase server without interferring with your machiene. As of May 2025, supabase requires Windows and MacOS users to have [Docker Desktop](https://docs.docker.com/desktop/) (yes, including the GUI unfortunately), available both as an app from the linked website, as well as a [homebrew cask](https://formulae.brew.sh/cask/docker). On linux you'll find Docker in your favourite package repository.

Then you can run the following to start the database server:
```shell
supabase start
```
This will take a while on the first run as the process downloads and installs everything. When finished, it prints out a bunch of links. When successfully started, the Supabase CLI prints out a bunch of URL's. Of these the Studio URL is most interesting: by going to [http://localhost:54323](http://localhost:54323) you'll be able to see their frontend to your local database, add users, etcetera. You can also log onto the database directly in an SQL interface by entering the docker container and connecting to the database through `psql` as user `postgres`, but that is beyond the scope of this `README`. As of today I think the schema in this repo should be the source of truth as to how the database looks, so note that any changes in your Supabase Studio or the database are very much local to your machine. See the `README` in the `supabase` directory for more.

You'll then need to seed the database with random data, as an empty website is hard to work on, and just kind of boring. This is done by the `src/lib/seedDatabase.ts` script, which is for your convenience also run by
```shell
npm run seed
```

You can rebuild the database from the ground up (if you're changing the chema in-code) by 
```shell
supabase db reset
```
, and stop the database and delete all data by
```shell
supabase stop --no-backup
```

### Node
Mase sure you have the node package manager `npm` on your system. Then, you can install the node packages we use by
```shell
npm install
```
When complete, a quick
```shell
npm run dev
```
will start up the server, and you'll see this beautiful thing we're working on on [http://localhost:5173/](http://localhost:5173/)!

When seeding we add user `admin` with password `admin` who has all the privillages us other WebKom devs do, and user `user` with password `user`  who has regular nablauser access.

# repoet for Farger og fonter til Nabla

Repoet bruker fontene Poppins, Lato og Zilla Slabs.

- Poppins skal brukes for titler og undertitler
- Lato skal brukes på undertitler og all brødtekst
- Zilla Slabs har hemmelig bruksområde ;)

Fontene er litt begrenset med tanke på fontvekt(hvor thicc skriften er), men jeg tror det skal duge, sjekk ut tailwind.config.js, her ligger alle fargene og fontstørrelser/-regler man skal forholde seg til.

Etterhver kommer det spacing og høyder og bredder på elementer. Notasjonen er litt weird, men korteste versjonen er slik:

I et element, her en div, kan man skrive:
```
<div class="text-title-1 font-poppins bg-primary-900 text-primary">Hei!</div>
```

Her får teksten den selvdefinerte størrelsen title-1, fonten Poppins, bakgrunnsfargen primary 900, og tekstfargen primary DEFAULT. Fargene og tekststørrelsen er definert i tailwind.config.js, som henter variabler fra globals.css. Det er ekstremt mye tekst for tilsynelatende lite endringer, men det er verdt det! Det finnes snarveier for å unngå repetisjon på mye, som jeg håper å få implementert snart.

Lek litt rundt med App.vue og prøv å lage egne komponenter du kan bruke på siden i mappen components.




<!--
TODO (non-critical)
    - Show errors in UI
        - Better try-catch loops in composables pls
        - Button success state
        - Text banner on non-local error
    - Add place to edit group name / group logo
    - choose tilitsvalgt 
    - clean tailwind.config.js
    - actually implement and respect loading & states
    - get ESLing working (eslint-plugin-vue)
    - get pre-commit working (lint-staged)
    - Unit tests :((
    - animation for changing leader would be lit
        - mby a thank you for your service meme gif?
    - Fix header/footer links (& simplify?)
-->