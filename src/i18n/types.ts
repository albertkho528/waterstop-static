// Bentuk kamus terjemahan. Ketiga bahasa (id, en, zh) wajib mengisi semua kunci ini.
export type Lang = "id" | "en" | "zh";

export interface ProductText {
  type: string;
  desc: string;
  specs: [string, string][];
}
export interface AreaText {
  name: string;
  title: string;
  why: string;
  roles: string[];
  steps: string[];
}
export interface StepText {
  title: string;
  text: string;
  meta: string;
  status: string;
}
export interface LayerText {
  name: string;
  short: string;
  sub?: string;
}
type SecHead = { label: string; h2: [string, string]; lead?: string };

export interface Dict {
  htmlLang: string;
  langName: string; // label di pemilih bahasa
  meta: { title: string; desc: string; ogAlt: string };
  nav: {
    system: string;
    find: string;
    products: string;
    services: string;
    contact: string;
    aria: string;
    langAria: string;
  };
  skip: string;
  brandAria: string;
  cure: string;
  consult: string;
  menu: string;
  close: string;
  layer: string;
  wa: {
    default: string;
    leak: string;
    survey: string;
    product: string;
    contractor: string;
    developer: string;
  };
  hero: {
    eyebrow: string;
    h1: [string, string];
    h1sr: string;
    ntu: string;
    lede: string;
    ctaWa: string;
    ctaFind: string;
    meta: string[];
    rating: string;
    stageAria: string;
    hudTl: string;
    hudTr: [string, string];
    hudBl: string;
  };
  layers: Record<"beton" | "primer" | "mesh" | "membran" | "top", LayerText>;
  tapes: { a: string[]; b: string[] };
  problems: SecHead & { items: [string, string, string][] };
  build: SecHead & {
    stageAria: string;
    hudTl: string;
    status: string;
    steps: StepText[];
  };
  finder: SecHead & {
    chipsAria: string;
    stageAria: string;
    hudTl: string;
    hudBr: string;
    pressure: { positif: string; negatif: string; detail: string };
    sysHead: string;
    stepsHead: string;
    ctaPrice: string;
    ctaSurvey: string;
  };
  areas: Record<
    "dak" | "km" | "kolam" | "tandon" | "basement" | "retak",
    AreaText
  >;
  products: SecHead & {
    stageAria: string;
    hudTr: string;
    prev: string;
    next: string;
    ctaPrice: string;
    tdsNote: string;
  };
  productText: Record<string, ProductText>;
  services: SecHead & {
    items: [string, string][];
    team: {
      eyebrow: string;
      title: string;
      body: string;
      creds: [string, string][];
    };
  };
  projects: SecHead & { slot: string; tiles: [string, string][] };
  audience: SecHead & { items: [string, string, string][] };
  faq: SecHead & { items: [string, string][] };
  contact: {
    eyebrow: [string, string];
    h2: [string, string];
    lead: string;
    phone: string;
    address: string;
    hours: string;
    google: string;
    brands: string;
    copy: string;
    copied: string;
    directions: string;
    hoursValue: string;
    ratingShort: string;
    store: string;
  };
  footer: { area: string; tm: string };
}
