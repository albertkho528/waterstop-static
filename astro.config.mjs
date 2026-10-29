import { defineConfig } from "astro/config";

// `site` is used for canonical, hreflang, og:url, sitemap.xml and structured data.
// Change it if the domain changes (remember the Sitemap line in public/robots.txt too).
export default defineConfig({
  site: "https://waterstop.id",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  vite: {
    build: { chunkSizeWarningLimit: 800 },
  },
});
