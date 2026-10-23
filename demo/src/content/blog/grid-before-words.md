---
title: Setting a grid before the words
date: '2026-09-30'
summary: Columns decided up front keep labels, titles and descriptions lined up on every page. A short walk through the kit's one grid.
tags: [Layout, Tailwind]
---

A Swiss layout is mostly decided before any text arrives. The grid comes first, and the words fall into it.

## One grid, used everywhere

The kit has one set of columns for lists: a narrow one for numbers, a wide one for names, and a slim one at the end for an indicator or a star. The section heading above a list uses the same columns, so its range label sits over the numbers and its title over the names.

Here is the whole thing as Tailwind utilities:

```html
<li class="row grid md:grid-cols-[3rem_1fr_2.75rem]">
  <span class="num small muted">01</span>
  <span class="title">Field notes</span>
  <span><!-- indicator --></span>
</li>
```

On phones the row stacks. From 768px it becomes the three columns.

The section header's range label comes from the same numbers as the rows:

```ts
// "01–06": the first and last row numbers, padded to two digits.
const pad = (n: number) => String(n).padStart(2, '0');

export function range(items: { num: number }[]): string {
  if (items.length === 0) return '';
  return `${pad(items[0].num)}–${pad(items.at(-1)!.num)}`;
}
```

## The steps, in order

1. Pick the content width. This kit uses 88rem, centered, with a 1rem gutter that grows to 2rem.
2. Pick the list columns, and reuse them for every section header.
3. Pick the measure for running text. About 42rem, or 65 to 75 characters a line.
4. Only then write the page.

## Where each width goes

| Width | Used for |
| --- | --- |
| 88rem | The page: hero, page title, lists, footer |
| 42rem | Running text, like this post |
| 28rem | A hero's lead line and the footer's note |

A table is a grid too. It gets the same rules: a 2px line under the header, thin ones between rows, and small uppercase labels at the top.
