# Nablaweb Router
This directory defines the layout of nablaweb's various pages. Index.js (would be nice to translate to typescript) lists all the different pages, and what pages are hidden behind a login wall. These are linked to `guards.ts` for readability's sake. Please refer to these for guidance, the documentation here is unfortunately a bit sparse.

We're using a param called `next`. This is technically no longer supported, rewriting shouldn't be that much work if they actually depricate this feature.