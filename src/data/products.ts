// Daftar produk (bagian yang sama di semua bahasa).
// Teks deskripsi tiap produk ada di src/i18n/{id,en,zh}.ts → `productText`, dengan kunci = nama produk.
export type Brand = "Mapei" | "Bondall";
// Bentuk kemasan pada model 3D, mengikuti kemasan asli dari pabrik:
// kit = sak bubuk + jeriken cairan (produk 2 komponen), sack = sak, pail = pail/drum, roll = gulungan, bottle = botol
export type Shape = "kit" | "sack" | "pail" | "roll" | "bottle";

export interface Product {
  brand: Brand;
  shape: Shape;
  name: string;
  /** Teks berat/volume yang tercetak di label model 3D, mis. { sack: "24 kg", can: "8 kg" }. */
  pack?: { sack?: string; can?: string; pail?: string; bottle?: string };
  /**
   * Foto produk asli (opsional). Taruh file PNG berlatar transparan di public/produk/,
   * lalu isi path-nya, mis. "/produk/mapelastic.png". Bila diisi, rak 3D dan panel detail
   * memakai foto ini menggantikan model kemasan.
   */
  photo?: string;
}

export const BRANDS: Brand[] = ["Mapei", "Bondall"];

export const BADGE: Record<Brand, [string, string]> = {
  Mapei: ["#0b5fb4", "#ffffff"],
  Bondall: ["#e7e9e6", "#0b0c0d"],
};
export const DOT: Record<Brand, string> = {
  Mapei: "#4a9fec",
  Bondall: "#e7e9e6",
};

export const PRODUCTS: Product[] = [
  {
    brand: "Mapei",
    shape: "kit",
    name: "Mapelastic",
    pack: { sack: "24 kg", can: "8 kg" },
  },
  {
    brand: "Mapei",
    shape: "kit",
    name: "Mapelastic Foundation",
    pack: { sack: "22 kg", can: "10 kg" },
  },
  {
    brand: "Mapei",
    shape: "sack",
    name: "Planiseal 88",
    pack: { sack: "25 kg" },
  },
  {
    brand: "Mapei",
    shape: "kit",
    name: "Planiseal 123",
    pack: { sack: "COMP. A", can: "4,5 kg" },
  },
  {
    brand: "Mapei",
    shape: "pail",
    name: "Aquaflex Roof 77",
    pack: { pail: "18 kg" },
  },
  { brand: "Mapei", shape: "roll", name: "Mapeband" },
  {
    brand: "Bondall",
    shape: "bottle",
    name: "Silasec",
    pack: { bottle: "2 L" },
  },
  {
    brand: "Bondall",
    shape: "bottle",
    name: "Bondcrete",
    pack: { bottle: "4 L" },
  },
];
