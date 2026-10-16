import type { Feature } from '../design/kit/astro/types';

/**
 * What the kit and this demo can do, newest first, for the Features tab in the menu. One entry
 * per thing a visitor would notice, dated the day it went live. Adding an entry at the top
 * shows the "new" dot on the menu button for returning visitors until they open the tab.
 */
export const features: Feature[] = [
  {
    date: '2026-10-16',
    title: 'Features',
    body: 'This list. A red dot on the menu button means something new has arrived since you last looked.',
  },
  {
    date: '2026-10-16',
    title: 'Recently viewed',
    body: 'The Recent button lists the pages you have opened here. It stays on this device.',
  },
  {
    date: '2026-10-16',
    title: 'Favorites',
    body: 'Star an item on the Work page, then choose Favorites in the filter to see only those.',
  },
  {
    date: '2026-10-16',
    title: 'Back to the current item',
    body: 'When Field notes has scrolled out of view, the red triangle in the bottom bar brings it back.',
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
