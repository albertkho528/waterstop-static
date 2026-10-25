import { defineConfig } from "astro/config";

// Isi `site` dengan domain asli saat deploy (dipakai untuk canonical & og:url).
export default defineConfig({
  // site: "https://waterstopbatam.com",
  build: { inlineStylesheets: "auto" },
  vite: {
    build: { chunkSizeWarningLimit: 800 },
  },
});
