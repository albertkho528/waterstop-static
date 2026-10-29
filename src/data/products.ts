// Product list (the same part in every language).
// Description text for each product is in src/i18n/{id,en,zh}.ts → `productText`, keyed by product name.
export type Brand = "Mapei" | "Bondall";
// Package shape for the 3D model, following the real factory packaging:
// kit = powder sack + liquid jerrycan (two-component product), sack = sack, pail = pail/drum, roll = roll, bottle = bottle
export type Shape = "kit" | "sack" | "pail" | "roll" | "bottle";

export interface Product {
  brand: Brand;
  shape: Shape;
  name: string;
  /** Weight/volume text printed on the 3D model label, e.g. { sack: "24 kg", can: "8 kg" }. */
  pack?: { sack?: string; can?: string; pail?: string; bottle?: string };
  /**
   * Real product photo (optional). Put a PNG with a transparent background in public/produk/,
   * then fill in its path, e.g. "/produk/mapelastic.png". When set, the 3D shelf and the detail panel
   * use this photo instead of the package model.
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
