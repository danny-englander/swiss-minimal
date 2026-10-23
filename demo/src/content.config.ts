import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The blog's posts: one Markdown file each in src/content/blog/, named for its address
// (one-typeface.md is /blog/one-typeface/).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** YYYY-MM-DD, the day it was published. */
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      /** One or two sentences, for the index and the share preview. */
      summary: z.string(),
      author: z.string().default('Danny Englander'),
      tags: z.array(z.string()).default([]),
      /** Shown at the top of the index. The newest featured post wins; with none, the newest post. */
      featured: z.boolean().default(false),
      /** An image under the header, with its alt text; a featured post needs one. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

export const collections = { blog };
