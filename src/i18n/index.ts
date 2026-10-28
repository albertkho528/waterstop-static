// Pusat bahasa: kamus per bahasa, alamat halaman, dan konten yang sudah diterjemahkan.
import { AREAS } from "../data/areas";
import { PRODUCTS } from "../data/products";
import { en } from "./en";
import { id } from "./id";
import type { Dict, Lang } from "./types";
import { zh } from "./zh";

export type { Dict, Lang };
export const LANGS: Lang[] = ["id", "en", "zh"];
export const DEFAULT_LANG: Lang = "id";
export const DICTS: Record<Lang, Dict> = { id, en, zh };
export const HREFLANG: Record<Lang, string> = {
  id: "id",
  en: "en",
  zh: "zh-Hans",
};

/** Alamat beranda tiap bahasa: "/" untuk Indonesia, "/en/" dan "/zh/" untuk lainnya. */
export const homePath = (lang: Lang) =>
  lang === DEFAULT_LANG ? "/" : `/${lang}/`;

import type { Product } from "../data/products";
export interface LProduct extends Product {
  type: string;
  desc: string;
  specs: [string, string][];
}
export interface LArea {
  id: string;
  name: string;
  title: string;
  pressure: ("positif" | "negatif" | "detail")[];
  why: string;
  sys: [string, string][];
  steps: string[];
}

/** Semua yang dibutuhkan halaman (dan skrip di browser) untuk satu bahasa. */
export function content(lang: Lang) {
  const t = DICTS[lang];
  const products: LProduct[] = PRODUCTS.map((p) => ({
    ...p,
    ...t.productText[p.name],
  }));
  const areas: LArea[] = AREAS.map((a) => {
    const tx = t.areas[a.id];
    return {
      id: a.id,
      pressure: a.pressure,
      name: tx.name,
      title: tx.title,
      why: tx.why,
      steps: tx.steps,
      sys: a.sys.map((name, i) => [name, tx.roles[i]] as [string, string]),
    };
  });
  return { lang, t, products, areas, steps: t.build.steps };
}
export type Content = ReturnType<typeof content>;

export const fill = (tpl: string, x: string) => tpl.replace("{x}", x);
