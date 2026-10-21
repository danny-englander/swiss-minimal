import type { Feature } from '../design/kit/astro/types';

/**
 * What the kit and this demo can do, newest first, for the Features tab in the menu. One entry
 * per thing a visitor would notice, dated the day it went live. Adding an entry at the top
 * shows the "new" dot on the menu button for returning visitors until they open the tab.
 */
export const features: Feature[] = [
  {
    date: '2026-10-21',
    title: 'Select lists in style',
    body: 'In Chrome and Edge, a select list now opens square, in the site’s type and colors, with the chosen item checked. Other browsers keep their own list. Try Topic on the Forms page.',
  },
  {
    date: '2026-10-21',
    title: 'Dates, files and live output',
    body: 'Date and time fields with presets, a file picker, a panel that streams a task’s output and a summary of the results. Try an export on the Forms page.',
  },
  {
    date: '2026-10-21',
    title: 'Footer',
    body: 'Every page now ends with a footer: the site name and its pages, side by side from tablet width. The dark bar along the bottom is optional, and stays on Work and Components.',
  },
  {
    date: '2026-10-21',
    title: 'Number circles',
    body: 'A number can sit in a circle, outlined or solid, for the steps of a how-to or the numbers in a list. See the Components page.',
  },
  {
    date: '2026-10-20',
    title: 'Agents',
    body: 'How to build or restyle a site with the kit using an AI coding agent, with a starting AGENTS.md for your own site. Agents that read the web can start at /llms.txt. In the menu.',
  },
  {
    date: '2026-10-20',
    title: 'Components',
    body: 'Every component in the kit on one page, from buttons to oval badges, with the pieces that frame the page listed at the end. In the menu.',
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
