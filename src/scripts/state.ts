// Shared state between the regular UI and the 3D scenes, plus the language data for this page.
import type { Dict, Lang, LArea, LProduct } from "../i18n";
import type { StepText } from "../i18n/types";

export const REDUCE =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Language data that Page.astro embeds in <script id="i18n-data">. */
export interface ClientData {
  lang: Lang;
  products: LProduct[];
  areas: LArea[];
  steps: StepText[];
  t: Pick<Dict, "htmlLang" | "layers" | "wa" | "finder" | "products"> & {
    build: { status: string };
    contact: { copy: string; copied: string };
  };
}
export const data: ClientData = JSON.parse(
  document.getElementById("i18n-data")!.textContent || "{}",
);

export const state = {
  pSel: 0,
  buildQ: 0, // installation stage progress 0..6 (from scroll)
  selectedArea: data.areas[0].id as string,
};

type Hooks = {
  houseFocus: (id: string, fly?: boolean) => void;
  pailGoTo: (i: number) => void;
};
export const hooks: Hooks = { houseFocus: () => {}, pailGoTo: () => {} };

export const $ = <T extends Element = HTMLElement>(
  s: string,
  el: ParentNode = document,
) => el.querySelector(s) as T;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
