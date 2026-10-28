// sitemap.xml dengan pasangan hreflang untuk ketiga bahasa (dibuat saat build).
import type { APIRoute } from "astro";

import { DEFAULT_LANG, homePath, HREFLANG, LANGS } from "../i18n";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://waterstop.id");
  const abs = (p: string) => new URL(p, base).toString();
  const today = new Date().toISOString().slice(0, 10);
  const alternates = [
    ...LANGS.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${abs(homePath(l))}"/>`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(homePath(DEFAULT_LANG))}"/>`,
  ].join("\n");
  const urls = LANGS.map(
    (l) => `  <url>
    <loc>${abs(homePath(l))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === DEFAULT_LANG ? "1.0" : "0.9"}</priority>
${alternates}
  </url>`,
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
