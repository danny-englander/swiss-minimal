# Swiss Minimal

A Swiss / Bauhaus look for any site: type-led, flat color, thick rules, almost no decoration. One typeface, a cream page, black ink, and a single accent, red or teal, used sparingly. It works for a portfolio, a blog, a directory, a nonprofit or a product site; nothing in it assumes a subject.

## What to load

This folder is the standalone kit, built for **Astro with Tailwind v4** (no React needed). Copy `kit/` and `fonts/` side by side into a project.

- `kit/tailwind.css`: the entry point for a Tailwind site. Imports Tailwind, loads `theme.css` into the `components` layer and maps the tokens to utilities. See "With Tailwind v4".
- `kit/theme.css`: every token (light and dark), the base styles and every component class, in plain CSS. It also works on its own, without Tailwind. Dark mode follows the system unless `<html data-theme="light|dark">` is set.
- `kit/panel.js`: the slide-down panel's behavior, tabs included. Plain JavaScript, no dependencies, like the other scripts: `new-dot.js` (the "new" dot), `drawer.js` (the second, non-modal panel), `jump.js` (jump to the current item), `favorites.js` (favorite stars) and `icon-controls.js` (icon buttons for rows built in the browser).
- `kit/astro/`: BaseLayout, Hero, PageTitle, Ellipse, MenuButton, MenuPanel, MenuItems, ThemeToggle, Drawer, DrawerButton, FavoriteButton, FeaturesList, IconTemplates (needs `astro-icon`) and the types (`MenuItem`, `PanelTab`, `NewDot`, `Feature`). They use Tailwind utilities for layout and the kit classes for components.
- `kit/example.html`: a one-page demo using only `theme.css`. Open it to see what "correct" looks like.
- `fonts/OverusedGrotesk-VF.woff2` and `fonts/LICENSE.txt`, and `fonts/SourceCodePro-VF.woff2` (for code) and `fonts/SourceCodePro-LICENSE.txt`, all SIL OFL 1.1. Keep each license beside its font.
- `tokens.json`: the token values as data. If a value in `theme.css` ever differs, `tokens.json` wins.

Put this in `<head>` before first paint so a saved theme does not flash:

```html
<script>
  try { var t = localStorage.getItem('theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch (e) {}
</script>
```

## Principles

- **Type does the work.** Big bold headings, small quiet labels, nothing decorative.
- **Flat.** No shadows, gradients, rounded corners or glass in the interface. The UI draws only five curves: the spinner, the "new" dot, the drawer's round "more below" arrow, the radio button and the `Ellipse` badge, all marks that must read as different from the square controls around them. (One exception: a scrolling title fades at its edges; that fade hides text, it is not decoration.) Images are content and keep their own color and shapes; see Images.
- **One typeface, two weights.** Overused Grotesk at 700 (headings, names) and 500 (small labels). Body copy is 400. Never a third weight. The one exception is code, which is set in Source Code Pro (see Type).
- **Thick rule, thin rule.** A 2px `ink` rule starts each section and ends the top bar. Rows are separated by a 1px `rule`.
- **One grid.** Section headings, list rows and descriptions share the same columns, so a range label sits over the numbers, the title over the names and the blurb over the descriptions.
- **Color is rare.** `accent` marks the one thing that matters on a screen: the primary action, the active item, the activity indicator, a chosen radio or a switch that is on.

## Content and voice

- Plain, short, declarative. "Send", "Menu", "All items". No exclamation marks, no emoji.
- **All caps only for one or two words** (tab names, button text, a tiny label like `ARCHIVE`). Anything longer is sentence case, because caps are slow to read.
- A filtered view always says what it shows: "All items", "Writing · 7 items".
- Write the site's name in `display`, weight 700, tight, stacked on two lines when large. There is no logo: the name set in type is the mark.

## Color

Light is the default. Dark keeps the same roles.

- Page: `paper` ground, `ink` text and thick rules, `muted` for secondary text, `rule` for thin dividers.
- **One accent per site: red or teal.** Red is the default. A teal site sets `<html data-accent="teal">` (in Astro, `<BaseLayout accent="teal">`). Only the four accent tokens change; paper, ink and the dark bars stay the same, and every rule below holds for either. A site never mixes the two, and visitors don't switch between them. (The demo has a gear on its right edge for previewing both; that switcher is demo-only, not a kit component.)
- **The accent has three tokens, by size and ground.** `accent` is for large shapes and the focus ring only. Small accent text on `paper` uses `accent-text`; small accent text on a dark surface uses `accent-bright`. Never set small text in plain `accent` (3.9:1 red, 3.5:1 teal on light `paper`).
- The filled button is `accent-text` with `accent-ink` text.
- **Dark surfaces stay dark in both themes.** The panel, the drawer, the top bar while either is open, a bottom bar and the toast are `bar` with `bar-ink` text. These black blocks are what make the light page feel Swiss.
- Small labels on `bar` (a definition term, an accordion heading) are bold `accent-bright`, never faded white.
- List rows fill on hover and when active: `row-hover-bg` / `row-active-bg` with every piece of text (muted too) in `row-fg`. The active row also gets a 6px `row-edge` on its left (the accent, in dark).
- Never add a color. A new state reuses these roles. A new accent must pass every contrast check red and teal pass (see `tokens.json`), and needs a dark version too.

## Type

One family, `--font-sans` (Overused Grotesk, falling back to Helvetica Neue, Helvetica, Arial). Code is the only exception: `code`, `pre`, `kbd` and `samp` use `--font-mono`: Source Code Pro at 400, falling back to the system's monospace (`ui-monospace`, SF Mono, Menlo, Consolas, Liberation Mono). It is not preloaded, so a page with no code never downloads it.

| Style | Use |
| --- | --- |
| `display` | Hero title, `clamp(4rem, 13vw, 10.5rem)`, 700, line height 0.88, -0.02em |
| `h2` | Section title, 2.25rem then 3rem from 768px, 700, -0.025em |
| `title` | A list item's name, 1.25rem then 1.5rem, 700, +0.01em |
| `lead` | Intro paragraph, 1.125rem then 1.25rem |
| `body` | Body copy, 1rem / 1.5 |
| `small` | Meta, sublines, counts, 0.875rem |
| `label` | 1 to 2 words, uppercase, 500, 0.08em |
| `code` | Code, file names, commands, keys: `--font-mono` at 0.9375em of the text around it, never under 0.875rem |

- **14px is the floor.** Nothing is smaller.
- Add `.num` (tabular numerals) to any number that lines up in a column.
- Headings are tight, names slightly open. Never track body text.
- Long labels that would otherwise be caps take `.prose-sentence`.
- Code is plain HTML, no class: inline `<code>` sits in the line with no tint behind it; a `<pre>` block is square with a 1px `rule` border and `space-4` padding, and scrolls sideways rather than wrapping (give a long one `tabindex="0"` so the keyboard can scroll it); `<kbd>` is outlined in `currentColor`, like the top-bar buttons. Monospace never goes beyond code: not for labels, numbers or headings.

## Layout

- Content width `page-max` (88rem), centered in `.page`, with `gutter` side padding (1rem, 2rem from 640px).
- Hero with generous space (`space-12`, `space-20` from 768px), then sections separated by `space-16`. A hero image takes its layout from its shape: square or portrait sits beside the text, 50/50 from 768px; landscape goes under the text at the full page width. Phones always stack, text first.
- Section header: 2px `ink` top rule, then the grid row (range label, `h2` title, blurb).
- List rows: 1px `rule` bottom border, `space-4` vertical padding. The row number sits `space-4` in from the left (1.25rem from 768px) so it stays clear of the active row's 6px edge.
- Mobile first. Rows stack on phones and become a column grid from 768px.
- If the site has a fixed bottom bar, set `bar-h` to its height and reserve that space at the bottom of the page (`BaseLayout`'s `barHeight` prop does both). Without one, `--bar-h` is `0rem`.
- A page that needs a name but no hero opens with a `PageTitle`: one big `h1` across the width of `.page`, on the paper or on a `bar` block.
- Everything is square: `radius-none`. `radius-round` is for five marks only: the spinner, the "new" dot (`.new-dot`), the drawer's "more below" arrow (`.drawer-more`), the radio button (`.radio`) and the oval badge (`.ellipse`, at 50%). The switch stays square.

## Iconography

- **Type and CSS come first.** Draw UI chrome in CSS: the plus/minus is two bars (`.acc-icon`), the menu button is three bars (`.burger`). Use the font's own glyphs where they exist: "Site ↗" (the arrow at 1.3em of the label size), the ▲ / ▼ of a jump button.
- **An icon set is allowed for two things only:**
  1. Third-party brand marks (YouTube, Spotify, Apple Music) where the mark is the clearest label. Use Simple Icons.
  2. A few action icons with no good glyph, such as copy and remove. Use Material Symbols, outline style.

  Load them with `astro-icon`, so each one is inlined as SVG at build time. No icon font, no icon CDN.
- **One color, always:** `currentColor`. That is `bar-ink` on dark surfaces and `ink` on the page. On hover it turns `accent-bright` (on `bar`) or `accent-text` (on `paper`). Never a brand's own colors, not even on its logo.
- **Sized to the text:** 1.25rem beside body text, 1.5rem for a lone row action. Outline icons, with strokes close to the text's 2px. Don't mix filled and outline icons in one row.
- **Hit area at least 36px square** (2.25rem), even when the icon is smaller.
- **Every icon-only control** gets a verb-first `aria-label` naming the action and its object ("Search on Spotify: *title* (opens in a new tab)", "Remove: *title*") and a `title` tooltip with the short form ("Search on Spotify"). The icon itself is `aria-hidden="true"`.
- **No icons for decoration**, none beside a text label that already says it, and no trash can: remove is a circled X.
- One custom mark (a star, a music note) may be a hand-drawn inline SVG under the same rules.

See IconActions in `COMPONENTS.md` for the markup.

## Images

Photos, artwork, screenshots and product shots are welcome. The test is whether the image is content: it shows the work, the person, the place or the thing the page is about. Filler is not: stock mood shots, background textures, patterns behind text.

- **Plain rectangles.** Square corners, no border, frame, shadow, overlay, tint or filter. The image's own edge is the edge.
- **On the grid.** An image spans whole columns and lines up with the text edges beside it. Inside the page it is never wider than `page-max`; a full-bleed image runs edge to edge with no gutter.
- **Fixed shapes.** Use one of 1:1, 4:3, 3:2 or 16:9 and crop to fill (`.media` with `--ratio`). Images in one list share a ratio.
- **Color stays.** An image keeps its own colors; they do not count as adding a color to the palette. Do not recolor or desaturate to match.
- **No text on images.** Titles and captions go beside or below. If text must sit on an image, put it on a solid `bar` block, never straight on the picture.
- **Captions** go below in `small muted`, left aligned, sentence case. Credits use the same style.
- **Dark mode.** Do not dim or invert images. A light image on the dark page reads as a light block, which is fine; if the art has a dark version, swap it with the theme.
- **Loading.** Give every image its width and height (or a ratio) so the page does not jump. The empty box fills with `rule` until it loads. Lazy-load everything except the hero.
- **Alt text** says what the image shows in one sentence. An image that only repeats the text beside it gets `alt=""`.
- **No motion.** No parallax, zoom-on-scroll, slow pan or auto-advancing carousel. A hover may swap the image; it never scales it.

## Motion

- Short and purposeful: 150ms hover swaps, 400 to 550ms slides with `--ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`).
- Only the activity indicator, the spinner, the panel and drawer, accordions and panel tabs, an overlong title and the jump flash move. A title scrolls three rounds at most, then stops.
- Hover labels wait 350ms before they show, so passing the pointer over the top bar doesn't flicker them.
- Always honor `prefers-reduced-motion`; `theme.css` switches slides, fades and loops off.

## States and accessibility

- Focus ring: 3px solid `accent` outline, 2px offset, on everything focusable. Never hide it.
- Hand cursor on everything clickable (`theme.css` sets it, since Tailwind v4 removes it from buttons).
- Hover keeps text readable: when a row or button fills, its text switches to the opposite color.
- Pressed filter buttons use `aria-pressed="true"`; the current page uses `aria-current="page"`.
- External links announce "(opens in a new tab)" to screen readers.
- A control's name says what it does, verb first: "Show Field notes in the list", "Remove: Field notes". A toggle keeps one name and uses `aria-pressed`.
- When a control is about to disappear with focus on it (a removed row, an arrow that hides once used), move focus to the next sensible place first.
- Remember things in localStorage only as a convenience: wrap every read and write, and make the page work the same without it.
- Text at 14px or more, contrast 4.5:1 or better in both themes.

## Components

Every component is a plain CSS class in `kit/theme.css` (loaded through `kit/tailwind.css`); there is no JavaScript bundle, only a few small plain scripts for the pieces that need behavior. In short: **Top bar** (`.topbar`), **Outlined button** (`.topbar-btn`, `.burger`), **Hover label** (`data-tip`), **Filled button** (`.btn`), **Slide-down panel** (`.panel`, with `kit/panel.js`), **Menu** (`.menu-list`, `.acc`, `.submenu`), **Panel tabs** (`.panel-tabs`, `.panel-tab`), **"New" dot** (`.new-dot`, with `kit/new-dot.js`), **Field** (`.field`), **Select** (`.select-wrap`, `.select`), **Switch** (`.choice`, `.switch`), **Radio** (`.choice-group`, `.radio`), **Filter buttons** (`.chip`), **Favorite star** (`.fav-btn`, with `kit/favorites.js`), **Page accordion** (`.page-acc`), **List row** (`.row`), **Jump to current** (`.jump-btn`, with `kit/jump.js`), **Scrolling title** (`.marquee`), **Toast** (`.toast`), **Drawer** (`.drawer`, with `kit/drawer.js`), **Icon actions** (`.icon-row`, `.icon-btn`, with `kit/icon-controls.js`), **Closing note** (`.closing-note`), **Dated list** (`.dated-list`), **Ellipse** (`.ellipse`, `.ellipse--solid`), **Activity indicators** (`.eq`, `.spinner`), **Image** (`.media`, `.figure`), **Hero** (`.hero`, `.hero--split`, `.hero--wide`), **Page title** (`.page-title`, `.page-title--bar`).

## With Tailwind v4

This is the default setup, and how Dial Hopping is built.

1. Install `tailwindcss` and `@tailwindcss/vite`, and add the plugin in `astro.config.mjs`:
   ```js
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({ vite: { plugins: [tailwindcss()] } });
   ```
2. Make one global stylesheet, e.g. `src/styles/global.css`, and import it in your layout:
   ```css
   @import "../design/kit/tailwind.css";
   /* site-only CSS below */
   ```
   Don't also `@import "tailwindcss"` or `theme.css` anywhere else; `tailwind.css` does both.
3. Pass `barHeight="5rem"` to `BaseLayout` if the site has a fixed bottom bar.

**Who does what.** Components with state, motion or several parts are kit classes (`.row`, `.chip`, `.panel`, `.toast`, `.hero`, `.media`, the type styles). Page layout is utilities in the markup: grids, spacing, widths, which column a piece sits in. Mix them freely: `class="row grid gap-y-1 md:grid-cols-[3rem_1fr_1.75rem]"`.

**Layers.** `theme.css` sits in Tailwind's `components` layer, so a utility always beats a kit class it is paired with (`class="field mb-7"` sets the margin). Your own unlayered CSS beats both.

**Token utilities.** Use these instead of raw colors, so light and dark both work: `bg-paper`, `text-ink`, `text-muted`, `border-rule`, `bg-bar`, `text-bar-ink`, `bg-accent` (large shapes only), `text-accent-text` (small accent text on the page), `text-accent-bright` (small accent text on `bar`), `bg-row-hover`, `bg-row-active`, `text-row-fg`, and `var(--bar-h)` as `h-(--bar-h)` / `pb-(--bar-h)`. Never `text-red-600`, `bg-black` or Tailwind's grey scale.

**Defaults that line up.** Tailwind's `sm` (640px) and `md` (768px) breakpoints are the kit's. Preflight clears margins on `p`, `h1`–`h6` and lists, so set spacing with utilities (`mb-5`, `[&>p]:mb-5` on a block of prose). Tailwind v4 drops the hand cursor on buttons; `theme.css` puts it back.

`kit/tailwind.css` maps the tokens like this:

```css
@theme inline {
  --font-sans: "Overused Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --font-mono: "Source Code Pro", ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-rule: var(--rule);
  --color-accent: var(--accent);
  --color-accent-ink: var(--accent-ink);
  --color-accent-text: var(--accent-text);
  --color-accent-bright: var(--accent-bright);
  --color-bar: var(--bar);
  --color-bar-ink: var(--bar-ink);
  --color-row-hover: var(--row-hover-bg);
  --color-row-active: var(--row-active-bg);
  --color-row-fg: var(--row-fg);
  --color-row-edge: var(--row-edge);
}
```

## Do not

- Add shadows, gradients, rounded corners or boxes around inputs.
- Use images as filler or background, round or frame them, or set text straight on them.
- Use a third weight, or text under 14px.
- Use a monospace (or any second family) for anything but code, or tint the background behind code.
- Use plain `accent` for small text.
- Use all caps for more than a couple of words.
- Let text keep moving forever, or move at all with Reduce Motion on.
- Hide focus rings or drop the hand cursor.
- Use an icon font, a brand's colors, or icons beyond brand marks and a few actions.

## License

Overused Grotesk by Bao Nguyen (RandomMaerks), SIL Open Font License 1.1: https://github.com/RandomMaerks/Overused-Grotesk. Free on any site as long as `fonts/LICENSE.txt` stays with it.

Source Code Pro by Paul D. Hunt for Adobe, SIL Open Font License 1.1: https://github.com/adobe-fonts/source-code-pro. Free on any site as long as `fonts/SourceCodePro-LICENSE.txt` stays with it.
