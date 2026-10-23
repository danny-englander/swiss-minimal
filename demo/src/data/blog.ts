import { getCollection, type CollectionEntry } from 'astro:content';
import type { Post } from '../design/kit/astro/types';

export type BlogEntry = CollectionEntry<'blog'>;

/** Every post, newest first. */
export async function getPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

/** Reading time in whole minutes, at 225 words a minute. */
export const minutes = (entry: BlogEntry) =>
  Math.max(1, Math.ceil((entry.body ?? '').split(/\s+/).filter(Boolean).length / 225));

export const href = (entry: BlogEntry) => `/blog/${entry.id}/`;

/** A post as PostList takes it. */
export const toPost = (entry: BlogEntry): Post => ({
  title: entry.data.title,
  href: href(entry),
  date: entry.data.date,
  summary: entry.data.summary,
  meta: [...entry.data.tags, `${minutes(entry)} min read`].join(' · '),
});
