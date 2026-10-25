// State bersama antara UI biasa dan adegan 3D.
export const REDUCE = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const state = {
  pSel: 0,
  buildQ: 0, // progres tahap pemasangan 0..6 (dari scroll)
  selectedArea: "dak" as string,
};

type Hooks = {
  houseFocus: (id: string, fly?: boolean) => void;
  pailGoTo: (i: number) => void;
};
export const hooks: Hooks = { houseFocus: () => {}, pailGoTo: () => {} };

export const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector(s) as T;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
