// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // The live address, www as on Netlify. Share tags, canonical URLs and the sitemap are built on
  // it, and every page address ends in a slash (pages build as folders: about/index.html).
  site: 'https://www.swissminimal.ch',
  // Icons are inlined as SVG at build time, from two sets only (see Iconography in DESIGN.md):
  // Simple Icons for brand marks, Material Symbols for a few actions.
  // The sitemap lists every built page at /sitemap-index.xml.
  integrations: [icon(), sitemap()],
  // Listen on all interfaces so the dev server is reachable from a phone on the same Wi-Fi
  // (use the "Network" URL Astro prints). If the port is taken, Vite moves to the next free one.
  server: { host: true },
  vite: {
    plugins: [tailwindcss()],
    // A background dev server (started with `astro dev --background`, e.g. by an assistant)
    // gets its own Vite cache, so it never fights a server you run yourself with `npm run dev`.
    cacheDir: process.env.ASTRO_DEV_BACKGROUND ? 'node_modules/.vite-background' : undefined,
  },
});
