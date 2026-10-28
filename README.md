# Waterstop Batam — website

Website Toko Waterstop (PT JMA), dibangun dengan [Astro](https://astro.build) dan [three.js](https://threejs.org).
Hasil build berupa file statis (HTML/CSS/JS), jadi bisa di-host di mana saja.

## Menjalankan

Butuh Bun 1.4.4 (dipasang lewat Proto).

```bash
bun install
bun run dev       # http://localhost:4321
bun run build     # hasil di folder dist/
bun run typecheck
bun run preview
```

## Yang paling sering diubah

| Ingin mengubah | File |
| --- | --- |
| Nomor WA, alamat, link Facebook/Instagram/TikTok | `src/data/store.ts` |
| Semua teks halaman (judul, deskripsi, FAQ, pesan WhatsApp, jam buka) | `src/i18n/id.ts`, `en.ts`, `zh.ts` |
| Daftar produk (merek, nama, bentuk kemasan 3D) | `src/data/products.ts` + deskripsinya di `productText` tiap file bahasa |
| Foto produk asli di rak 3D | PNG berlatar transparan di `public/produk/`, lalu isi `photo` produk itu di `src/data/products.ts` |
| Logo | `public/brand/` (SVG + PNG), ikon di header ada di `src/components/Header.astro`, favicon di `public/favicon.svg` |
| Area bocor di pencari solusi | `src/data/areas.ts` + teksnya di `areas` tiap file bahasa |
| Foto proyek & toko | `public/proyek/` (WebP); urutan di `IMAGES` pada `src/components/Projects.astro`, teks di `projects.tiles` tiap file bahasa |
| Warna, font, ukuran | variabel di bagian atas `src/styles/global.css` |
| Domain (untuk canonical & SEO) | `site` di `astro.config.mjs` |

Model 3D tiap produk mengikuti bentuk kemasan aslinya (`shape` di `products.ts`): `kit` (sak + jeriken
untuk produk 2 komponen), `sack`, `pail`, `roll`, `bottle`. Label pada model digambar sendiri dari nama produk,
bukan salinan desain kemasan pabrik. Untuk tampilan paling mirip aslinya, pakai foto produk sendiri (`photo`).

Produk baru otomatis muncul di rak 3D, daftar produk, dan bisa dipakai di pencari solusi
(nama di `areas.ts` harus sama persis dengan nama di `products.ts`).

## Tiga bahasa

| Bahasa | Alamat | File teks |
| --- | --- | --- |
| Indonesia (utama) | `/` | `src/i18n/id.ts` |
| English | `/en/` | `src/i18n/en.ts` |
| 中文 (简体) | `/zh/` | `src/i18n/zh.ts` |

- Ketiga file bahasa punya kunci yang sama persis (dicek oleh TypeScript lewat `src/i18n/types.ts`).
  Kalau menambah teks di satu bahasa, tambahkan juga di dua lainnya; editor akan menandai yang terlewat.
- Produk baru: tambahkan di `products.ts`, lalu tulis deskripsinya di `productText` pada **ketiga** file bahasa.
- Pesan WhatsApp yang terisi otomatis memakai bahasa halaman yang sedang dibuka (`wa` di file bahasa),
  jadi pengunjung bisa menghubungi toko dalam bahasa Indonesia, Inggris atau Mandarin.
- Halaman Mandarin memuat font Noto Sans SC (hanya potongan huruf yang dipakai yang diunduh browser).
- Setiap halaman punya `hreflang` dan judul/deskripsi sendiri supaya Google menampilkan versi bahasa yang tepat.
  Isi `site` di `astro.config.mjs` dengan domain asli agar alamat-alamat itu lengkap.

## SEO

- Domain diatur di `astro.config.mjs` (`site: "https://waterstop.id"`) dan di baris `Sitemap` pada `public/robots.txt`.
- Setiap bahasa punya judul, deskripsi, `canonical`, `hreflang` (id, en, zh-Hans, x-default) dan gambar share sendiri
  (`public/og/og-id.png`, `og-en.png`, `og-zh.png`, 1200×630).
- `sitemap.xml` dibuat otomatis saat build, lengkap dengan pasangan hreflang.
- Data terstruktur (JSON-LD): bisnis lokal (alamat, telepon, peta, merek, katalog produk, layanan, bahasa layanan),
  WebSite, WebPage dan FAQPage.
- Judul utama (h1) berisi kalimat kata kunci yang tersembunyi secara visual (`h1sr` di file bahasa).
- Foto proyek dan foto toko punya teks alt per bahasa.
- Setelah online: daftarkan situs di Google Search Console, kirim `https://waterstop.id/sitemap.xml`,
  dan tambahkan link waterstop.id di Google Business Profile toko.

## Struktur

```
src/
  data/            data toko, produk, area (bagian yang sama di semua bahasa)
  i18n/            teks tiap bahasa: id.ts, en.ts, zh.ts (+ types.ts, index.ts)
  pages/           index.astro (ID), en/index.astro, zh/index.astro
  components/      Page.astro menyusun semua section; tiap section (Hero, BuildStory, Finder, ...) satu file
  layouts/Base.astro   <head>, SEO, data terstruktur Google (LocalBusiness)
  lib/templates.ts     template HTML yang dipakai server dan browser
  scripts/
    main.ts        titik masuk; tiap adegan 3D dimuat saat mendekati layar
    ui.ts          menu, pencari solusi, pilihan produk, tahap scroll
    three/         adegan 3D: hero, build (scroll story), house (rumah x-ray), pails (rak produk)
```

Catatan teknis:
- Font di-host sendiri lewat `@fontsource` (tidak bergantung Google Fonts).
- 3D hanya menggambar saat terlihat di layar, dan berhenti total bila pengguna memilih
  "kurangi animasi" di perangkatnya. Tanpa WebGL, halaman tetap lengkap dalam versi datar.
- Bentuk kemasan di rak 3D hanya ilustrasi; labelnya digambar dari data produk.

## Pre-commit

```bash
pre-commit install
```

## Deploy

Push ke `main` → Woodpecker membangun image → Flux image automation memperbarui
tag di `deploy/` → Flux menggulirkan pod.

- Registry: `registry.kudofools.dev/waterstop/waterstop-static`
- Namespace: `waterstop-static`
- Domain: `https://waterstop.id`
