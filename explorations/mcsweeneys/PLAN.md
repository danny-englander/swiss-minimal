# Plan: two kits, one repository, two sites

Decided: Fleuron lives in this repository, on `main`, beside Swiss Minimal. Each kit has its own site on Netlify, built from its own folder. No long-lived branches, so nothing is ever merged between themes.

## One source for every file

Every file is edited in exactly one place. People still use a kit by copying one complete folder, so each kit folder holds copies of the shared files, but a script makes those copies; nobody makes them by hand.

```
shared/             edited here only: the plain scripts and the Astro components both kits use
kit/                Swiss Minimal kit: theme.css, tailwind.css, its own components, + synced copies
fonts/              Swiss Minimal fonts (unchanged)
demo/               swissminimal.ch; src/design/kit and src/design/fonts are links, not copies
fleuron/
  kit/              fleuron.css, tailwind.css, its own components, + synced copies
  fonts/            Cormorant's two variable woff2 files, Courier Prime, and their licenses
  DESIGN.md, COMPONENTS.md, tokens.json
fleuron-demo/       Fleuron's site; src/design/kit and src/design/fonts are links
kits.json           the list of kits: folder, demo folder, tag prefix, shared files left out
scripts/sync.ts     copies shared/ into every kit listed in kits.json
explorations/       this folder; deleted once fleuron/ exists
```

**What goes in `shared/`.** The plain scripts (`panel.js`, `drawer.js`, `dialog.js`, `new-dot.js`, `jump.js`, `file-pick.js`, `output.js`, `favorites.js`, `icon-controls.js`, `marquee.js`), `astro/types.ts`, and every Astro component whose markup is the same in both kits (most of them: their look comes from the theme's CSS, not the markup). `marquee.js` goes too, though Fleuron drops the scrolling title, since the Swiss kit still needs it; `sync.ts` takes a short list per kit of what to leave out.

**What stays in each kit.** Its theme CSS, `tailwind.css`, its fonts and docs, and the components whose markup differs: in Fleuron, Hero becomes Masthead, PageTitle becomes the article opening, and Footer changes; it adds a drop cap, contents list and pull quote. The two themes' CSS stays separate on purpose: they share token names and cover the same parts, but the rules differ (thick rules and black bars against double rules and plates, caps against small caps). If, once both have settled, a block of CSS turns out to be the same in both (focus, reduced motion, layout basics), it moves to `shared/` the same way.

**The sync script.** `npm run sync` (in the repository root) reads a list of kits from one small file, `kits.json`: each kit's folder, its demo folder, its release tag prefix, and the shared files it leaves out. Nothing in the script names a kit, so a third kit is one more entry, not a code change. It copies each file in `shared/` into every kit's folder (`kit/`, `fleuron/kit/`, …), keeping the paths (`shared/astro/Drawer.astro` → `kit/astro/Drawer.astro`). Each copy starts with a comment: "Made from shared/panel.js by npm run sync. Edit that file, not this one." A test runs the sync in check mode and fails if any copy differs from its source, so a missed sync fails the tests, not the site. The relative paths inside shared files (`../panel.js`, `../../fonts/…`) must work from every kit folder; every kit has the same layout (`kit/` beside `fonts/`), so they do.

**The demos link, not copy.** `demo/src/design/kit` becomes a symbolic link to `../../../kit`, and `demo/src/design/fonts` to `../../../fonts`; `fleuron-demo` links to `fleuron/kit` and `fleuron/fonts`. That removes the copy `CLAUDE.md` warns about today ("the kit exists twice"). Netlify clones the whole repository even with a base directory set, so the links resolve in its builds. To check first: that Astro, Vite and Tailwind's `@source` scanning all follow the links in `astro dev` and in a Netlify build. Try it on the Swiss demo before anything else; if a link misbehaves, the fallback is a `predev`/`prebuild` step that copies the kit in, still generated, never hand-edited.

So a fix to `panel.js` is one edit in `shared/`, one `npm run sync`, and one commit; both kits, both demos and both sites have it.

**Docs.** The root `README.md` becomes a short front page for both kits. `DESIGN.md`, `COMPONENTS.md` and `tokens.json` at the root stay Swiss Minimal's (moving them would break links); Fleuron's are in `fleuron/`. `CLAUDE.md` gains a line on which kit a task is about.

## The Fleuron demo site

Decided: the demo is a pretend literary quarterly, front and center, like the mockup. It has the same set of pages as the Swiss demo, so every component is shown and tested, but the front of the site reads as the quarterly and the kit's own pages sit behind it as "back matter", written plainly.

| Swiss demo page | Fleuron demo page |
| --- | --- |
| Home | The current issue: masthead, "In this issue", the lead article's opening |
| Work, Work detail | The contents of an issue, and each piece as an article (drop cap, pull quote, footnotes) |
| About | About the quarterly, in its own deadpan voice |
| Components | Back matter: every component, plainly labeled |
| Forms | Back matter: every field and control, perhaps dressed as a subscription or letters page |
| Agents | Back matter: how to use the kit with AI agents |

The pieces are written for the demo: no real McSweeney's text, names or marks.

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
- Fleuron: `git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- . ../fleuron`

A fix in `shared/` changes the synced copies in both `kit/` and `fleuron/kit/` in the same commit, so it rebuilds both, which is what we want.

## Releases

Today `npm run release` in `demo/` tags `v2026.10.21` and publishes a GitHub Release. With two kits the tags need a name so they don't collide:

- Swiss Minimal keeps `v…` (the existing tags stay valid), or switches to `swiss-v…` from now on.
- Fleuron uses `fleuron-v2026.11.02`.
- One release script serves every kit. It takes the kit's name (`npm run release -- fleuron`), looks up its demo folder and tag prefix in `kits.json`, reads that demo's own `features.ts`, and only looks at tags with that prefix to find the last release. Each demo's `npm run release` passes its own name, so running it from a demo folder works as it does today.

Each release is still pushed from `main`, and the owner still approves each one.

## Adding another kit

Once the steps below are built, a new kit (say `bauhaus`) is a pattern to follow, not a redesign of the repository. Behavior fixes in `shared/` reach it like the others, and nothing is merged between kits.

**The plumbing:**

1. Make `bauhaus/`: `kit/` with its theme CSS and `tailwind.css`, `fonts/` with each license beside its font, and `DESIGN.md`, `COMPONENTS.md` and `tokens.json` using the same token names as the other kits.
2. Add an entry to `kits.json`: folder, demo folder, tag prefix (`bauhaus-v`), and any shared files it leaves out. Run `npm run sync`.
3. Make `bauhaus-demo/` from another demo's setup, with `src/design/kit` and `src/design/fonts` linked to `bauhaus/`. List its pages in the shared test setup, so the axe and behavior tests cover it in both themes and every accent.
4. Give it `src/data/features.ts` and an `npm run release` that passes its name.
5. Create its Netlify site: base directory `bauhaus-demo`, build `npm run build`, publish `dist`, the "Ignore builds" command for its folders, and its address.
6. Add it to the root `README.md`, and to `CLAUDE.md` and `AGENTS.md` where they list the kits.

**The design work, which the plumbing doesn't do:**

- Tokens for light and dark, every text pairing checked for AA, and its accents named.
- Type: its fonts, weights and sizes, the smallest size it allows, and why.
- How each shared component looks in it; which it drops; which it adds (its own markup, in its own `kit/astro/`).
- Its principles and its "Do not" list.
- A mockup first, like this folder, before any of the above is built.

**What stays out of `shared/`:** theme CSS, fonts and docs, always. A component moves to `shared/` only when its markup is the same in every kit that has it; a kit that needs different markup keeps its own and leaves the shared one out in `kits.json`.

## Order of work

Each step is its own commit, and kit, docs and demo changes stay separate, as now.

1. Rename the repository on GitHub, then point the local remote at the new name and check that Netlify still shows it.
2. Link the Swiss demo to `kit/` and `fonts/` instead of copying them. Check `astro dev`, `npm test` and a Netlify deploy preview. This pays off on its own, before Fleuron exists.
3. Move the shared scripts and components to `shared/`, add `kits.json` (with Swiss Minimal as its only entry for now), `scripts/sync.ts` and its check, and sync them back into `kit/`. The Swiss kit's files are the same after this step; only where they are edited changes.
4. Make `fleuron/` from the exploration: `fleuron.css` with the tokens and component CSS, the fonts, its own components, the docs moved over from `explorations/mcsweeneys/`, and the synced copies.
5. Make `fleuron-demo/`: `demo/`'s setup (Astro, Tailwind, the axe and behavior tests), linked to `fleuron/`, with the mockup's pages as the first content.
6. Update `CLAUDE.md`, `AGENTS.md` and `TOOLING.md`: edit shared files in `shared/`, run the sync, and which kit a task is about.
7. Teach the release script to take a kit's name and read `kits.json`; give `fleuron-demo/` its own release.
8. Create the second Netlify site, add both "Ignore builds" commands, and choose Fleuron's address.
9. Rewrite the root `README.md` as the front page for both kits, and delete `explorations/`.
