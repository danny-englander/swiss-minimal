# Handoff: build a mini Astro demo site for Swiss Minimal

Hi Claude Code. Danny wants a small Astro site that proves the **Swiss Minimal** design kit works as a drop-in for any new project, with every interactive piece working: the slide-down menu, nested accordions, the light/dark toggle, filter buttons, the scrolling title and the toast.

This is a test bed, not a real product. Keep the content neutral and short.

## Read first

1. `DESIGN.md`: the brand book (principles, colors, type, layout, motion, accessibility, the "Do not" list). Follow it exactly.
2. `COMPONENTS.md`: markup and rules for each of the 22 components.
3. `kit/example.html`: open it in a browser. This is what "correct" looks like.

## What's in this folder

```
Swiss-minimal/
  HANDOFF.md        this file
  DESIGN.md         the rules
  COMPONENTS.md     markup per component
  tokens.json       token values as data (the source of truth)
  fonts/            Overused Grotesk variable font + LICENSE.txt (keep together)
  kit/
    tailwind.css    Tailwind v4 entry: Tailwind + theme.css (components layer) + token utilities
    theme.css       tokens + components, plain CSS, font url is ../fonts/
    panel.js        slide-down panel behavior (tabs too), vanilla JS
    new-dot.js      "new" dot on the menu button and a tab
    drawer.js       the second, non-modal slide-down panel
    jump.js         jump to the current item from a bottom bar
    favorites.js    favorite stars, saved on the device
    example.html    one-page demo (theme.css only, no Tailwind)
    astro/          BaseLayout, Hero, MenuButton, MenuPanel, MenuItems, ThemeToggle,
                    Drawer, DrawerButton, FavoriteButton, FeaturesList, types.ts
  demo/             (you create this: the Astro site)
```

## Setup

1. Create a new Astro project in a `demo/` subfolder of this folder, with the minimal/empty template and TypeScript strict. Use the current stable Astro (it needs Node 22.12 or later). Add Tailwind v4 (`tailwindcss` and `@tailwindcss/vite`, plugin in `astro.config.mjs`). No React and no other integrations.
2. Copy `kit/` and `fonts/` into `demo/src/design/` so the paths stay relative:
   ```
   src/design/kit/...
   src/design/fonts/...
   ```
   `kit/theme.css` loads `../fonts/OverusedGrotesk-VF.woff2`, `kit/astro/BaseLayout.astro` preloads `../../fonts/…`, and `kit/astro/MenuPanel.astro` imports `../panel.js`. Keep that structure and these imports just work.
3. Create `src/styles/global.css` with `@import "../design/kit/tailwind.css";` and import it in the site's layout. Write page layout as Tailwind utilities, and use the kit classes for components (see "With Tailwind v4" in `DESIGN.md`).
4. Do not edit the files in `src/design/` unless something is broken. If you must change one, tell Danny what and why, because the same change belongs back in the design system.

## Pages to build

Define the menu once (e.g. `src/data/menu.ts`) as a `MenuItem[]` and pass it to `BaseLayout` on every page. Mark the current page with `current: true` so it gets the red underline.

```ts
[
  { label: 'Home', href: '/' },
  { label: 'Work', children: [
      { label: 'All work', href: '/work' },
      { label: 'Projects', children: [
          { label: 'Field notes', href: '/work/field-notes' },
          { label: 'A type specimen', href: '/work/type-specimen' },
      ] },
  ] },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '#contact' },
]
```

1. **Home (`/`)**: `display` hero with the name "Swiss Minimal" stacked on two lines, a `lead` line under it. Then one section with a 2px rule, `h2`, and 5 to 6 numbered list rows (`.row`), one marked `data-active="true"` with the equalizer (`.eq`) in its end slot.
2. **Work (`/work`)**: the filter pattern. A `.page-acc` accordion holding `.chip` buttons (All, Writing, Design & code, Tools) with counts, above 2 to 3 sections of rows. Clicking a chip hides rows that don't match and any section left empty, keeps the original row numbers, updates the accordion's status line ("Writing · 3 items"), writes `?category=writing` to the URL (read it back on load), and announces "Showing 3 Writing items" in a polite `sr-only` live region outside the accordion.
3. **Two project pages** (`/work/field-notes`, `/work/type-specimen`): a dynamic route or two plain pages. Each has an `h2` title, a `small muted` meta line, a couple of paragraphs, and a "Site ↗" external link using the font's own arrow (opens in a new tab, announces "(opens in a new tab)" to screen readers).
4. **About (`/about`)**: `lead` paragraph and body copy, so the type scale can be checked on running text.
5. **Contact (in the panel)**: put a form in `BaseLayout`'s `panel` slot with `id="contact"`: underline fields (`.field-label`, `.field`) for name, email and message, and a `.btn` "Send". On submit (no backend; just `preventDefault`), close the panel with `document.dispatchEvent(new Event('menu:close'))` and show a `.toast` ("Message sent. Thank you.") for about 4 seconds.

Add a **fixed bottom bar** on every page (a dark `--bar` strip, `--bar-h: 5rem`) holding a long title in a `.marquee`, so the scrolling title can be tested and the panel and toast can be seen stopping above the bar. Pass `barHeight="5rem"` to `BaseLayout`; it sets `--bar-h` and reserves the space at the bottom of the page. Use the `scrollTitle()` function from `COMPONENTS.md` (Marquee). It runs three rounds then stops, and not at all with Reduce Motion.

## Rules that matter most

- One typeface, weights 400, 500, 700 only. Nothing under 14px.
- No shadows, gradients (except the marquee edge fade), rounded corners, input boxes, icon libraries or decorative images.
- Brand red: `--accent` for large shapes and the focus ring only. Small red text uses `--accent-text` on the page and `--accent-bright` on dark surfaces.
- All caps only for one or two words.
- Focus rings visible everywhere; hand cursor on everything clickable.
- Mobile first: rows stack on phones and become a grid from 768px.

## Check before you call it done

Test in a real browser at about 390px and 1280px wide, in both light and dark.

- [ ] Menu button opens the panel; the top bar turns dark with it; the page behind doesn't scroll.
- [ ] Focus moves into the panel on open and back to the menu button on close. Tab can't reach the page behind.
- [ ] Escape closes it. Clicking an in-page `#` link in the menu closes it.
- [ ] Panel tabs: every tab is a Tab stop; arrows, Home and End move; `#contact` in the URL opens the Contact tab; Back closes the panel.
- [ ] "New" dot: none on a first visit; shows for a returning visitor; opening the Features tab clears it.
- [ ] Hover labels show under the top-bar buttons after a pause (not on a phone); the last one stays on screen.
- [ ] Drawer: page stays clickable but doesn't scroll; a click outside closes it and still works; the menu and drawer close each other; the round arrow shows while the list overflows.
- [ ] Favorites: the star never opens its row; the Favorites filter shows only starred items.
- [ ] Jump: scroll the current item away (or filter it out) and the triangle in the bottom bar brings it back and focuses it.
- [ ] Accordions: only one open per level; nested level works; plus becomes minus.
- [ ] Current page is underlined in red in the menu.
- [ ] Theme toggle switches and remembers; reloading in dark shows no flash of light.
- [ ] Filters: hide/show, keep numbers, status line updates, URL updates and is read on load, live region announces.
- [ ] Contact form: submit closes the panel and shows the toast above the bottom bar.
- [ ] Long title in the bottom bar scrolls three rounds, then rests with an ellipsis.
- [ ] With Reduce Motion on (macOS: System Settings > Accessibility > Display), nothing slides or loops.
- [ ] `npm run build` passes with no errors or warnings.

When you finish, give Danny the command to run it (`npm run dev`), a short list of anything you had to change in `src/design/`, and anything in the kit that felt awkward to use. Those notes go back into the design system.
