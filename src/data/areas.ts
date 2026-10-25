// Area bocor di pencari solusi (bagian yang sama di semua bahasa).
// Nama, penjelasan, peran produk dan langkah kerja ada di src/i18n/{id,en,zh}.ts → `areas`.
// `sys` = nama produk persis seperti di products.ts; urutannya sama dengan `roles` di kamus.
export type AreaId = "dak" | "km" | "kolam" | "tandon" | "basement" | "retak";
export type Pressure = "positif" | "negatif" | "detail";

export interface Area { id: AreaId; pressure: Pressure[]; sys: string[] }

export const AREAS: Area[] = [
  { id: "dak", pressure: ["positif"], sys: ["Aquaflex Roof", "Mapeband", "Mapelastic Smart"] },
  { id: "km", pressure: ["positif"], sys: ["Mapelastic", "Mapeband"] },
  { id: "kolam", pressure: ["positif", "negatif"], sys: ["Mapelastic", "Silasec"] },
  { id: "tandon", pressure: ["positif", "negatif"], sys: ["Silasec", "Mapelastic Foundation"] },
  { id: "basement", pressure: ["negatif"], sys: ["Planiseal 88", "Silasec", "Mapelastic Foundation"] },
  { id: "retak", pressure: ["detail"], sys: ["Mapeband", "Bondcrete"] },
];
