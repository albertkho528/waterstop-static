import { defineConfig } from "astro/config";

// `site` dipakai untuk canonical, hreflang, og:url, sitemap.xml dan data terstruktur.
// Ganti bila domain berubah (ingat juga baris Sitemap di public/robots.txt).
export default defineConfig({
  site: "https://waterstop.id",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  vite: {
    build: { chunkSizeWarningLimit: 800 },
  },
});
