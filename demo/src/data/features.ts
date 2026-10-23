import type { Feature } from '../design/kit/astro/types';

/**
 * What the kit and this demo can do, newest first, for the Features tab in the menu. One entry
 * per thing a visitor would notice, dated the day it went live. Adding an entry at the top
 * shows the "new" dot on the menu button for returning visitors until they open the tab.
 */
export const features: Feature[] = [
  {
    date: '2026-10-23',
    title: 'Blog pages',
    body: 'The blog lists five posts a page, with numbered pages and Newer and Older links at the foot. The featured post stays at the top of every page.',
    details: [
      'A new kit piece, `Pager` (`.pager`): outlined page numbers, filled for the page you are on, between a step back and a step on. Long runs collapse to 1 … 4 5 6 … 12.',
      'The first page is `/blog/`; the next are `/blog/page/2/` and on, each titled with its number.',
      'Five more sample posts, so the demo has a second page.',
      'Sites on the kit: copy the new `theme.css` and `Pager.astro` in. Nothing existing changes.',
    ],
  },
  {
    date: '2026-10-23',
    title: 'Larger body text',
    body: 'Body text is larger and more open: 20px with a line height of 1.8, 18px on phones. Intro lines grew a step to stay above it.',
    details: [
      'Body text is 1.25rem (Tailwind `text-xl`) from 768px and 1.125rem (`text-lg`) below, with a line height of 1.8.',
      '`.lead` is 1.5rem from 768px and 1.375rem below, so it stays a step above body text.',
      'The top bar, the panel, the drawer and the toast keep 1rem with a line height of 1.5: they are interface, not reading text.',
      'Sites on the kit: copy the new `theme.css` in. Text that inherits the body size grows with it; anything with its own size keeps it.',
    ],
  },
  {
    date: '2026-10-23',
    title: 'Code colors',
    body: 'Code blocks are highlighted in three colors: magenta keywords, teal strings and orange numbers and names, with comments in grey. See the code in Setting a grid before the words, on the Blog.',
    details: [
      'Code is the kit’s one exception to its single accent, as it already is to its single typeface. The colors appear only inside `pre` and `code`.',
      'Four new tokens, `code-keyword`, `code-string`, `code-constant` and `code-comment`, each with a dark version and a `-bright` one for the dark `.pre--bar` block. All pass 4.5:1.',
      'Sites on Astro: set `markdown.shikiConfig.theme` to `"css-variables"` and copy the new `theme.css` in; the kit maps Shiki’s variables to the tokens. Without it, Astro’s default GitHub theme sets its own dark background on Markdown code.',
      'By hand: wrap tokens in `.tok-keyword`, `.tok-string`, `.tok-constant` and `.tok-comment`.',
    ],
  },
  {
    date: '2026-10-23',
    title: 'Blog',
    body: 'A blog index that opens with a featured post beside a square image, then lists the rest by date. Posts get a byline under a thick rule, long-form text with quotes, lists and tables, and links to the previous and next posts. See Blog in the menu.',
    details: [
      'Five new kit pieces: `PostFeature` (`.post-feature`) for one post at the top of the index, set 50/50 beside a square image like a split hero, `PostList` (`.post-list`) for the rest, `PostHeader` (`.post-header`, `.post-meta`) for the top of a post, `.post-body` for Markdown text and `PostNav` (`.post-nav`) for the previous and next posts.',
      '`.post-body` styles plain elements, so Markdown needs no classes: h2 is set apart by size and space alone, quotes are large and bold beside a 6px accent edge, lists use square markers.',
      'The demo keeps its posts in an Astro content collection, `src/content/blog/`, one Markdown file per post.',
      'Sites on the kit: copy the new `theme.css`, `types.ts` and the four `Post*.astro` files in. Nothing existing changes.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'New accent names',
    body: 'The two accents have new names and the same colors: vermilion, the orange-leaning red of Swiss posters, and verdigris, the blue-green patina of old copper.',
    details: [
      'Red is now vermilion and teal is now verdigris; the colors themselves are unchanged.',
      'Every page names its accent: `<html data-accent="vermilion">` or `"verdigris"`. `BaseLayout` takes `accent="vermilion"` (the default) or `accent="verdigris"`.',
      'Sites on the kit: change `red` to `vermilion` and `teal` to `verdigris` wherever an accent is set, then copy the new kit in. The old names no longer work.',
      'The gear on the right edge of the demo previews both under their new names.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Dialog',
    body: 'A modal dialog on the browser’s own <dialog>, square with a thick rule over a flat dark backdrop, for a choice that needs an answer. Try Delete export on the Components page.',
    details: [
      'Built on the native `<dialog>` and `showModal()`: the page behind goes inert, Escape closes it, focus moves to the `autofocus` button and returns to the opener on close.',
      'Opens from a button with invoker commands (`commandfor` and `command="show-modal"`), no script needed; `kit/dialog.js` fills in for browsers that don’t run commands yet.',
      'Every button in its `<form method="dialog">` closes it and leaves its `value` in `dialog.returnValue`; `closedby="any"` closes it on a click outside, with the same fallback script.',
      'Kit styling: 2px rule in the text color, 1.75rem bold title, a close ✕ drawn from two bars, actions as a filled button and secondary buttons, a flat `bar` backdrop at 75% with no blur.',
      'Fades and rises in over 250ms and fades out, with `@starting-style`; no motion under Reduce Motion. The page doesn’t scroll behind it.',
      'New in the kit: `.dialog` in `theme.css`, `kit/dialog.js` and `Dialog.astro` (`id`, `title`, an `actions` slot, `lightDismiss`).',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Contact form',
    body: 'The form in the menu’s Contact tab now sends your message. If it can’t, it says so and keeps what you wrote.',
    details: [
      'Sends through Netlify Forms, without leaving the page; the messages land in the site’s Netlify dashboard.',
      'Only a message Netlify accepts closes the panel with a thank-you; a failed one stays in the form, with the reason beside the Send button where screen readers hear it.',
      'A hidden honeypot field turns away spam bots; Send is disabled while a message is on its way.',
      'The “Send me a copy” switch is gone, since Netlify Forms can’t email the sender.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Select lists in style',
    body: 'In Chrome and Edge, a select list now opens square, in the site’s type and colors, with the chosen item checked. Other browsers keep their own list. Try Topic on the Forms page.',
    details: [
      'Uses the browser’s customizable select (`appearance: base-select`), only where it is supported; elsewhere the native list opens as before.',
      'Still the real `<select>`: the keyboard, screen readers, form submission and phones’ own pickers all work unchanged, and no markup changes.',
      'The open list is square with a 2px rule in the text color, on the surface it opens from: the page, or the dark bar inside the panel.',
      'The option under the pointer or keyboard fills like a chip; the chosen one is bold, with a check drawn from two straight strokes in the accent.',
      'The chevron turns up while the list is open.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Dates, files and live output',
    body: 'Date and time fields with presets, a file picker, a panel that streams a task’s output and a summary of the results. Try an export on the Forms page.',
    details: [
      'Date and time fields: the browser’s own date, time, datetime-local and month inputs, styled as underlined fields with tabular digits; the calendar and clock icons follow the theme, dark bars included.',
      'Secondary button (`.btn-outline`, `.btn-group`): a sentence-case outlined button for every action beside the filled one, such as This month, Last month, 1st–15th and 16th–end presets that fill a date range.',
      'File picker (`FilePicker`, `kit/file-pick.js`): the real file input stays on the page, so the keyboard and screen readers use it; the field shows the chosen file, “3 files” or a folder’s name, and screen readers hear it as part of the name.',
      'Output panel (`OutputPanel`, `kit/output.js`): a status beside the heading with a spinner while running, and a fixed-height log that follows its newest line until you scroll up; screen readers hear “Running…” and “Finished”, not every line.',
      'Summary list (`SummaryList`): small uppercase labels beside their values, with thin rules between, stacked on phones.',
      'All five come together on the Forms page as an Export task, from choosing dates to the summary of a finished run.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Footer',
    body: 'Every page now ends with a footer: the site name and its pages, side by side from tablet width. The dark bar along the bottom is optional, and stays on Work and Components.',
    details: [
      'Footer (`Footer.astro`, `.site-footer`): the site name, a line about it and a note on the left; the site’s links on the right in two short columns, taken from the menu so they’re never kept twice. It stacks on phones.',
      'The current page is underlined in the accent; `tone="bar"` sets the footer on a dark block instead of the page.',
      'Bottom bar (`BottomBar.astro`, `.bottom-bar`): the fixed bar is now a component that a page opts into, with a label, a scrolling title and the jump-to-current button.',
      'The bar can carry a bold heading (an `h2`, or an `h3` with `headingLevel`), which also names it as a region for screen readers; the demo’s says “Bottom bar”.',
      'Pages without the bar keep no space for it, so the drawer and panel reach the bottom of the screen; with it, the footer ends exactly where the bar begins.',
      'The scrolling title’s script is now part of the kit as `kit/marquee.js`.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Number circles',
    body: 'A number can sit in a circle, outlined or solid, for the steps of a how-to or the numbers in a list. See the Components page.',
    details: [
      '`NumCircle.astro` and `.num-circle` / `.num-circle--solid`: one or two digits, padded to “02”, in a 2.25em circle sized by the text around it.',
      'Drawn in the text’s own color, so it follows muted text, a hovered or active list row and dark bars; the solid one cuts its digits out of the fill.',
      'In list rows the number column widens for it, keeping the circle clear of the active row’s accent edge.',
    ],
  },
  {
    date: '2026-10-21',
    title: 'Clearer thin rules',
    body: 'In dark mode, the thin lines between rows are brighter, so lists and sections read clearly.',
    details: [
      'The dark `rule` token goes from #2b2a27 (1.4:1 on the page) to #686764, 40% of the text color (3.5:1); light mode is unchanged.',
      'On the Components page, a list sample no longer ends in two lines where one belongs.',
    ],
  },
  {
    date: '2026-10-20',
    title: 'Agents',
    body: 'How to build or restyle a site with the kit using an AI coding agent, with a starting AGENTS.md for your own site. Agents that read the web can start at /llms.txt. In the menu.',
  },
  {
    date: '2026-10-20',
    title: 'Components',
    body: 'Every component in the kit on one page, 36 of them, from buttons to the dialog, with the pieces that frame the page listed at the end. In the menu.',
    details: [
      'Now 36 entries, adding the secondary button, date and time fields, file picker, summary list, output panel, dialog, number circle and footer.',
      'Entries number themselves in page order, and each number sits on its name’s baseline, as group ranges do.',
      'The oval badge entry lists its sizes, `text-sm` to `text-4xl`, with each badge labelled; the page title and menu accordions are shown live.',
    ],
  },
  {
    date: '2026-10-20',
    title: 'Oval badges',
    body: 'Short codes like CH sit in an oval, like the sticker on a Swiss car, plain or solid, in light and dark. See the About page.',
  },
  {
    date: '2026-10-20',
    title: 'Code',
    body: 'Code, commands and keys are set in Source Code Pro, the same on every device, and terminal output sits on a dark block. See the About page.',
  },
  {
    date: '2026-10-20',
    title: 'Larger site name',
    body: 'The site name at the top left of the bar, the link home, is now 16px, the size of body text.',
  },
  {
    date: '2026-10-19',
    title: 'Vermilion or verdigris',
    body: 'A site picks one accent, vermilion or verdigris. The gear on the right edge previews both.',
  },
  {
    date: '2026-10-19',
    title: 'Form controls',
    body: 'Switches, radio buttons and a select list, on the Forms page and in the Contact tab.',
  },
  {
    date: '2026-10-19',
    title: 'Page titles',
    body: 'Pages without a hero open with one big title across the page, as on Work and Forms.',
  },
  {
    date: '2026-10-16',
    title: 'Features',
    body: 'This list. A dot in the accent on the menu button means something new has arrived since you last looked.',
  },
  {
    date: '2026-10-16',
    title: 'Recently viewed',
    body: 'The Recent button lists the pages you have opened here, with links to share or look each one up on Bluesky, Instagram and YouTube. It stays on this device.',
  },
  {
    date: '2026-10-16',
    title: 'Favorites',
    body: 'Star an item on the Work page, then choose Favorites in the filter to see only those.',
  },
  {
    date: '2026-10-16',
    title: 'Back to the current item',
    body: 'When Field notes has scrolled out of view, the triangle in the bottom bar brings it back.',
  },
  {
    date: '2026-10-16',
    title: 'Menu pages',
    body: 'The menu has numbered tabs, and each one has its own link, such as #contact.',
  },
  {
    date: '2026-10-14',
    title: 'First version',
    body: 'Menu with nested accordions, light and dark themes, filters, a scrolling title and a toast.',
  },
];

/** The newest feature's date; the "new" dot compares against it. */
export const latestFeatureDate = features[0].date;
