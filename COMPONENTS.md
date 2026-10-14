# Swiss Minimal components

Markup and rules for each component. All classes live in `kit/theme.css`, which a Tailwind site loads through `kit/tailwind.css`. Add Tailwind utilities beside a kit class for layout and spacing (`class="field mb-7"`); the utility wins.

## TopBar

A sticky bar on `paper` that holds the site name, the menu button and the theme toggle, and ends in a 2px `ink` rule.

**Markup.** `<div class="topbar"><div class="page">` then a flex row with `border-bottom: 2px solid currentColor; padding: 0.75rem 0`. Left: the site name in `small` at weight 500. Right: a `.burger` and a `.topbar-btn--text` theme toggle, `space-2` apart.

**Behavior.** It is `position: sticky; top: 0; z-index: 50`. While the slide-down panel is open (`<html data-menu="open">`) it flips to `bar` / `bar-ink` so bar and panel read as one black block, and it stays above the panel (z-index 50 over 30) so the burger-turned-X stays reachable.

**Do.** Keep it to a name and two or three outlined buttons. **Don't.** Add a logo image, a shadow or a second rule.

## OutlinedButton

The quiet button: 1px border in `currentColor`, transparent, inverts on hover. Used in the top bar for Menu, the theme toggle and the burger.

- `.topbar-btn.topbar-btn--text`: a 2rem tall text button, 0.875rem, weight 500, uppercase, 0.1em tracking. One or two words only.
- `.topbar-btn.burger`: 2rem square, three 14×2px bars (`<i></i><i></i><i></i>`) that rotate into an X when `aria-expanded="true"`. No icon font.
- `.label-stack`: put every label a button can show in one grid cell (extra ones `aria-hidden`) so swapping "Dark"/"Light" never changes its width.

Hover fills with the bar's text color and swaps the text to its background (inside `.topbar` these are `--tb-fg` / `--tb-bg`). Give an icon-only button an `aria-label`.

## Button

The one filled button: `accent-text` fill, `accent-ink` text, bold uppercase with 0.15em tracking. It is the only place red fills a small area.

**Markup.** `<button class="btn">Send</button>`. Padding 0.9rem 1.8rem, no border, square corners. Hover brightens it slightly (`filter: brightness(1.12)`); `:disabled` drops to 60% opacity with a progress cursor.

**Use it** for the single primary action of a view (submit a form, start playback, subscribe). One per view. Everything else is an outlined button or a link.

**Don't** put it in plain `accent`, round it, or write more than two words on it.

## Panel

A full-width `bar` surface that slides down from the top bar when the burger is tapped. Home for the menu, and for things like a contact form or a legal page.

**Markup: three siblings in `<body>`.**

```html
<div class="topbar">… <button data-panel-button aria-expanded="false" aria-controls="panel" class="topbar-btn burger"><i></i><i></i><i></i></button> …</div>
<div id="panel" class="panel" data-panel role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" inert>
  <div class="panel-inner">…menu or content…</div>
</div>
<div data-panel-page>…the rest of the site…</div>
```

Load `kit/panel.js` (plain JavaScript, no dependencies). It:

- toggles `data-open` (a 550ms `--ease-out` slide), `aria-expanded`, `aria-hidden` and `inert`;
- makes `[data-panel-page]` inert while open, so no focus-trap code is needed;
- sets `<html data-menu="open">`, which flips the top bar dark and locks page scroll;
- moves focus to the first item on open and back to the burger on close;
- closes on the burger, Escape, a click on any `[data-panel-close]` link, or `document.dispatchEvent(new Event('menu:close'))`;
- with `<html data-panel-hash="menu">`, shows `#menu` in the URL while open so Back closes it and a shared link opens it.

The panel sits at z-index 30, under the top bar (50). Its bottom stops at `bar-h` (set by `BaseLayout`'s `barHeight`, `0rem` by default). Reduced motion turns the slide off. Small labels inside it are bold `accent-bright`.

## Menu

The menu inside the slide-down panel: big bold lines separated by thin rules. An item with sub-items is a native `<details>` accordion with a plus that becomes a minus; sub-items are indented under a 2px `accent-bright` rule. Accordions can nest.

**Markup.** `<ul class="menu-list">` of `<li>`s holding either `<a class="menu-link">` or `<details class="acc" name="menu"><summary>Label <span class="acc-icon" aria-hidden="true"><i></i><i></i></span></summary><div class="acc-body"><ul class="submenu">…</ul></div></details>`.

- **No JavaScript.** `<details>` gives keyboard support and open/closed state for free.
- **One open per level:** siblings share a `name`; each nested level needs its own unique `name`.
- **Current page:** `aria-current="page"` underlines in `accent-bright`.
- **Sizes:** top level `menu-item` (1.75rem, 2.25rem from 768px) bold; sub-items and nested headings `submenu-item` (1.25rem) medium. Hover turns text `accent-bright`.
- Two levels read well; three is the limit.
- Give in-page `#` links `data-panel-close` so the panel shuts.
- In Astro, `kit/astro/MenuItems.astro` renders this from a plain `MenuItem[]` array.

## Field

An underline-only text field in large type: no box, no radius, a 2px `currentColor` bottom border.

**Markup.** `<label class="field-label" for="x">Your name</label><input class="field" id="x">`. The label is 0.875rem, weight 500, uppercase, 0.1em tracking; the input is `field-input` (1.25rem) and inherits its color, so it works on `paper` and on a `bar` surface alike.

**Consumer provides** the label text, `id`/`for`, and any validation message (set it in `small` under the field). Placeholders sit at 45% of the text color: use them for examples, never instead of a label.

**Don't** add borders around the input or a background fill.

## FilterChips

A row of outlined buttons that narrows a list to one category. One choice at a time; the pressed one fills with `ink`.

**Markup.** A `<div class="chip-group" role="group" aria-label="Category">` of `<button class="chip" aria-pressed="true|false">Label <span class="chip-count">12</span></button>`. "All" comes first and is pressed by default.

- Sentence case, 1rem, weight 500; the count is 14px at 75% and tabular. Min height 2.75rem. Buttons wrap on a phone.
- Fold the row in a `PageAccordion` whose summary names the current choice ("All items", "Writing · 5 items").
- Hide rows that don't match (and any section left empty) but keep their numbers.
- Put the choice in the address (`?category=writing`), not a `#`.
- Announce the result in a polite live region outside the accordion: `<p class="sr-only" aria-live="polite">Showing 5 Writing items</p>`.

## PageAccordion

An accordion on the page itself (not in the panel), built on native `<details>`: a bold `accent-text` heading, a `muted` status line saying what is chosen, and a plus that becomes a minus.

**Markup.** `<details class="page-acc"><summary><span><span class="page-acc-title">…</span><span class="page-acc-status">…</span></span><span class="acc-icon" aria-hidden="true"><i></i><i></i></span></summary><div class="page-acc-body">…</div></details>`. Max width 36rem.

- Folded by default, so a filter row doesn't take a third of a phone screen.
- Keep the status line current, so a folded, filtered list never looks broken.
- No rule above it: the section below already starts with a 2px rule.

## ListRow

A section of numbered rows: a 2px `ink` rule, a header on the shared grid, then rows divided by 1px `rule` that fill on hover and when active.

**Markup.** `<li class="row">` (add `data-active="true"` for the current one) laid out by your page's grid, e.g. `grid-template-columns: 3rem 1fr 1.75rem`: a `.num.small.muted` number, a `title` name over a `small muted` subline, and an optional end slot (an activity indicator, an arrow).

- **One grid.** The section header uses the same columns, so the range label ("01–03") sits over the numbers and the `h2` over the names.
- The number sits `space-4` in from the left (1.25rem from 768px), clear of the active row's 6px `row-edge`.
- On hover and when active, the row fills (`row-hover-bg` / `row-active-bg`) and all text, muted included, turns `row-fg`. In dark mode the fill is a raised dark, never a cream slab, and the active row shows a red edge.
- Rows stack on phones; switch to columns from 768px.
- Keep the numbers when filtering; don't renumber.

## Marquee

One line that scrolls when it is too long to fit, the way music players show a long title. At rest it ends in an ellipsis; while moving, its ends fade.

**Markup.** `<span class="marquee" title="Full text"><span>Full text</span></span>`, then call `scrollTitle(el)` (below) when the text is set or changes.

```js
function scrollTitle(el) {
  var distance = el.scrollWidth - el.clientWidth;
  if (distance <= 4 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var pause = 2000, slide = Math.max(1500, (distance / 50) * 1000), total = 2 * pause + 2 * slide;
  var end = 'translateX(-' + distance + 'px)';
  el.dataset.scrolling = '';
  el.firstElementChild.animate([
    { transform: 'none', offset: 0 },
    { transform: 'none', offset: pause / total, easing: 'ease-in-out' },
    { transform: end, offset: (pause + slide) / total },
    { transform: end, offset: (2 * pause + slide) / total, easing: 'ease-in-out' },
    { transform: 'none', offset: 1 },
  ], { duration: total, iterations: 3 }).onfinish = function () { delete el.dataset.scrolling; };
}
```

- Only when it doesn't fit; short titles never move.
- Wait 2s, slide at 50px a second, wait 2s, slide back. **Three rounds, then stop** with the ellipsis (WCAG 2.2.2). Restart when the text changes.
- Never with Reduce Motion. Keep the full text in `title`.
- The edge fade is the one gradient the system allows.

## Toast

A short confirmation on a `bar` block with a 6px `accent-bright` left edge, bottom-left above any bottom bar.

**Markup.** `<div class="toast" role="status">Message sent.</div>`; set `data-show="true"` to fade it in (350ms) and remove it to hide. It sits at `left: gutter; bottom: calc(bar-h + 1rem)`, max 28rem wide, 1rem weight 500.

**Use** for one-line confirmations that need no action. Hide it after a few seconds. **Don't** stack several or put buttons in it.

## ActivityIndicators

Two small moving marks: the equalizer (`.eq`, three `accent` bars) says "this is live / playing now"; the spinner (`.spinner`, a 2px `currentColor` ring with one side open) says "loading".

**Markup.** `<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>` and `<span class="spinner" role="status" aria-label="Loading"></span>`.

- The equalizer marks the one active item in a list (put it in the row's end slot). It is decorative: pair it with text or `aria-current` for screen readers.
- The spinner is the only round shape in the system (`radius-round`).
- Both stop under Reduce Motion (the equalizer rests at 10px bars).

## Image

A photo, artwork or screenshot as a plain rectangle on the grid: square corners, no frame, no shadow, an optional caption below. The rules are under "Images" in `DESIGN.md`.

**Markup.** `<img class="media" src="…" alt="…" width="1600" height="1200">`, or with a caption:

```html
<figure class="figure">
  <img class="media media--4x3" src="…" alt="…" width="1600" height="1200" loading="lazy">
  <figcaption>Caption or credit, sentence case.</figcaption>
</figure>
```

- `.media` fills its column and shows a `rule` box until the image loads.
- Add `media--1x1`, `media--4x3`, `media--3x2` or `media--16x9` to crop to a fixed shape. Images in one list share a ratio.
- Always set `width`/`height` (or a ratio class) so nothing jumps; `loading="lazy"` on all but the hero.
- In Astro, use `<Image>` from `astro:assets` with `class="media"`; it adds the size and responsive sources.
- Captions are `small muted` (the `figcaption` style). Never put text on the image itself.
- **Don't** round it, outline it, tint it, or animate it on scroll.

## Hero

The top of a page: the name in `display`, a `lead` line, and an optional captioned image whose shape picks the layout.

- **Split** (`.hero--split`): a square (1:1) or portrait image. Text and image sit 50/50 from 768px; the `display` title steps down (`clamp(3.5rem, 8vw, 8rem)`) to fit its half.
- **Wide** (`.hero--wide`): a landscape image (3:2, 16:9). Title and lead above; the image runs the full width of `.page`.
- On phones both stack: text first, then the image and caption.

**Markup.**

```html
<header class="hero hero--split">
  <div class="hero-text">
    <h1 class="display">Swiss<br>Minimal</h1>
    <p class="lead hero-lead">One short line.</p>
  </div>
  <figure class="figure hero-figure">
    <img class="media" src="…" alt="…" width="2000" height="2000" fetchpriority="high">
    <figcaption>Caption or credit.</figcaption>
  </figure>
</header>
```

- No image: drop the figure and the modifier class.
- **In Astro**, `kit/astro/Hero.astro` does this for you. Import the image so Astro knows its size, and the component picks `split` or `wide` from it and renders `<Image>` from `astro:assets` with responsive sizes:

  ```astro
  ---
  import Hero from '../design/kit/astro/Hero.astro';
  import art from '../assets/art.jpg';
  ---
  <Hero lead="One short line." image={art} alt="What it shows" caption="Credit">
    <Fragment slot="title">Swiss<br />Minimal</Fragment>
  </Hero>
  ```

  Use `title="About"` instead of the slot for a one-line name, and `layout="split" | "wide"` to override the shape.
- The hero image loads eagerly with high priority; it is the one image on a page that is not lazy.
