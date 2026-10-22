# Plan: two kits, one repository, two sites

Decided: Fleuron lives in this repository, on `main`, beside Swiss Minimal. Each kit has its own site on Netlify, built from its own folder. No long-lived branches, so nothing is ever merged between themes.

## Folders

Swiss Minimal stays where it is, so nothing that copies `kit/` today breaks. Fleuron gets two new folders.

```
kit/                Swiss Minimal kit (unchanged)
fonts/              Swiss Minimal fonts (unchanged)
demo/               swissminimal.ch (unchanged)
fleuron/
  kit/              fleuron.css, tailwind.css, astro/ (only components whose markup differs)
  fonts/            Cormorant Garamond woff2 files and Cormorant-OFL.txt
  DESIGN.md, COMPONENTS.md, tokens.json
fleuron-demo/       Fleuron's site: Astro + Tailwind v4, its own package.json and tests
explorations/       this folder; deleted once fleuron/ exists
```

**Shared scripts.** `panel.js`, `drawer.js`, `dialog.js` and the other plain scripts carry no styling. Fleuron uses them unchanged: `fleuron/kit/` holds a copy of each, checked with `diff` the same way `demo/src/design/kit/` is checked today. A fix is made in `kit/` and copied. Later, if copying gets tiresome, the scripts can move to a `shared/` folder; that is a bigger change, because people copy `kit/` as one folder.

**Shared Astro components.** Where a component's markup is the same and only its CSS differs (most of them), Fleuron copies the `.astro` file unchanged and the same `diff` check covers it. Components Fleuron changes (Hero becomes Masthead, PageTitle becomes the article opening, Footer) or adds (drop cap, contents list, pull quote) are its own files.

**Docs.** The root `README.md` becomes a short front page for both kits. `DESIGN.md`, `COMPONENTS.md` and `tokens.json` at the root stay Swiss Minimal's (moving them would break links); Fleuron's are in `fleuron/`. `CLAUDE.md` gains a line on which kit a task is about.

## Two Netlify sites

Both are linked to the same repository and both deploy from `main`. They differ only in the folder they build.

| | Swiss Minimal | Fleuron |
| --- | --- | --- |
| Base directory | `demo` | `fleuron-demo` |
| Build command | `npm run build` | `npm run build` |
| Publish directory | `dist` | `dist` |
| Production branch | `main` | `main` |
| Address | www.swissminimal.ch | to choose |

**Build only what changed.** Each site gets an "Ignore builds" command in Netlify (Site configuration, Build & deploy, Ignored builds), so a push that only touches the other kit doesn't redeploy it. Netlify runs it from the base directory; exit code 0 means "skip":

- Swiss Minimal: `git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- . ../kit ../fonts`
- Fleuron: `git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- . ../fleuron ../kit/*.js`

A fix to a shared script in `kit/` rebuilds both, which is what we want.

## Releases

Today `npm run release` in `demo/` tags `v2026.10.21` and publishes a GitHub Release. With two kits the tags need a name so they don't collide:

- Swiss Minimal keeps `v…` (the existing tags stay valid), or switches to `swiss-v…` from now on.
- Fleuron uses `fleuron-v2026.11.02`.
- `fleuron-demo/` gets its own `npm run release`, reading its own `features.ts`, and only looks at tags with its prefix to find the last release.

Each release is still pushed from `main`, and the owner still approves each one.

## Order of work

Each step is its own commit, and kit, docs and demo changes stay separate, as now.

1. Rename the repository on GitHub, then point the local remote at the new name and check that Netlify still shows it.
2. Make `fleuron/` from the exploration: `fleuron.css` with the tokens and component CSS, the fonts, and the docs moved over from `explorations/mcsweeneys/`.
3. Make `fleuron-demo/`: a copy of `demo/`'s setup (Astro, Tailwind, the axe and behavior tests), with the mockup's pages as the first content.
4. Add the `diff` check for the shared scripts and components to `TOOLING.md` and `CLAUDE.md`.
5. Teach the release script tag prefixes; give `fleuron-demo/` its own release.
6. Create the second Netlify site, add both "Ignore builds" commands, and choose Fleuron's address.
7. Rewrite the root `README.md` as the front page for both kits, and delete `explorations/`.
