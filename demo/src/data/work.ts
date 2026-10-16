export type Category = 'writing' | 'design' | 'tools';

export const categories: { id: Category; label: string }[] = [
  { id: 'writing', label: 'Writing' },
  { id: 'design', label: 'Design & code' },
  { id: 'tools', label: 'Tools' },
];

export interface WorkItem {
  title: string;
  category: Category;
  year: number;
  /** Only items with a slug get their own page. */
  slug?: string;
  meta?: string;
  site?: string;
  body?: string[];
}

const items: WorkItem[] = [
  {
    title: 'Field notes',
    category: 'writing',
    year: 2026,
    slug: 'field-notes',
    meta: 'Essay, 2026 · 12 min read',
    site: 'https://example.com/field-notes',
    body: [
      'A short essay on working with a single typeface. Notes kept over a year of small projects, on what one family can carry when weight and size do all the work.',
      'The argument is simple: fewer choices make the remaining ones visible. A heading is a heading because of its size, not its color or its box.',
    ],
  },
  { title: 'On grids', category: 'writing', year: 2026, meta: 'Essay, 2026' },
  { title: 'Release notes helper', category: 'tools', year: 2026, meta: 'Tool, 2026' },
  {
    title: 'A type specimen',
    category: 'design',
    year: 2025,
    slug: 'type-specimen',
    meta: 'Design, 2025 · Web',
    site: 'https://example.com/type-specimen',
    body: [
      'A one-page specimen for a grotesque variable font, set at every size the system uses, from 14px captions up to the display hero.',
      'Each line is live text, so the specimen doubles as a check that nothing on the page falls under the 14px floor.',
    ],
  },
  { title: 'Small tools', category: 'tools', year: 2025, meta: 'Code, 2025' },
  { title: 'Reading list', category: 'writing', year: 2025, meta: 'Notes, 2025' },
  { title: 'Contrast checker', category: 'tools', year: 2025, meta: 'Tool, 2025' },
  { title: 'Colour tokens', category: 'design', year: 2024, meta: 'Design, 2024' },
  { title: 'Static site starter', category: 'design', year: 2024, meta: 'Code, 2024' },
];

/** Every item with a stable id (its slug, or its title in kebab case), for favorites and links. */
export const work = items.map((item) => ({
  ...item,
  id: item.slug ?? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
}));
