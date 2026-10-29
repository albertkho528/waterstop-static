# Waterstop Batam — website

Website for Toko Waterstop (PT JMA), built with [Astro](https://astro.build) and [three.js](https://threejs.org).
The build output is static files (HTML/CSS/JS), so it can be hosted anywhere.

## Running

Requires Bun 1.4.4 (installed through Proto).

```bash
bun install
bun run dev       # http://localhost:4321
bun run build     # output in dist/
bun run typecheck
bun run lint
bun run format
bun run preview
```

## What you will change most often

| What you want to change                                               | File                                                                                                                          |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| WhatsApp number, address, Facebook/Instagram/TikTok links             | `src/data/store.ts`                                                                                                           |
| All page text (headings, descriptions, FAQ, WhatsApp messages, hours) | `src/i18n/id.ts`, `en.ts`, `zh.ts`                                                                                            |
| Product list (brand, name, 3D package shape)                          | `src/data/products.ts` + its descriptions in `productText` in each language file                                              |
| Real product photos on the 3D shelf                                   | Transparent-background PNGs in `public/produk/`, then set the product's `photo` in `src/data/products.ts`                     |
| Logo                                                                  | `public/brand/` (SVG + PNG), the header icon is in `src/components/Header.astro`, the favicon in `public/favicon.svg`         |
| Leak areas in the solution finder                                     | `src/data/areas.ts` + their text in `areas` in each language file                                                             |
| Project and store photos                                              | `public/proyek/` (WebP); order in `IMAGES` in `src/components/Projects.astro`, text in `projects.tiles` in each language file |
| Colours, fonts, sizes                                                 | variables at the top of `src/styles/global.css`                                                                               |
| Domain (for canonical & SEO)                                          | `site` in `astro.config.mjs`                                                                                                  |

Each product's 3D model follows its real package shape (`shape` in `products.ts`): `kit` (sack + jerrycan
for two-component products), `sack`, `pail`, `roll`, `bottle`. Labels on the models are drawn from the product
name, not copies of the factory packaging design. For the closest match to the real thing, use your own
product photos (`photo`).

New products automatically appear on the 3D shelf and in the product list, and can be used in the solution
finder (the name in `areas.ts` must match the name in `products.ts` exactly).

## Three languages

| Language          | Address | Text file        |
| ----------------- | ------- | ---------------- |
| Indonesian (main) | `/`     | `src/i18n/id.ts` |
| English           | `/en/`  | `src/i18n/en.ts` |
| 中文 (简体)       | `/zh/`  | `src/i18n/zh.ts` |

- All three language files have exactly the same keys (checked by TypeScript via `src/i18n/types.ts`).
  If you add text in one language, add it in the other two as well; the editor will flag anything missing.
- New product: add it in `products.ts`, then write its description in `productText` in **all three** language files.
- The pre-filled WhatsApp message uses the language of the page currently open (`wa` in the language file),
  so visitors can contact the store in Indonesian, English or Mandarin.
- The Mandarin page loads the Noto Sans SC font (the browser only downloads the character subsets it uses).
- Each page has its own `hreflang` and title/description so Google shows the right language version.
  Set `site` in `astro.config.mjs` to the real domain so those addresses are complete.

## SEO

- The domain is set in `astro.config.mjs` (`site: "https://waterstop.id"`) and on the `Sitemap` line in `public/robots.txt`.
- Each language has its own title, description, `canonical`, `hreflang` (id, en, zh-Hans, x-default) and share image
  (`public/og/og-id.png`, `og-en.png`, `og-zh.png`, 1200×630).
- `sitemap.xml` is generated automatically at build time, complete with hreflang pairs.
- Structured data (JSON-LD): local business (address, phone, map, brands, product catalogue, services, service languages),
  WebSite, WebPage and FAQPage.
- The main heading (h1) contains the keyword sentence visually hidden (`h1sr` in the language file).
- Project photos and store photos have alt text per language.
- Once online: register the site with Google Search Console, submit `https://waterstop.id/sitemap.xml`,
  and add the waterstop.id link to the store's Google Business Profile.

## Structure

```
src/
  data/            store, product and area data (the same part in every language)
  i18n/            text per language: id.ts, en.ts, zh.ts (+ types.ts, index.ts)
  pages/           index.astro (ID), en/index.astro, zh/index.astro
  components/      Page.astro assembles all sections; each section (Hero, BuildStory, Finder, ...) is one file
  layouts/Base.astro   <head>, SEO, Google structured data (LocalBusiness)
  lib/templates.ts     HTML templates used by both server and browser
  scripts/
    main.ts        entry point; each 3D scene loads when it is about to enter the screen
    ui.ts          menu, solution finder, product selection, scroll stages
    three/         3D scenes: hero, build (scroll story), house (x-ray house), pails (product shelf)
```

Technical notes:

- Fonts are self-hosted through `@fontsource` (no dependency on Google Fonts).
- 3D only draws while visible on screen, and stops entirely when the user chooses
  "reduce motion" on their device. Without WebGL the page is still complete in a flat version.
- Package shapes on the 3D shelf are only illustrations; their labels are drawn from the product data.

## Pre-commit

```bash
pre-commit install
```

The hook runs format, lint and typecheck before each commit.

## Deploy

Push to `main` → Woodpecker builds the image → Flux image automation updates the
tag in `deploy/` → Flux rolls the pod.

- Registry: `registry.kudofools.dev/waterstop/waterstop-static`
- Namespace: `waterstop-static`
- Domain: `https://waterstop.id`
