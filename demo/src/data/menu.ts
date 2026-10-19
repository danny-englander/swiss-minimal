import type { MenuItem } from '../design/kit/astro/types';

const menu: MenuItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Work',
    children: [
      { label: 'All work', href: '/work' },
      {
        label: 'Projects',
        children: [
          { label: 'Field notes', href: '/work/field-notes' },
          { label: 'A type specimen', href: '/work/type-specimen' },
        ],
      },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Forms', href: '/forms' },
];

/** The menu with the current page marked, and the accordions around it opened. */
export function menuFor(pathname: string): MenuItem[] {
  const path = pathname.replace(/\/$/, '') || '/';
  const mark = (items: MenuItem[]): MenuItem[] =>
    items.map((item) => {
      if (item.children) {
        const children = mark(item.children);
        const open = children.some((c) => c.current || c.open);
        return { ...item, children, open };
      }
      return { ...item, current: item.href === path };
    });
  return mark(menu);
}
