import { getCollection, type CollectionEntry } from 'astro:content';
import type { Post } from '../design/kit/astro/types';

export type BlogEntry = CollectionEntry<'blog'>;

/** Every post, newest first. */
export async function getPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

/** Posts listed on each page of the index, under the featured one. */
export const PER_PAGE = 5;

/** The address of a page of the index: the first is /blog/ itself. */
export const pageUrl = (page: number) => (page === 1 ? '/blog/' : `/blog/page/${page}/`);

/**
 * The featured post and the rest, newest first. The newest post marked featured with a cover
 * wins; with none, the newest post with a cover.
 */
export async function getIndex(): Promise<{ featured?: BlogEntry; rest: BlogEntry[]; pages: number }> {
  const posts = await getPosts();
  const featured = posts.find((p) => p.data.featured && p.data.cover) ?? posts.find((p) => p.data.cover);
  const rest = posts.filter((p) => p !== featured);
  return { featured, rest, pages: Math.max(1, Math.ceil(rest.length / PER_PAGE)) };
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
