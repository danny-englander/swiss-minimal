// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // Icons are inlined as SVG at build time, from two sets only (see Iconography in DESIGN.md):
  // Simple Icons for brand marks, Material Symbols for a few actions.
  integrations: [icon()],
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
