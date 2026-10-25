# Waterstop Batam — website

Website Toko Waterstop (PT JMA), dibangun dengan [Astro](https://astro.build) dan [three.js](https://threejs.org).
Hasil build berupa file statis (HTML/CSS/JS), jadi bisa di-host di mana saja.

## Menjalankan

Butuh Node.js 22 atau lebih baru.

```bash
npm install
npm run dev       # http://localhost:4321, reload otomatis saat file diubah
npm run build     # hasil di folder dist/
npm run preview   # cek hasil build secara lokal
```

## Yang paling sering diubah

| Ingin mengubah | File |
| --- | --- |
| Nomor WA, alamat, jam buka, link Facebook/Instagram/TikTok | `src/data/store.ts` |
| Daftar produk Mapei & Bondall (nama, deskripsi, spesifikasi) | `src/data/products.ts` |
| Area bocor di pencari solusi dan tahap "Lapis demi lapis" | `src/data/areas.ts` |
| Foto proyek | taruh foto di `public/proyek/`, lalu isi `img` di `src/components/Projects.astro` |
| Warna, font, ukuran | variabel di bagian atas `src/styles/global.css` |
| Domain (untuk canonical & SEO) | `site` di `astro.config.mjs` |

Produk baru otomatis muncul di rak 3D, daftar produk, dan bisa dipakai di pencari solusi
(nama di `areas.ts` harus sama persis dengan nama di `products.ts`).

## Struktur

```
src/
  data/            data toko, produk, area — sumber tunggal semua konten
  components/      tiap section halaman (Hero, BuildStory, Finder, Products, ...)
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

## Deploy

**Paling mudah:** hubungkan repo ke Cloudflare Pages, Netlify atau Vercel.
Build command `npm run build`, output folder `dist`.

**Server sendiri dengan Docker:**

```bash
docker build -t waterstop-web .
docker run -d -p 8080:80 --name waterstop waterstop-web
```

Lalu arahkan domain / reverse proxy ke port 8080.
