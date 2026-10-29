// Leak areas in the solution finder (the same part in every language).
// Names, explanations, product roles and work steps are in src/i18n/{id,en,zh}.ts → `areas`.
// `sys` = product names exactly as in products.ts; their order matches `roles` in the dictionary.
export type AreaId = "dak" | "km" | "kolam" | "tandon" | "basement" | "retak";
export type Pressure = "positif" | "negatif" | "detail";

export interface Area {
  id: AreaId;
  pressure: Pressure[];
  sys: string[];
}

export const AREAS: Area[] = [
  { id: "dak", pressure: ["positif"], sys: ["Aquaflex Roof 77", "Mapeband"] },
  {
    id: "km",
    pressure: ["positif"],
    sys: ["Mapelastic", "Planiseal 123", "Mapeband"],
  },
  {
    id: "kolam",
    pressure: ["positif", "negatif"],
    sys: ["Mapelastic", "Silasec"],
  },
  {
    id: "tandon",
    pressure: ["positif", "negatif"],
    sys: ["Silasec", "Mapelastic Foundation"],
  },
  {
    id: "basement",
    pressure: ["negatif"],
    sys: ["Planiseal 88", "Silasec", "Mapelastic Foundation"],
  },
  { id: "retak", pressure: ["detail"], sys: ["Mapeband", "Bondcrete"] },
];
