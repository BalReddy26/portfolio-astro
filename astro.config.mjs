import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  integrations: [mdx()],
  output: 'static'
});



