# Swiss Minimal components

Markup and rules for each component. All classes live in `kit/theme.css`, which a Tailwind site loads through `kit/tailwind.css`. Add Tailwind utilities beside a kit class for layout and spacing (`class="field mb-7"`); the utility wins.

## TopBar

A sticky bar on `paper` that holds the site name, the menu button and the theme toggle, and ends in a 2px `ink` rule.

**Markup.** `<div class="topbar"><div class="page">` then a flex row with `border-bottom: 2px solid currentColor; padding: 0.75rem 0`. Left: the site name at 1rem (16px) and weight 500. The bar sets `font-size: 1rem; line-height: 1.5` itself, so it stays that size when body text is larger. Right: a `.burger` and a `.topbar-btn--text` theme toggle, `space-2` apart.

**Behavior.** It is `position: sticky; top: 0; z-index: 50`. While the slide-down panel is open (`<html data-menu="open">`) it flips to `bar` / `bar-ink` so bar and panel read as one black block, and it stays above the panel (z-index 50 over 30) so the burger-turned-X stays reachable.

**Home link.** On a site with more than one page, the name links to the home page: `<a class="topbar-home" href="/">Site name</a>` inside that text. It is plain text in the bar's color, underlined on hover, and carries `aria-current="page"` on the home page itself. `BaseLayout` does this whenever it has a menu; pass `home="/en/"` for another home, or `home={false}` to leave the name unlinked. A one-page site keeps the name as plain text.

**Do.** Keep it to a name and two or three outlined buttons. **Don't.** Add a logo image, a shadow or a second rule.

## OutlinedButton

The quiet button: 1px border in `currentColor`, transparent, inverts on hover. Used in the top bar for Menu, the theme toggle and the burger.

- `.topbar-btn.topbar-btn--text`: a 2rem tall text button, 0.875rem, weight 500, uppercase, 0.1em tracking. One or two words only.
- `.topbar-btn.burger`: 2rem square, three 14×2px bars (`<i></i><i></i><i></i>`) that rotate into an X when `aria-expanded="true"`. No icon font.
- `.label-stack`: put every label a button can show in one grid cell (extra ones `aria-hidden`) so swapping "Dark"/"Light" never changes its width.

Hover fills with the bar's text color and swaps the text to its background (inside `.topbar` these are `--tb-fg` / `--tb-bg`). Give an icon-only button an `aria-label`.

## HoverLabel

A small label under a top-bar button saying what it does ("Menu", "Switch to dark theme"), for buttons whose look alone may not say it.

**Markup.** Add `data-tip="Menu"` to any `.topbar-btn`. CSS draws it from the attribute; no script.

- Shows after a 350ms pause on devices with a real hover (`@media (hover: hover)`), so it never sticks after a tap on a phone, and at once on `:focus-visible`.
- Colors are the bar's, reversed (`--tb-fg` fill, `--tb-bg` text), so it reads on the paper bar and on the dark one while a panel is open. 14px, weight 500, sentence case.
- Centered under its button; the last button in the group (`:last-of-type`) is right-aligned so its label never runs off the screen.
- Keep it in step with the button: `MenuButton`, `DrawerButton` and `ThemeToggle` update `data-tip` with their `aria-label` ("Menu" / "Close menu").

**Do.** Use the same words as the `aria-label`, or its short form. **Don't.** Put one on a link in running text, or write more than a few words.

## Button

The one filled button: `accent-text` fill, `accent-ink` text, bold uppercase with 0.15em tracking. It is the only place the accent fills a small area.

**Markup.** `<button class="btn">Send</button>`. Padding 0.9rem 1.8rem, no border, square corners. Hover brightens it slightly (`filter: brightness(1.12)`); `:disabled` drops to 60% opacity with a progress cursor.

**Use it** for the single primary action of a view (submit a form, start playback, subscribe). One per view. Everything else is a secondary button, an outlined button or a link.

**Don't** put it in plain `accent`, round it, or write more than two words on it.

## SecondaryButton

The button for every other action beside the one filled `Button`: a 1px outline in the text's color, sentence case, 1rem weight 500, at least 2.75rem tall. It fills with the text color on hover. Presets that fill in a form ("This month", "Last month"), the Choose… of a `FilePicker`, "Open in Finder" under a result.

**Markup.** `<button type="button" class="btn-outline">Last month</button>`. Several together go in `<div class="btn-group" role="group" aria-label="Date presets">`, which wraps on a phone.

- On a dark surface (panel, drawer, bottom bar, `page-title--bar`, a dark footer) it takes `bar-ink` and fills with it.
- It does what it says when pressed and keeps no state. A choice that stays chosen is a `FilterChips` button with `aria-pressed`, which looks the same.
- `:disabled` drops to 60%.

**Don't.** Use it for the main action of the view (that is the filled `Button`), or write it in capitals (that is the top bar's `OutlinedButton`).

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
- closes a `Drawer` when it opens (it dispatches `drawer:close`; the drawer dispatches `menu:close`), so only one is open at a time;
- with `data-label="Menu" data-label-open="Close menu"` on the button (as `MenuButton` has), keeps its `aria-label` and `data-tip` in step;
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

## PanelTabs

Numbered tabs across the top of the slide-down panel ("01 Menu  02 Contact  03 Features"), so the panel can hold a few pages: the menu, a contact form, a features list, a privacy note.

**Markup.**

```html
<div role="tablist" aria-label="Menu pages" class="panel-tabs">
  <button type="button" role="tab" id="tab-about" data-tab="about" aria-controls="panel-about"
          aria-selected="true" class="panel-tab"><span class="panel-tab-num">01</span> About</button>
  …
</div>
<div id="panel-about" role="tabpanel" aria-labelledby="tab-about" class="panel-tabpanel">…</div>
<div id="panel-contact" role="tabpanel" aria-labelledby="tab-contact" class="panel-tabpanel" hidden>…</div>
```

`kit/panel.js` finds the tabs and runs them. In Astro, pass `panelTabs={[{ id: 'menu', label: 'Menu' }, …]}` to `BaseLayout` (or `tabs` to `MenuPanel`) and put each tab's content in the slot named after its id (`<form slot="contact">`). The menu `items` sit at the top of the first tab.

- **Every tab is a Tab stop**, and Enter or Space opens it (they are real buttons). The arrow keys, Home and End also move between them. With three to five tabs, a keyboard user never has to discover the arrows.
- **Each tab deep-links.** `#contact` in the URL opens the panel on Contact, the URL shows the open tab, and Back closes the panel. A plain `<a href="#contact">` anywhere on the page opens it. So no element on the page may use a tab's id.
- On open, focus goes to the open tab, retried for a moment because Reduce Motion can refuse the first `focus()`.
- Labels are `label` style at 70% of `bar-ink`; the chosen tab is full strength with a 2px `accent-bright` underline. The number is tabular.
- The panel scrolls back to the top when the tab changes. A tab's content fades up (450ms), not under Reduce Motion.
- `panel.js` fires `panel:tab` (`{ detail: { id } }`) when a tab shows while the panel is open; `NewDot` listens for it.

**Do.** Keep labels to one word, and three to five tabs. **Don't.** Nest tabs, or use tabs for the menu's own sections (that is what accordions are for).

## NewDot

A small accent dot that tells a returning visitor something was added since they last looked: on the menu button's corner and after the label of the tab that lists what is new.

**Markup.** On the button, `<span data-new-dot class="new-dot new-dot--button" aria-hidden="true" hidden></span>`; on the tab, `<span data-new-dot class="new-dot new-dot--tab" hidden><span class="sr-only">(new)</span></span>`. The settings go on the panel as `data-new-*` attributes, and `kit/new-dot.js` does the rest. In Astro, pass `newDot={{ latest, tab: 'features', key: 'mysite:features-seen', returning: ['theme', 'mysite:favorites'] }}` to `BaseLayout`.

- **Who sees it.** The newest date is compared with the one this browser last saw (localStorage, YYYY-MM-DD strings). A first visit has nothing to catch up on: it is marked seen with no dot. A returning visitor (any key in `returning` is saved) who has not seen the newest date gets the dot. Don't list a key that every page writes on load, or every first visit counts as returning.
- **Clearing.** Opening that tab, by click, key, link or `#hash`, clears it for good.
- **Saying it.** The button's name becomes "Menu, new features" and its hover label "Menu · New features"; the tab reads "(new)" to screen readers.
- **Shape.** Round (`radius-round`): 0.5rem on the tab, 0.75rem on the button with a 2px ring in the bar's color so it stands clear of the border. Both are absolutely placed, so the dot never wraps onto its own line on a phone.
- In plain `accent`: it is a mark, not text.

**Don't.** Show a count, animate it, or use it for anything but "new since your last visit".

## Field

An underline-only text field in large type: no box, no radius, a 2px `currentColor` bottom border.

**Markup.** `<label class="field-label" for="x">Your name</label><input class="field" id="x">`. The label is 0.875rem, weight 500, uppercase, 0.1em tracking; the input is `field-input` (1.25rem) and inherits its color, so it works on `paper` and on a `bar` surface alike.

**Consumer provides** the label text, `id`/`for`, and any validation message (set it in `small` under the field). Placeholders sit at 45% of the text color: use them for examples, never instead of a label.

**Don't** add borders around the input or a background fill.

**Required fields** get the font's own flower asterisk (⁕, U+2055) in the accent after the label: `accent-text` on the page, `accent-bright` on dark. There is no markup to add. Put `required` on the field and the mark appears on the label just before it, on the label before a `select-wrap` that holds one, and on a `choice-group`'s legend when one of its radios is required. For a label the CSS can't reach, add `data-required`. Screen readers skip the mark, because the field's own `required` already says it. Say once what the mark means, at the top of the form: `<p class="small muted"><span class="required-mark"></span>Required</p>`. Mark the required fields, not the optional ones, and leave the mark off a form where every field is required.

## Select

A `Field` that picks one item from a list: the same underline and type, with a chevron at its end drawn from two 2px borders.

**Markup.**

```html
<label class="field-label" for="topic">Topic</label>
<div class="select-wrap"><select class="field select" id="topic">…</select></div>
```

- The chevron sits on `.select-wrap`, since a `<select>` can't hold a pseudo-element. Put spacing utilities on the wrapper (`class="select-wrap mb-7"`), not the select.
- **The open list** is drawn in the kit's style where the browser supports the customizable select (`appearance: base-select`; Chrome and Edge since 2025): square, a 2px rule in the text's color, on the surface it opens from (`paper`, or `bar` in a panel or drawer). The option under the pointer or keyboard fills like a chip; the chosen one is bold with a check in the accent, drawn from two straight 2px strokes like the chevron, not a font's curved glyph. The chevron turns up while it is open. Nothing to add: the same markup, still the real `<select>`, so the keyboard, screen readers, forms and phones' own pickers work as before.
- **Elsewhere** the browser's own list opens, always `ink` on `paper`, so it reads even when the field sits on a dark panel.
- For "nothing chosen yet", make the first option an empty-valued prompt ("Choose a topic"). For two to four choices, use radios instead: they show every option at once.
- `:disabled` drops to 60% with a not-allowed cursor.

## DateTimeField

A `Field` for a date, a time or both: the browser's own `<input type="date">`, `time`, `datetime-local` or `month`, with the same underline and type.

**Markup.** `<label class="field-label" for="start">Start date</label><input class="field" type="date" id="start" name="start">`. No script, no component: the browser's control does the work, including its calendar or clock, the keyboard and the screen reader.

- **The picker icon** is the browser's own and follows `color-scheme`, so it reads on the dark page; on a dark surface the kit sets the scheme to dark so it does there too.
- **Digits are tabular**, so dates in a column line up.
- **Formats** follow the visitor's settings (10/21/2026 or 21.10.2026); the value sent is always ISO (`2026-10-21`, `09:00`). Set `min` and `max` to bound it.
- **Presets** that fill a range ("This month", "1st–15th") are `SecondaryButton`s in a `btn-group` under the fields.
- Two fields that make a range sit side by side from 640px and stack on a phone.

**Don't.** Replace the control with a script calendar, or use a plain text field for a date.

## FilePicker

A field that shows the chosen file's name, with a Choose… `SecondaryButton` beside it.

**Markup.**

```html
<label class="field-label" for="ref" id="ref-label">Attachment</label>
<div class="file-pick">
  <input class="sr-only" type="file" id="ref" name="ref" aria-labelledby="ref-label ref-name" data-file-pick>
  <span class="file-pick-name" id="ref-name" data-file-pick-name data-empty>No file chosen</span>
  <label class="btn-outline" for="ref" aria-hidden="true">Choose…</label>
</div>
```

Load `kit/file-pick.js`. In Astro, `<FilePicker id="ref" name="ref" label="Attachment" />`, with `accept`, `multiple`, `directory`, `required` and `disabled` as needed.

- **The real file input stays in the page**, visually hidden but focusable, so keyboard, screen reader and drag-and-drop all use the browser's own control. While it has keyboard focus, the Choose… button shows the focus ring.
- **The field shows the choice:** a file's name, "3 files" for several, or a folder's name; until then the text it started with, at 75%.
- **Its name** is the label and the field together, so a screen reader hears "Attachment, report.pdf". The Choose… label is hidden from screen readers, since the input is the control.
- **A folder** (`directory`, the `webkitdirectory` attribute) works in current Chrome, Edge, Firefox and Safari. The browser asks the visitor to confirm, and the page gets the files in it, never the folder's path on their disk.
- A `required` picker gets the required mark on its label like any field.

**Don't.** Draw a drop zone with a dashed box, or show a path you can't know.

## Switch

An on/off control for a setting that takes effect as a yes or no: a square track with a square thumb that slides right as the track fills.

**Markup.** `<label class="choice"><input class="switch" type="checkbox" role="switch" name="updates"> Email me when something is added</label>`

- **A real checkbox** with `role="switch"`: Space toggles it, it submits with a form, and screen readers say "on" / "off". No script.
- **On is the accent.** Off is a `currentColor` outline with a solid thumb on the left. On fills the track with `accent-text` and an `accent-ink` thumb; inside a panel or drawer, `accent-bright` with a `bar` thumb. It follows the site's accent, vermilion or verdigris. The colors come from `--choice-on` and `--choice-thumb` on `.choice`.
- The whole `.choice` label is the target, at least 2.75rem tall. The thumb slides in 200ms; not under Reduce Motion.
- In Windows High Contrast, on fills with the system highlight color.
- The label says what "on" means ("Send a monthly digest"), never "Enable" or "On/Off".

**Don't** use it for a choice that only applies on submit when a plain yes/no question reads better, or add text inside the track.

## Radio

One choice from a short list, all options visible: a 2px ring with a dot that grows in the middle when chosen. The one round control: the circle is the convention that tells a radio apart from a check, so it is the fourth curve the system allows.

**Markup.**

```html
<fieldset class="choice-group">
  <legend class="field-label">How often</legend>
  <label class="choice"><input class="radio" type="radio" name="often" value="daily"> Every day</label>
  <label class="choice"><input class="radio" type="radio" name="often" value="weekly" checked> Once a week</label>
</fieldset>
```

- Native radios: the arrow keys move the choice, and the group is one Tab stop. No script.
- Stacked by default; add `choice-group--row` to set two or three short options side by side (they wrap on a phone).
- The legend uses the `field-label` style, so a group reads like the fields around it.
- A `currentColor` ring while unchosen (`ink` on the page, `bar-ink` on dark). The chosen one's ring and dot turn the accent: `accent-text` on the page, `accent-bright` on dark. Two to five options; more belong in a `Select`.
- A disabled option (`disabled`) and its label drop to 60%.

**Don't** start a group with nothing chosen unless "no answer" is valid, or use radios for on/off (that is a `Switch`).

## FilterChips

A row of outlined buttons that narrows a list to one category. One choice at a time; the pressed one fills with `ink`.

**Markup.** A `<div class="chip-group" role="group" aria-label="Category">` of `<button class="chip" aria-pressed="true|false">Label <span class="chip-count">12</span></button>`. "All" comes first and is pressed by default.

- Sentence case, 1rem, weight 500; the count is 14px at 75% and tabular. Min height 2.75rem. Buttons wrap on a phone.
- Fold the row in a `PageAccordion` whose summary names the current choice ("All items", "Writing · 5 items").
- Hide rows that don't match (and any section left empty) but keep their numbers.
- Put the choice in the address (`?category=writing`), not a `#`.
- Announce the result in a polite live region outside the accordion: `<p class="sr-only" aria-live="polite">Showing 5 Writing items</p>`.
- With `FavoriteStar`, add a **Favorites** chip after All, its count in `<span class="chip-count" data-favorites-count>0</span>`. It filters like a category, using the starred ids. When it shows nothing, say how to add some in a `muted` line under the accordion.
- Listen for `filter:reset` and go back to All (`JumpToCurrent` sends it when the current item is filtered out).

## FavoriteStar

A star in a list row that saves the item as a favorite on this device: an outline in `muted`, filled `accent-text` when chosen.

**Markup.** `<button type="button" class="fav-btn" data-favorite="field-notes" aria-pressed="false" aria-label="Favorite Field notes">` holding a 24px-viewBox star `<svg aria-hidden="true">`. Load `kit/favorites.js`. In Astro, `<FavoriteButton id="field-notes" name="Field notes" />` does both.

- **Beside the row's main action, never inside it.** The row's link or play button and the star are siblings, so a star tap never opens or plays the row. (A button can't hold another anyway.)
- **Saved by id**, not by position or number, which shift when items are added. A JSON array in localStorage under `<html data-favorites-key="mysite:favorites">` (default `favorites`).
- `aria-pressed` says whether it is on, so the name stays "Favorite <name>" either way. 44px square target; the 20px star overlaps the row's padding rather than making the row taller.
- On a filled row (hover, active) it follows the row's text: `row-fg`, and `accent-bright` when chosen.
- Unstarring while the Favorites filter shows leaves the row in place until the next filter choice, so the star doesn't vanish from under the pointer and can be tapped again to undo.
- `import { getFavorites } from '…/kit/favorites.js'` in a filter script; it fires `favorites:change` after each change.

**Don't.** Use a heart, a count, or a confirmation toast for each tap.

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
- On hover and when active, the row fills (`row-hover-bg` / `row-active-bg`) and all text, muted included, turns `row-fg`. In dark mode the fill is a raised dark, never a cream slab, and the active row shows an accent edge.
- Rows stack on phones; switch to columns from 768px.
- Keep the numbers when filtering; don't renumber.

## JumpToCurrent

A small solid triangle in the `BottomBar` that appears while the current item's row is off screen, and brings it back: like a player's "show in list".

**Markup.** Inside the bar's label:

```html
<button type="button" class="jump-btn" data-jump data-jump-target='[data-item="field-notes"]'
        data-jump-name="Field notes" hidden><span aria-hidden="true" data-jump-glyph>▲</span></button>
```

Load `kit/jump.js`; it measures against the nearest `[data-jump-bar]`. In Astro, pass `jump={{ target, name }}` to `BottomBar`. `data-jump-target` is a selector for the current row (default `.row[data-active="true"]`); with no match, the button stays hidden.

- **The font's own glyphs:** ▲ when the row is above or hidden by a filter, ▼ when it is below. 14px, `accent-bright` on the bar, in a 2rem square target.
- Shows only while the row is off the visible part of the page, between the top bar and the bottom bar (a sliver at the edge doesn't count). Re-checked on scroll, resize and any layout change.
- A click closes the menu and the drawer, sends `filter:reset` if a filter hides the row, scrolls the row to the middle of the screen (instantly with Reduce Motion), puts keyboard focus on its first link or button, and flashes a 3px `accent` outline that fades over 1.6s.
- **Name:** "Show Field notes in the list", plus "(shows all items)" when it will clear a filter. Hover label (`title`): "Show in the list".

**Don't.** Show it while the row is on screen, or use it for anything but the one current item.

## Marquee

One line that scrolls when it is too long to fit, the way music players show a long title. At rest it ends in an ellipsis; while moving, its ends fade.

**Markup.** `<span class="marquee" title="Full text" data-marquee><span>Full text</span></span>`, and load `kit/marquee.js`: it runs every `[data-marquee]` once the fonts have loaded. When the text changes, call `scrollTitle(el)` again (`import { scrollTitle } from '…/kit/marquee.js'`). `BottomBar` does all of this for its title.

- Only when it doesn't fit; short titles never move.
- Wait 2s, slide at 50px a second, wait 2s, slide back. **Three rounds, then stop** with the ellipsis (WCAG 2.2.2). Restart when the text changes.
- Never with Reduce Motion. Keep the full text in `title`.
- The edge fade is the one gradient the system allows.

## BottomBar

An optional dark bar fixed along the bottom of the screen, for something that should stay in view while the page scrolls: what is playing or being read now. A small label, a `Marquee` title and a `JumpToCurrent` button. Pages opt in; most sites, and most pages, don't need one.

**Markup.**

```html
<section class="bottom-bar" aria-labelledby="bottom-bar-heading" data-jump-bar data-drawer-keep>
  <div class="page">
    <h2 class="bottom-bar-heading" id="bottom-bar-heading">Now playing</h2>
    <div class="bottom-bar-row">
      <p class="bottom-bar-label">Now <button class="jump-btn" data-jump …>…</button></p>
      <span class="marquee" title="Full title" data-marquee><span>Full title</span></span>
    </div>
  </div>
</section>
```

The heading is optional (`heading` in Astro): a line above the row that says what the bar is when the label alone doesn't. It is the largest type in the bar, 1.25rem bold in `bar-ink`, and fits the 5rem bar with the row under it; a shorter bar should leave it out. It is an `h2`, or an `h3` with `headingLevel="h3"`; the class sets its look either way. With a heading the bar is a `section` named by it, so screen readers list it as a region, as they do the drawer. Without one it is a plain `div`.

Load `kit/jump.js` and `kit/marquee.js`. In Astro, `<BottomBar slot="overlays" label="Now" title="…" jump={{ target: '[data-item="field-notes"]', name: 'Field notes' }} />` in `BaseLayout` writes it and loads both; the default slot adds to the end of the bar.

- **Set the height once.** The bar is `--bar-h` tall, so give `BaseLayout` `barHeight="5rem"` on every page that shows it. The page then keeps that much space at its end, and the panel, the drawer and the toast stop above the bar. A page without the bar leaves `barHeight` out, and nothing is reserved.
- **Dark in both themes:** `bar` with `bar-ink` text, like the panel. The label is bold `accent-bright`, the title 1.125rem weight 500.
- `data-drawer-keep` keeps it usable while the drawer is open.
- With a `Footer` on the same page, the footer ends where the bar begins, so the bar never covers it.

**Don't.** Put navigation or a form in it, or show it on pages where it has nothing current to say.

## Footer

The traditional footer at the end of the page. The site name, a line about the site and a quiet note (a credit, a copyright line) on the left; the site's links on the right, in two short columns. It stacks on phones and splits into two columns from 768px.

**Markup.**

```html
<footer class="site-footer">
  <div class="site-footer-inner">
    <div>
      <p class="site-footer-name">Site name</p>
      <p class="site-footer-text">One line about the site.</p>
      <p class="site-footer-note">© 2026 Site name.</p>
    </div>
    <nav aria-label="Footer">
      <ul class="site-footer-links"><li><a href="/about">About</a></li>…</ul>
    </nav>
  </div>
</footer>
```

In Astro, `<Footer name="Site name" description="…" links={menu}><Fragment slot="note">© 2026 Site name.</Fragment></Footer>` as the last thing in `BaseLayout`'s default slot. `links` takes the same `MenuItem[]` as the menu, and every item with an `href` is listed, nested ones included, so the footer never keeps its own list; the current page is underlined in the accent. The default slot adds anything under the links.

- **The rule.** It opens with the 2px rule every section starts with, `space-16` below the page above it.
- **`--bar`** (`tone="bar"`) sets it on a dark `bar` block instead, like `page-title--bar`: for a site whose pages end on a light section and want a firm end.
- **Type.** The name is bold at 2.25rem; the links are 1rem weight 500, `accent-text` on hover (`accent-bright` on the dark block). The note is 14px, dimmed by color at 75%, not by opacity.
- **Names.** The links sit in a `nav`; give each footer on a page its own `label` if there is more than one.
- Keep it to the site's own pages and one or two outside links. It is not a second menu with sections and headings.

**Don't.** Add a logo image, icons beside the links, a newsletter form or a column of social icons. A link to the site's page on a service says its name in text.

## Dialog

A modal dialog on the browser's own `<dialog>`: a square panel with a 2px rule in the text's color, on the page's ground, over a flat dark backdrop. For a choice that needs an answer before the visitor goes on ("Delete this export?"), or a short form that belongs to one action.

**Markup.**

```html
<button type="button" class="btn-outline" commandfor="confirm" command="show-modal">Delete export…</button>

<dialog class="dialog" id="confirm" aria-labelledby="confirm-title" closedby="any">
  <form method="dialog" class="dialog-form">
    <div class="dialog-head">
      <h2 class="dialog-title" id="confirm-title">Delete this export?</h2>
      <button class="dialog-close" value="close" aria-label="Close" title="Close"><i></i><i></i></button>
    </div>
    <div class="dialog-body"><p>The 8 files go with it. This can't be undone.</p></div>
    <div class="dialog-actions">
      <button class="btn" value="delete">Delete</button>
      <button class="btn-outline" value="cancel" autofocus>Cancel</button>
    </div>
  </form>
</dialog>
```

Load `kit/dialog.js`. In Astro, `<Dialog id="confirm" title="Delete this export?">…<Fragment slot="actions">…</Fragment></Dialog>`; `lightDismiss={false}` keeps it open on a click outside.

- **The browser does the work** (see `<dialog>` on MDN): `showModal()` makes the page behind inert and puts the dialog on top, Escape closes it, focus goes to the `autofocus` button and back to the opener on close. The page doesn't scroll behind it.
- **Opening** with invoker commands (`commandfor` + `command="show-modal"`) needs no script; `kit/dialog.js` runs them in browsers that don't yet.
- **Closing.** Every button in the `<form method="dialog">` closes it and leaves its `value` in `dialog.returnValue`; listen for `close` and act on it. `closedby="any"` closes it on a click outside too (the script fills in where that isn't supported); Escape and outside clicks return `""`, the X `"close"`.
- **Focus.** Put `autofocus` on the safest choice (Cancel, not Delete), so Enter never destroys anything by accident.
- **Actions** are one filled `Button` for the choice the dialog is about and `SecondaryButton`s for the rest, filled one first.
- **Shape.** Up to 34rem wide, `gutter` from the screen's edges on a phone; the title is 1.75rem bold; the X is two bars like the menu button's, `accent-text` on hover. It fades and rises in over 250ms and fades out; not under Reduce Motion. The backdrop is `bar` at 75%, flat, no blur.

**Don't.** Use it for something that could be a page or a `Toast`, open one from another, or put navigation in it.

## Toast

A short confirmation on a `bar` block with a 6px `accent-bright` left edge, bottom-left above any bottom bar.

**Markup.** `<div class="toast" role="status">Message sent.</div>`; set `data-show="true"` to fade it in (350ms) and remove it to hide. It sits at `left: gutter; bottom: calc(bar-h + 1rem)`, max 28rem wide, 1rem weight 500.

**Use** for one-line confirmations that need no action. Hide it after a few seconds. **Don't** stack several or put buttons in it.

## Drawer

A second slide-down panel for a list the visitor dips into while using the page (recently played, recently viewed, saved items). Same `bar` surface and the same height as the panel, but lighter: no tabs, and the page behind it isn't made inert.

**Markup.** A top-bar button and a `<section>` outside `[data-panel-page]`:

```html
<button data-drawer-button aria-expanded="false" aria-controls="drawer" class="topbar-btn topbar-btn--text"
        data-label="Recent pages" data-label-open="Close recent pages" aria-label="Recent pages" data-tip="Recent pages">Recent</button>

<section id="drawer" class="drawer" data-drawer aria-labelledby="drawer-heading" aria-hidden="true" inert>
  <div class="drawer-inner">
    <h2 id="drawer-heading" tabindex="-1" data-drawer-focus class="label drawer-heading">Recent pages</h2>
    <div class="drawer-list-wrap">
      <ol class="drawer-list" data-drawer-list>
        <li class="drawer-item"><div><a class="drawer-title" href="/work">Work</a><p class="drawer-meta">…</p></div></li>
      </ol>
      <button type="button" class="drawer-more" data-drawer-more data-show="false" tabindex="-1" aria-hidden="true" aria-label="Scroll to more">…arrow…</button>
    </div>
    <p class="closing-note mt-6">Kept on this device only.</p>
  </div>
</section>
```

Load `kit/drawer.js`. In Astro, `<DrawerButton slot="topbar" label="Recent pages">Recent</DrawerButton>` and `<Drawer slot="overlays" title="Recent pages">` in `BaseLayout` write it all.

- **Non-modal.** The page is not made inert, and there is no `aria-modal`. A click or tap anywhere outside closes it and still does what it was aimed at (tap an item on the page: the drawer closes and the item opens). Focus stays where the click put it. Mark things that should stay usable with it open, such as a bottom bar or the toast, `data-drawer-keep`.
- **Full height, like the panel.** It reaches from the top down to the bottom bar (`bar-h`, or the bottom of the screen without one), so the menu and the drawer open the same way.
- **Only the list scrolls.** The page is locked (`<html data-drawer-open>`, which also turns the top bar dark) and the heading and closing note stay put.
- **Closes** on its button, Escape, `drawer:close`, a click outside, or keyboard focus moving outside it (Tab past the last row would otherwise land on the page hidden behind it). Opening it sends `menu:close`, and opening the menu sends `drawer:close`: one at a time.
- **Focus** goes to the heading on open (retried under Reduce Motion) and back to the button when closed by the button or Escape. While it is open, its button's outline and text turn `accent-bright` (vermilion or verdigris, whichever the site uses), matching the drawer's heading; hovering fills it with the accent.
- **"More below" arrow.** A 2.75rem round `accent` button centered over the bottom of the list, shown while the list overflows and has not been scrolled. It scrolls most of a screen; from the keyboard it also moves focus to the first row that comes into view, since it is about to disappear. No shadow. Rows can be added and removed from a script; it re-checks on its own.
- Rows: `drawer-title` (1.125rem, 500) over `drawer-meta` (14px, 75%), with 1px rules at 25% of `bar-ink` between them. Set text from data with `textContent`, never as HTML.
- Slides in 450ms; not under Reduce Motion.

**Do.** Give it a short label heading and a closing note saying where the data lives. **Don't.** Put a form or a second level of navigation in it; that belongs in the panel.

## IconActions

A row of icon-only links and buttons under a list item (share, search elsewhere, copy), plus a circled-X remove button at the row's end. The only place the kit uses an icon set; the rules are under Iconography in `DESIGN.md`.

**Markup.**

```html
<li class="drawer-item">
  <div>
    <a class="drawer-title" href="/work">Work</a>
    <p class="icon-row">
      <a class="icon-btn" href="…" target="_blank" rel="noopener noreferrer"
         aria-label="Share on Bluesky: Work (opens in a new tab)" title="Share on Bluesky"><svg class="icon" aria-hidden="true">…</svg></a>
      <button type="button" class="icon-btn" aria-label="Copy link: Work" title="Copy link"><svg class="icon" aria-hidden="true">…</svg></button>
    </p>
  </div>
  <button type="button" class="icon-btn icon-btn--remove" aria-label="Remove: Work" title="Remove"><svg class="icon" aria-hidden="true">…</svg></button>
</li>
```

- **Icons** come from `astro-icon`: Simple Icons for brand marks (`simple-icons:bluesky`), Material Symbols outline for actions (`material-symbols:content-copy-outline`, `material-symbols:cancel-outline` for remove). Never a trash can.
- **One color.** `.icon-btn` takes the text's color (`bar-ink` on dark, `ink` on the page) and turns `accent-bright` (dark) or `accent-text` (page) on hover. Never a brand's colors.
- **Sizes.** 36px (2.25rem) square targets; the icon is 1.25rem, and 1.5rem on the remove button. The row starts 0.5rem to the left so the first glyph lines up with the text above.
- **Names, verb first,** naming the action and its object: "Share on Bluesky: Work (opens in a new tab)", "Copy link: Work", "Remove: Work". The `title` hover label is the short form, the part before the colon. The `<svg>` is `aria-hidden`.
- **Rows built in the browser** can't call `astro-icon` (it runs at build time). Render each icon once with `<IconTemplates icons={{ copy: 'material-symbols:content-copy-outline', … }} />`, then `iconControl('button', 'copy', 'Copy link: Work')` from `kit/icon-controls.js` clones it into a ready button with its name and hover label.
- **Remove moves focus.** The row disappears with focus on its button, so call `focusAfterRemoval(list, item, '.icon-btn--remove', heading)` before removing it and the returned function after: focus lands on the remove button now in that place, or the heading once the list is empty. Confirm with a toast ("Page removed.").
- Copy confirms with a toast, and says so if the clipboard is refused.
- **Scroll containers.** The icon row and the remove button reach 0.5rem past each side of the row, so a scrolling list that holds them must reach out to match, or it ends up 8px wider than its scroll area and scrolls sideways on a phone. Give the container `margin-inline: -0.5rem; padding-inline: 0.5rem; overflow-x: hidden;` beside its `overflow-y: auto` (`.drawer-list` already has it). The demo's `tests/drawer.spec.ts` checks it at 375px.

**Don't.** Add an icon beside a text label that already says the same thing, use icons for decoration, or let a row hold more than four.

## ClosingNote

A bold 2px rule that closes off a list, over one quiet line of text ("Kept on this device only.").

**Markup.** `<p class="closing-note">…</p>` after the list.

- The rule is `ink` on the page and `bar-ink` in the panel or a drawer, always solid.
- The text is 14px, dimmed with `color-mix(in srgb, <ink> 70%, transparent)`, **not** `opacity`, which would also fade the rule.
- One or two sentences. It says something true about the list (where it is kept, how it is sorted), not marketing.

## DatedList

What a site can do and when each part arrived, newest first: the "Features" tab of a panel, or a changelog page.

**Markup.**

```html
<ol class="dated-list">
  <li><time datetime="2026-10-16">Oct 16, 2026</time><div><h3>Favorites</h3><p>Star an item…</p></div></li>
</ol>
```

In Astro, `<FeaturesList features={features} />`, with the data in a typed file (`src/data/features.ts` exporting `features: Feature[]`, newest first; `Feature` is in `kit/astro/types.ts`).

- A 2px `currentColor` rule on top, 1px rules at 25% between entries.
- Date over the text on phones; a 10rem date column beside it from 640px. The date is 14px bold, `accent-text` on the page and `accent-bright` on dark.
- **Format dates in UTC.** They are plain days, so `toLocaleDateString(…, { timeZone: 'UTC' })`; otherwise a visitor west of UTC sees the day before.
- One entry per thing a visitor would notice, dated the day it went live; when a feature grows, edit its line rather than adding one. The newest date also drives `NewDot`.
- An entry's optional `details` (a list of short sentences) are for release notes: what it does, where to see it, what a site needs to change. The list on the page shows only the `body`.

## SummaryList

A few results, each a small label beside its value: what a task did, a record's details, an order's totals.

**Markup.**

```html
<dl class="summary-list">
  <div><dt>Download</dt><dd>Done. Saved 92 new files.</dd></div>
  <div><dt>Info files</dt><dd>92 new, 0 updated.</dd></div>
</dl>
```

In Astro, `<SummaryList items={[{ label: 'Download', value: 'Done. Saved 92 new files.' }]} />`; for links or richer values, write the `<dl>` yourself.

- **Label** in the `label` style (14px, 500, uppercase) at 85% of the text color; **value** in body text.
- Label over value on phones; a 10rem label column from 640px, on the value's baseline.
- 1px `rule` under each row. On a dark surface the rules follow `bar-ink`.
- Labels are one or two words; values are a short sentence. Put it under a section's 2px rule and `h2`, like any section.

**Don't.** Use it for a list of things to choose from (that is a `ListRow`), or for more than a handful of rows.

## OutputPanel

A section for a task's live output, the way a downloader or a build tool shows its work: the 2px rule and an `h2`, a status at the heading's right, and the log in a dark `CodeBlock` of fixed height that scrolls.

**Markup.**

```html
<section class="output" aria-labelledby="out-heading" data-output>
  <div class="output-head">
    <h2 class="h2" id="out-heading">Output</h2>
    <p class="output-status"><span class="spinner" aria-hidden="true"></span><span role="status" data-output-status>Finished</span></p>
  </div>
  <pre class="pre--bar output-log" tabindex="0" aria-label="Output log" data-output-log><code>…</code></pre>
</section>
```

In Astro, `<OutputPanel id="out" status="Not started" />`, with `title`, `running`, `headingLevel` and `height` (default 20rem). Stream into it with `kit/output.js`: `outputClear(panel)`, `outputLine(panel, text, 'cmd' | 'err')`, `outputStatus(panel, 'Running…', true)`.

- **Status.** 14px at 75%, a polite live region: a screen reader hears "Running…" and "Finished", not every line. While running (`data-running`), the spinner shows beside it.
- **The log** follows its newest line while the reader is at the bottom; once they scroll up to read, it stays put. Lines are set as text, never HTML. Commands in bold, errors in the accent, as in any `pre--bar`.
- It scrolls inside its fixed height, and sideways for long lines; `tabindex="0"` lets the keyboard scroll it.
- Put a `SummaryList` of the results after it.

**Don't.** Let the log grow the page, or announce each line.

## CodeBlock

A block of code, commands or program output in Source Code Pro: square, with a thin `rule` border on the paper, or a dark block for terminal output and logs.

**Markup.** `<pre tabindex="0"><code>…</code></pre>`. For output, add `pre--bar`: `<pre class="pre--bar" tabindex="0">`. Inside either, wrap a command line in `<span class="pre-cmd">` and an error line in `<span class="pre-err">`.

- **Plain** is a 1px `rule` border and `space-4` padding, no tint behind it. **`.pre--bar`** is `bar` with `bar-ink` text in both themes, like the panel, the drawer and the toast, so output reads as a separate surface from the page.
- **Lines.** `.pre-cmd` is bold (700, one of the kit's two weights). `.pre-err` is the accent: `accent-text` on the paper, `accent-bright` on `.pre--bar`. Output isn't syntax-colored.
- **Syntax colors** are for source code only, the kit's second code exception (see Color in `DESIGN.md`):

  | Token | Color | For |
  | --- | --- | --- |
  | `code-keyword` | magenta | keywords: `import`, `const`, `if`, `return` |
  | `code-string` | teal | strings, template literals, HTML tags |
  | `code-constant` | orange | numbers, constants, properties, function and attribute names |
  | `code-comment` | `muted` | comments |

  Punctuation, parameters and everything else stay in the text color. On `.pre--bar` the `-bright` versions take over by themselves.
- **With Shiki** (built into Astro), use its css-variables theme, and the kit maps Shiki's `--astro-code-*` variables to the tokens, its background included, so Shiki sets no color of its own:

  ```js
  // astro.config.mjs
  export default defineConfig({ markdown: { shikiConfig: { theme: 'css-variables' } } });
  ```

  Outside Astro, Shiki's `createCssVariablesTheme({ variablePrefix: '--astro-code-' })` does the same. **By hand**, wrap tokens in `.tok-keyword`, `.tok-string`, `.tok-constant` and `.tok-comment`.
- **Scrolling.** Long lines scroll sideways rather than wrapping. Give the block `tabindex="0"` so the keyboard can scroll it. A block that grows, like live output, takes its own `max-height` from the site and scrolls down too.
- Inline code, keys and sample output are plain `<code>`, `<kbd>` and `<samp>`; see Type in `DESIGN.md`.

**Don't.** Add a fourth syntax color, use a highlighter's own theme (it brings its own colors and background), add line numbers drawn as decoration, a rounded box or a tint behind code on the paper.

## Ellipse

An oval badge holding a short code, like the "CH" sticker on the back of a Swiss car: bold capitals inside a thin oval rule.

**Markup.** `<span class="ellipse" title="Switzerland"><span aria-hidden="true">CH</span><span class="sr-only">Switzerland</span></span>`. In Astro, `<Ellipse code="CH" label="Switzerland" />`; add `solid` for the filled version.

- **Shape.** 2em tall, at least 3em wide, `border-radius: 50%`, so it stays a true ellipse when a third letter widens it. The border is 2px, or 0.07em on a big one, so it keeps its weight as it scales.
- **Type.** 700, uppercase, 0.04em tracking, in the font size of the text around it. Size it with a text utility: `text-base` beside body text, `text-4xl` or more as a mark on its own. Never under 0.875rem.
- **Light and dark.** The default is `paper` with `ink` letters and rule, the plain sticker; `.ellipse--solid` is `ink` with `paper` letters. Both follow the theme with no extra classes: the default is a cream oval with black letters in light and a black oval with cream letters in dark, and on a `bar` surface (panel, drawer, `page-title--bar`) they take `bar` and `bar-ink`.
- **Saying it.** Pass `label` with what the code stands for. Screen readers then hear "Switzerland", not "C H", and the label shows as a tooltip. Leave it off only when the code is already spelled out beside the badge.
- 1 to 3 letters or digits. Country codes, a language (DE, FR), a short grade or version.

**Don't.** Put a sentence or an icon in it, color it with the accent, or use it as a button. It is a label, not a control.

## NumberCircle

A number set in a circle, for when a number should read as a mark of its own: the steps of a how-to, or a list row's number set apart from its name. Outlined, or solid.

**Markup.** `<span class="num-circle"><span>02</span></span>`; add `num-circle--solid` to fill it. The inner span is needed: it carries the cut-out color of the solid version. In Astro, `<NumCircle value={2} />` (a number is padded to "02"), with `solid` for the filled one.

- **Shape.** A 2.25em circle (`radius-round`, at 50%) with a 1px rule, or 0.06em on a big one. Weight 500, tabular numerals.
- **Color.** All `currentColor`, so it takes the color of the text it sits in: put `muted` on it beside a row's name, leave it `ink` as a step marker. The solid version fills with that color and cuts the digits out in the surface's own: `paper` on the page, `bar` in the panel, drawer and `page-title--bar`, the row's fill when a `ListRow` is hovered or active.
- **Size.** Like the `Ellipse`, it takes its text's size: `small` in a list row, a text utility (`text-2xl`) for a step marker on its own. Never under 0.875rem.
- **One or two digits.** It is a circle, not a pill: a three-digit number would crowd it. Past 99, use a plain `.num`.
- Use one style per list: all outlined or all solid. The solid one is not a "current" marker; the active row already has its fill and edge.

**Don't.** Put letters in it (that is an `Ellipse`), color it with the accent, or make it a button.

## ActivityIndicators

Two small moving marks: the equalizer (`.eq`, three `accent` bars) says "this is live / playing now"; the spinner (`.spinner`, a 2px `currentColor` ring with one side open) says "loading".

**Markup.** `<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>` and `<span class="spinner" role="status" aria-label="Loading"></span>`.

- The equalizer marks the one active item in a list (put it in the row's end slot). It is decorative: pair it with text or `aria-current` for screen readers.
- The spinner is one of the few round marks in the system (`radius-round`); Layout in `DESIGN.md` lists them all.
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

  Use `title="About"` instead of the slot for a one-line name, and `layout="split" | "wide"` to override the shape. The default slot adds text under the lead and before the image, such as a second lead paragraph: `<p class="lead hero-lead">…</p>`. Keep it to one or two short paragraphs; longer text belongs on the page below.
- The hero image loads eagerly with high priority; it is the one image on a page that is not lazy.

## PageTitle

A title banner in place of a hero, for pages that need a name but not an introduction (a list, a form, a settings page): one `h1` across the full width of `.page`.

**Markup.** `<header class="page-title"><h1 class="page-title-text">All work</h1></header>`. Add `page-title--bar` to set it on a dark `bar` block with `bar-ink` text and an 8px `accent` rule along its bottom edge (plain `accent`, since it is a large shape; vermilion or verdigris with the site).

- Bold, tight, `clamp(3rem, 9vw, 7.5rem)`: smaller than `display`, still the biggest thing on the page. A long word wraps instead of pushing the page sideways.
- Space like a hero's: `space-12` above, a little less below (more from 768px). No rule under it; the section below starts with its own 2px rule.
- The bar version spans the container, not the window, and keeps a margin above and below so it reads as a block on the page.
- One per page, and only on pages without a `Hero`.
- **In Astro,** `kit/astro/PageTitle.astro`: `<PageTitle title="All work" />`, or `tone="bar"` for the dark block. Put rich text in the default slot instead of `title`.

**Do.** Keep it to a few words. **Don't.** Add a lead line or an image to it; that is a `Hero`.

## PostList

A blog's index, newest first: each post's date beside its linked title, with a summary and a quiet meta line under it.

**Markup.**

```html
<ol class="post-list">
  <li>
    <time datetime="2026-10-20">Oct 20, 2026</time>
    <div>
      <h2 class="post-list-title"><a href="/blog/one-typeface/">Why one typeface is enough</a></h2>
      <p class="post-list-summary">A site set in a single grotesque…</p>
      <p class="post-list-meta">Type · 2 min read</p>
    </div>
  </li>
</ol>
```

In Astro, `<PostList posts={posts} />`, each a `Post` (`title`, `href`, `date`, optional `summary` and `meta`; the type is in `kit/astro/types.ts`). `level="h3"` when the list sits under a section's `h2`.

- A 2px `ink` rule on top, 1px `rule` between posts, like the dated list.
- Date over the post on phones; a 10rem date column beside it from 640px. The date is 14px, 500, `muted`, tabular: the title is what stands out, not the date.
- The title is 1.5rem, 2rem from 768px, bold; it underlines (2px) on hover. Only the title is a link.
- **Format dates in UTC**, as for the dated list.
- Meta is a short line: topics and reading time, joined with " · ".

**Don't.** Add thumbnails beside every post or an accent on the dates. A list of things to choose and keep current is a `ListRow`, not this.

## PostFeature

One post at the top of a blog's index, set like a split `Hero`: the text and a square image 50/50 from 768px, text first on phones. The `PostList` of the other posts follows it.

**Markup.**

```html
<article class="post-feature">
  <div>
    <p class="post-feature-label">Featured</p>
    <h2 class="post-feature-title"><a href="/blog/one-typeface/">Why one typeface is enough</a></h2>
    <p class="lead post-feature-summary">A site set in a single grotesque…</p>
    <p class="post-feature-meta"><time datetime="2026-10-20">Oct 20, 2026</time> · Type · 2 min read</p>
    <a class="btn" href="/blog/one-typeface/" aria-label="Read post: Why one typeface is enough">Read post</a>
  </div>
  <img class="media media--1x1" src="…" alt="…" width="2000" height="2000" fetchpriority="high">
</article>
```

In Astro, `<PostFeature post={post} image={art} alt="What it shows" />`, with the same `Post` as `PostList` and an imported image. `label` (default "Featured") and `action` (default "Read post") change the two short labels; `level="h1"` when nothing else on the page is the `h1`.

- It takes a hero's place and space: `space-12` above, more from 768px. A page with a `PostFeature` has no `Hero` or `PageTitle`; give it an `h1` (visually hidden is fine) naming the page.
- The label is small, bold and `accent-text`; the title is bold and tight at `clamp(2.5rem, 5.5vw, 5rem)`, and underlines (3px) on hover.
- The filled button is the page's one primary action. Its name adds the post's title, so it says where it goes.
- The image is cropped square (`.media--1x1`) and loads eagerly, like a hero's. A square or portrait original crops best.
- Only one per page. Don't repeat the featured post in the list below it.

## Pager

Numbered pages of a long list, such as a blog's index: the step back, the page numbers and the step on, under a 2px rule.

**Markup.**

```html
<nav class="pager" aria-label="Blog pages">
  <span></span>
  <ol class="pager-pages">
    <li><a href="/blog/" aria-current="page" aria-label="Page 1 of 2">1</a></li>
    <li><a href="/blog/page/2/" aria-label="Page 2 of 2">2</a></li>
  </ol>
  <a class="pager-step pager-next" href="/blog/page/2/" rel="next">Older<span aria-hidden="true"> →</span></a>
</nav>
```

On the first page an empty `<span>` holds the back step's place; on the last, leave the next step out.

In Astro, `<Pager current={2} total={4} url={(n) => (n === 1 ? '/blog/' : `/blog/page/${n}/`)} label="Blog pages" prev="Newer" next="Older" />`. It draws nothing when `total` is 1. With many pages it shows the first, the last and the two beside the current one, with an ellipsis for each gap: 1 … 4 5 6 … 12.

- The numbers are outlined squares, 2.75rem at least, like filter buttons: filled `ink` on hover and for the page you are on (`aria-current="page"`). Tabular numerals.
- The steps are small labels (14px, 500, uppercase) with the font's arrows, hidden from screen readers, and turn `accent-text` on hover. One word each: Previous and Next by default; Newer and Older on a list that runs newest first.
- From 640px, one row: the back step, the numbers in the middle, the next step on the right. On phones the steps share the first line and the numbers wrap under them.
- Each number is named "Page 2 of 4", and the `nav` names what is paged ("Blog pages").
- **Keep what opens the list on every page.** A `PostFeature` or a `PageTitle` stays at the top of page 2 and on; only the rows change. Say which page it is in the page's title ("Blog · Page 2").

**Don't.** Use it for fewer than two pages, renumber the rows from 1 on each page, or swap it for "Load more" or endless scrolling.

## PostHeader

The top of a blog post, in place of a `Hero` or `PageTitle`: a small label back to the index, the title, an optional lead, and a byline.

**Markup.**

```html
<header class="post-header">
  <a class="post-header-label" href="/blog/">Blog</a>
  <h1 class="post-header-title">Why one typeface is enough</h1>
  <p class="lead post-header-lead">A site set in a single grotesque…</p>
  <dl class="post-meta">
    <div><dt>Published</dt><dd><time datetime="2026-10-20">October 20, 2026</time></dd></div>
    <div><dt>By</dt><dd>Danny Englander</dd></div>
  </dl>
</header>
```

In Astro, `<PostHeader title="…" lead="…" back={{ label: 'Blog', href: '/blog/' }} date="2026-10-20" author="…" minutes={4} tags={['Type']} />`. It writes Published, By, Reading and Topics, leaving out any you don't pass.

- The label is the `label` style in `ink`, `accent-text` and underlined on hover. One or two words.
- The title is bold and tight at `clamp(2.5rem, 6vw, 5rem)`, between `page-title` and `h2`, since post titles run longer. It stops at 18em wide, so a long title breaks into lines of a few words, and it wraps a long word.
- The byline is a row of small `muted` uppercase labels over their values, under a 2px `ink` rule; it wraps on phones.
- A cover image, if any, goes after the header: full width, 16:9 (`.media .media--16x9`), never behind the title.

## PostBody

Long-form text from Markdown: `.post-body` styles the plain elements inside it, so the Markdown needs no classes.

**Markup.** `<div class="post-body"><Content /></div>`, after the `PostHeader`.

- A 42rem measure by default (`max-w-*` on the same element changes it). Paragraphs and blocks are 1.25rem apart.
- `h2` opens with the 2px `ink` rule, like every section, at 1.75rem, 2.25rem from 768px; `h3` is the `title` size. Don't skip from the post's `h1` to an `h3`.
- Links underline and turn `accent-text` on hover, like `.link`.
- Lists have square markers (`ul`) or tabular numbers (`ol`), in `muted`.
- A quote is large and bold beside a 6px `accent` edge, the same edge as the active row. Keep quotes short; one or two per post.
- `hr` is a 2px `ink` rule. Images fill the measure, square, on `rule` until they load. A table has small uppercase headings over a 2px rule and 1px rules between rows.
- Code uses the kit's own `pre` and `code` styles.

**Don't.** Set a whole paragraph in a quote to make it stand out, or add colored callout boxes.

## PostNav

The previous and next posts, at the end of a post.

**Markup.**

```html
<nav class="post-nav" aria-label="More posts">
  <a href="/blog/older/" rel="prev"><span class="post-nav-label"><span aria-hidden="true">← </span>Previous</span><span class="post-nav-title">Older post</span></a>
  <a class="post-nav-next" href="/blog/newer/" rel="next"><span class="post-nav-label">Next<span aria-hidden="true"> →</span></span><span class="post-nav-title">Newer post</span></a>
</nav>
```

In Astro, `<PostNav prev={{ title, href }} next={{ title, href }} />` (`PostLink` in `kit/astro/types.ts`). Previous is the older post, Next the newer one; leave either off at the ends, and it draws nothing when both are off.

- A 2px `ink` rule, then a small `muted` label over each post's title, which underlines on hover.
- Stacked on phones with a 1px `rule` between; two columns from 640px, Next always on the right.
- The arrows are the font's own glyphs, hidden from screen readers.
