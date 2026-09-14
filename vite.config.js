import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'readable-development-shell',
    apply: 'serve',
    async transformIndexHtml(html, context) {
      if (!html.includes('<!--app-html-->')) return html;
      const { injectPage } = await context.server.ssrLoadModule('/scripts/render.tsx');
      return injectPage(html);
    },
  }],
  base: "/",
  // New shell uses tokenized CSS; leave the legacy Tailwind config untouched.
  css: { postcss: { plugins: [] } },
  build: { target: ['chrome107', 'edge107', 'firefox104', 'safari16'] },
});
