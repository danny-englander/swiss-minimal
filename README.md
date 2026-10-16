# Swiss Minimal

A Swiss / Bauhaus design kit for Astro and Tailwind v4: type-led, flat color, thick rules, one typeface.

Each site picks one accent: red (the default) or teal, with `<BaseLayout accent="teal">` or `<html data-accent="teal">`. See Color in [`DESIGN.md`](DESIGN.md).

- [`DESIGN.md`](DESIGN.md): the rules (color, type, layout, images, motion, accessibility, Tailwind setup).
- [`COMPONENTS.md`](COMPONENTS.md): markup and rules for each component.
- [`TOOLING.md`](TOOLING.md): recipes for accessibility tests (Playwright and axe) and date-tagged releases.
- [`kit/`](kit): `tailwind.css`, `theme.css`, small plain scripts (`panel.js`, `new-dot.js`, `drawer.js`, `jump.js`, `favorites.js`, `icon-controls.js`) and the Astro components.
- [`fonts/`](fonts): Overused Grotesk (SIL OFL 1.1).
- [`demo/`](demo): a small Astro site that uses every component.

## Run the demo

Needs Node 22.12 or later (`demo/.nvmrc` pins 24).

```bash
cd demo
nvm use
npm install
npm run dev
```

## Test the demo

Builds the demo and scans every page, the menu tabs and the drawer for WCAG 2.1 AA problems in light and dark. See [`TOOLING.md`](TOOLING.md).

```bash
cd demo
npx playwright install chromium
npm test
```
