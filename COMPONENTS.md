# Swiss Minimal components

Markup and rules for each component. All classes live in `kit/theme.css`, which a Tailwind site loads through `kit/tailwind.css`. Add Tailwind utilities beside a kit class for layout and spacing (`class="field mb-7"`); the utility wins.

## TopBar

A sticky bar on `paper` that holds the site name, the menu button and the theme toggle, and ends in a 2px `ink` rule.

**Markup.** `<div class="topbar"><div class="page">` then a flex row with `border-bottom: 2px solid currentColor; padding: 0.75rem 0`. Left: the site name in `small` at weight 500. Right: a `.burger` and a `.topbar-btn--text` theme toggle, `space-2` apart.

**Behavior.** It is `position: sticky; top: 0; z-index: 50`. While the slide-down panel is open (`<html data-menu="open">`) it flips to `bar` / `bar-ink` so bar and panel read as one black block, and it stays above the panel (z-index 50 over 30) so the burger-turned-X stays reachable.

**Home link.** On a site with more than one page, the name links to the home page: `<a class="topbar-home" href="/">Site name</a>` inside the `small` text. It is plain text in the bar's color, underlined on hover, and carries `aria-current="page"` on the home page itself. `BaseLayout` does this whenever it has a menu; pass `home="/en/"` for another home, or `home={false}` to leave the name unlinked. A one-page site keeps the name as plain text.

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

A small red dot that tells a returning visitor something was added since they last looked: on the menu button's corner and after the label of the tab that lists what is new.

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
- The open list is the browser's own, always `ink` on `paper`, so it reads even when the field sits on a dark panel.
- For "nothing chosen yet", make the first option an empty-valued prompt ("Choose a topic"). For two to four choices, use radios instead: they show every option at once.
- `:disabled` drops to 60% with a not-allowed cursor.

## Switch

An on/off control for a setting that takes effect as a yes or no: a square track with a square thumb that slides right as the track fills.

**Markup.** `<label class="choice"><input class="switch" type="checkbox" role="switch" name="updates"> Email me when something is added</label>`

- **A real checkbox** with `role="switch"`: Space toggles it, it submits with a form, and screen readers say "on" / "off". No script.
- **On is the accent.** Off is a `currentColor` outline with a solid thumb on the left. On fills the track with `accent-text` and an `accent-ink` thumb; inside a panel or drawer, `accent-bright` with a `bar` thumb. It follows the site's accent, red or teal. The colors come from `--choice-on` and `--choice-thumb` on `.choice`.
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
- On hover and when active, the row fills (`row-hover-bg` / `row-active-bg`) and all text, muted included, turns `row-fg`. In dark mode the fill is a raised dark, never a cream slab, and the active row shows a red edge.
- Rows stack on phones; switch to columns from 768px.
- Keep the numbers when filtering; don't renumber.

## JumpToCurrent

A small solid triangle in a fixed bottom bar that appears while the current item's row is off screen, and brings it back: like a player's "show in list".

**Markup.**

```html
<div class="… bg-bar" data-jump-bar>
  <button type="button" class="jump-btn" data-jump data-jump-target='[data-item="field-notes"]'
          data-jump-name="Field notes" hidden><span aria-hidden="true" data-jump-glyph>▲</span></button>
  …
</div>
```

Load `kit/jump.js`. `data-jump-target` is a selector for the current row (default `.row[data-active="true"]`); with no match, the button stays hidden.

- **The font's own glyphs:** ▲ when the row is above or hidden by a filter, ▼ when it is below. 14px, `accent-bright` on the bar, in a 2rem square target.
- Shows only while the row is off the visible part of the page, between the top bar and the bottom bar (a sliver at the edge doesn't count). Re-checked on scroll, resize and any layout change.
- A click closes the menu and the drawer, sends `filter:reset` if a filter hides the row, scrolls the row to the middle of the screen (instantly with Reduce Motion), puts keyboard focus on its first link or button, and flashes a 3px `accent` outline that fades over 1.6s.
- **Name:** "Show Field notes in the list", plus "(shows all items)" when it will clear a filter. Hover label (`title`): "Show in the list".

**Don't.** Show it while the row is on screen, or use it for anything but the one current item.

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
- **Focus** goes to the heading on open (retried under Reduce Motion) and back to the button when closed by the button or Escape. While it is open, its button's outline and text turn `accent-bright` (red or teal, whichever the site uses), matching the drawer's heading; hovering fills it with the accent.
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

## ActivityIndicators

Two small moving marks: the equalizer (`.eq`, three `accent` bars) says "this is live / playing now"; the spinner (`.spinner`, a 2px `currentColor` ring with one side open) says "loading".

**Markup.** `<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>` and `<span class="spinner" role="status" aria-label="Loading"></span>`.

- The equalizer marks the one active item in a list (put it in the row's end slot). It is decorative: pair it with text or `aria-current` for screen readers.
- The spinner is one of only three round shapes in the system (`radius-round`), with the `NewDot` and the drawer's "more below" arrow.
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

## PageTitle

A title banner in place of a hero, for pages that need a name but not an introduction (a list, a form, a settings page): one `h1` across the full width of `.page`.

**Markup.** `<header class="page-title"><h1 class="page-title-text">All work</h1></header>`. Add `page-title--bar` to set it on a dark `bar` block with `bar-ink` text and an 8px `accent` rule along its bottom edge (plain `accent`, since it is a large shape; red or teal with the site).

- Bold, tight, `clamp(3rem, 9vw, 7.5rem)`: smaller than `display`, still the biggest thing on the page. A long word wraps instead of pushing the page sideways.
- Space like a hero's: `space-12` above, a little less below (more from 768px). No rule under it; the section below starts with its own 2px rule.
- The bar version spans the container, not the window, and keeps a margin above and below so it reads as a block on the page.
- One per page, and only on pages without a `Hero`.
- **In Astro,** `kit/astro/PageTitle.astro`: `<PageTitle title="All work" />`, or `tone="bar"` for the dark block. Put rich text in the default slot instead of `title`.

**Do.** Keep it to a few words. **Don't.** Add a lead line or an image to it; that is a `Hero`.
