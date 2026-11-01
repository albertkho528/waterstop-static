import { defineConfig, fontProviders } from "astro/config";

const latinFallbacks = [
  "Helvetica Neue",
  "Arial",
  "PingFang SC",
  "Microsoft YaHei",
  "sans-serif",
];

// `site` is used for canonical, hreflang, og:url, sitemap.xml and structured data.
// Change it if the domain changes (remember the Sitemap line in public/robots.txt too).
export default defineConfig({
  site: "https://waterstop.id",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Archivo",
      cssVariable: "--font-archivo",
      display: "swap",
      fallbacks: latinFallbacks,
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["@fontsource/archivo/files/archivo-latin-400-normal.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["@fontsource/archivo/files/archivo-latin-500-normal.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["@fontsource/archivo/files/archivo-latin-600-normal.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["@fontsource/archivo/files/archivo-latin-700-normal.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Big Shoulders Display",
      cssVariable: "--font-big-shoulders",
      display: "swap",
      fallbacks: [
        "Oswald",
        "Arial Narrow",
        "Impact",
        "PingFang SC",
        "Microsoft YaHei",
        "sans-serif",
      ],
      options: {
        variants: [
          {
            weight: 700,
            style: "normal",
            src: [
              "@fontsource/big-shoulders-display/files/big-shoulders-display-latin-700-normal.woff2",
            ],
          },
          {
            weight: 800,
            style: "normal",
            src: [
              "@fontsource/big-shoulders-display/files/big-shoulders-display-latin-800-normal.woff2",
            ],
          },
          {
            weight: 900,
            style: "normal",
            src: [
              "@fontsource/big-shoulders-display/files/big-shoulders-display-latin-900-normal.woff2",
            ],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains",
      display: "swap",
      fallbacks: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "PingFang SC",
        "Microsoft YaHei",
        "monospace",
      ],
      options: {
        variants: [
          {
            weight: 500,
            style: "normal",
            src: [
              "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
            ],
          },
          {
            weight: 700,
            style: "normal",
            src: [
              "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2",
            ],
          },
        ],
      },
    },
  ],
  vite: {
    build: { chunkSizeWarningLimit: 800 },
  },
});
