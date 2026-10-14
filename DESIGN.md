# Swiss Minimal

A Swiss / Bauhaus look for any site: type-led, flat color, thick rules, almost no decoration. One typeface, a cream page, black ink, and a single brand red used sparingly. It works for a portfolio, a blog, a directory, a nonprofit or a product site; nothing in it assumes a subject.

## What to load

This folder is the standalone kit. Copy `kit/` and `fonts/` side by side into a project.

- `kit/theme.css`: every token (light and dark), the base styles and every component class, in plain CSS. Dark mode follows the system unless `<html data-theme="light|dark">` is set.
- `kit/panel.js`: the slide-down panel's behavior. Plain JavaScript, no dependencies.
- `kit/astro/`: BaseLayout, Hero, MenuButton, MenuPanel, MenuItems, ThemeToggle and the `MenuItem` type. No React, no Tailwind.
- `kit/example.html`: a one-page demo using only `theme.css`. Open it to see what "correct" looks like.
- `fonts/OverusedGrotesk-VF.woff2` and `fonts/LICENSE.txt` (SIL OFL 1.1). Keep the license beside the font.
- `tokens.json`: the token values as data. If a value in `theme.css` ever differs, `tokens.json` wins.

Put this in `<head>` before first paint so a saved theme does not flash:

```html
<script>
  try { var t = localStorage.getItem('theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch (e) {}
</script>
```

## Principles

- **Type does the work.** Big bold headings, small quiet labels, nothing decorative.
- **Flat.** No shadows, gradients, rounded corners or glass in the interface. The only curve the UI draws is the spinner. (One exception: a scrolling title fades at its edges; that fade hides text, it is not decoration.) Images are content and keep their own color and shapes; see Images.
- **One typeface, two weights.** Overused Grotesk at 700 (headings, names) and 500 (small labels). Body copy is 400. Never a third weight.
- **Thick rule, thin rule.** A 2px `ink` rule starts each section and ends the top bar. Rows are separated by a 1px `rule`.
- **One grid.** Section headings, list rows and descriptions share the same columns, so a range label sits over the numbers, the title over the names and the blurb over the descriptions.
- **Color is rare.** `accent` marks the one thing that matters on a screen: the primary action, the active item, the activity indicator.

## Content and voice

- Plain, short, declarative. "Send", "Menu", "All items". No exclamation marks, no emoji.
- **All caps only for one or two words** (tab names, button text, a tiny label like `ARCHIVE`). Anything longer is sentence case, because caps are slow to read.
- A filtered view always says what it shows: "All items", "Writing · 7 items".
- Write the site's name in `display`, weight 700, tight, stacked on two lines when large. There is no logo: the name set in type is the mark.

## Color

Light is the default. Dark keeps the same roles.

- Page: `paper` ground, `ink` text and thick rules, `muted` for secondary text, `rule` for thin dividers.
- **Red has three tokens, by size and ground.** `accent` is for large shapes and the focus ring only. Small red text on `paper` uses `accent-text`; small red text on a dark surface uses `accent-bright`. Never set small text in plain `accent` (3.9:1 on light `paper`).
- The filled button is `accent-text` with `accent-ink` text.
- **Dark surfaces stay dark in both themes.** The panel, the top bar while the panel is open, a bottom bar and the toast are `bar` with `bar-ink` text. These black blocks are what make the light page feel Swiss.
- Small labels on `bar` (a definition term, an accordion heading) are bold `accent-bright`, never faded white.
- List rows fill on hover and when active: `row-hover-bg` / `row-active-bg` with every piece of text (muted too) in `row-fg`. The active row also gets a 6px `row-edge` on its left (red in dark).
- Never add a color. A new state reuses these roles.

## Type

One family, `--font-sans` (Overused Grotesk, falling back to Helvetica Neue, Helvetica, Arial).

| Style | Use |
| --- | --- |
| `display` | Hero title, `clamp(4rem, 13vw, 10.5rem)`, 700, line height 0.88, -0.02em |
| `h2` | Section title, 2.25rem then 3rem from 768px, 700, -0.025em |
| `title` | A list item's name, 1.25rem then 1.5rem, 700, +0.01em |
| `lead` | Intro paragraph, 1.125rem then 1.25rem |
| `body` | Body copy, 1rem / 1.5 |
| `small` | Meta, sublines, counts, 0.875rem |
| `label` | 1 to 2 words, uppercase, 500, 0.08em |

- **14px is the floor.** Nothing is smaller.
- Add `.num` (tabular numerals) to any number that lines up in a column.
- Headings are tight, names slightly open. Never track body text.
- Long labels that would otherwise be caps take `.prose-sentence`.

## Layout

- Content width `page-max` (88rem), centered in `.page`, with `gutter` side padding (1rem, 2rem from 640px).
- Hero with generous space (`space-12`, `space-20` from 768px), then sections separated by `space-16`. A hero image takes its layout from its shape: square or portrait sits beside the text, 50/50 from 768px; landscape goes under the text at the full page width. Phones always stack, text first.
- Section header: 2px `ink` top rule, then the grid row (range label, `h2` title, blurb).
- List rows: 1px `rule` bottom border, `space-4` vertical padding. The row number sits `space-4` in from the left (1.25rem from 768px) so it stays clear of the active row's 6px edge.
- Mobile first. Rows stack on phones and become a column grid from 768px.
- If the site has a fixed bottom bar, set `bar-h` to its height and reserve that space at the bottom of the page. Without one, set `--bar-h: 0rem`.
- Everything is square: `radius-none`. `radius-round` is for the spinner alone.

## Iconography

- No icon library and no icon font. The plus/minus is two CSS bars (`.acc-icon`), the menu button is three CSS bars (`.burger`).
- Use real glyphs from the font where they exist: an external link is "Site ↗" with the font's own arrow at 1.3em of the label size.
- Keep icon strokes the same weight as the text beside them (2px).

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
- Only the activity indicator, the spinner, the panel, accordions and an overlong title move. A title scrolls three rounds at most, then stops.
- Always honor `prefers-reduced-motion`; `theme.css` switches slides, fades and loops off.

## States and accessibility

- Focus ring: 3px solid `accent` outline, 2px offset, on everything focusable. Never hide it.
- Hand cursor on everything clickable (`theme.css` sets it, since Tailwind v4 removes it from buttons).
- Hover keeps text readable: when a row or button fills, its text switches to the opposite color.
- Pressed filter buttons use `aria-pressed="true"`; the current page uses `aria-current="page"`.
- External links announce "(opens in a new tab)" to screen readers.
- Text at 14px or more, contrast 4.5:1 or better in both themes.

## Components

Every component is a plain CSS class in `kit/theme.css`; there is no JavaScript bundle. In short: **Top bar** (`.topbar`), **Outlined button** (`.topbar-btn`, `.burger`), **Filled button** (`.btn`), **Slide-down panel** (`.panel`, with `kit/panel.js`), **Menu** (`.menu-list`, `.acc`, `.submenu`), **Field** (`.field`), **Filter buttons** (`.chip`), **Page accordion** (`.page-acc`), **List row** (`.row`), **Scrolling title** (`.marquee`), **Toast** (`.toast`), **Activity indicators** (`.eq`, `.spinner`), **Image** (`.media`, `.figure`), **Hero** (`.hero`, `.hero--split`, `.hero--wide`).

## With Tailwind v4

Map the tokens after `@import "tailwindcss"` to get utilities like `bg-paper` and `text-ink`:

```css
@theme inline {
  --font-sans: "Overused Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
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
}
```

## Do not

- Add shadows, gradients, rounded corners or boxes around inputs.
- Use images as filler or background, round or frame them, or set text straight on them.
- Use a third weight, or text under 14px.
- Use plain `accent` for small text.
- Use all caps for more than a couple of words.
- Let text keep moving forever, or move at all with Reduce Motion on.
- Hide focus rings or drop the hand cursor.
- Pull in an icon font or icon set.

## License

Overused Grotesk by Bao Nguyen (RandomMaerks), SIL Open Font License 1.1: https://github.com/RandomMaerks/Overused-Grotesk. Free on any site as long as `fonts/LICENSE.txt` stays with it.
