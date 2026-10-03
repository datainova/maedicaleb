// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// No GitHub Pages o site fica em https://datainova.github.io/maedicaleb/.
// Com domínio próprio, basta definir SITE_URL e BASE_PATH=/ no deploy.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://datainova.github.io',
  base: process.env.BASE_PATH ?? '/maedicaleb',
  vite: { plugins: [tailwindcss()] },
});
