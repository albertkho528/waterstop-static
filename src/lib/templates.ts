// HTML templates used on the server (initial render) and in the browser (when the user makes a choice).
import { BADGE, DOT } from "../data/products";
import { STORE, waLink } from "../data/store";
import type { Dict, LArea, LProduct } from "../i18n";
import { fill } from "../i18n";

export const esc = (s: string) =>
  String(s).replace(
    /[&<>"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );

const waAttrs = (text: string) =>
  `href="${waLink(text)}"${STORE.wa ? ' target="_blank" rel="noopener"' : ""}`;

export function areaResult(a: LArea, t: Dict, products: LProduct[]): string {
  const tags = (["positif", "negatif", "detail"] as const)
    .map(
      (k) =>
        `<span class="chip ${a.pressure.includes(k) ? "on" : ""}">${esc(t.finder.pressure[k])}</span>`,
    )
    .join("");
  const sys = a.sys
    .map(([n, role]) => {
      const p = products.find((x) => x.name === n)!;
      return `<li><button type="button" data-prod="${esc(n)}"><b><span class="dot" style="background:${DOT[p.brand]}"></span>${esc(n)}</b><span>${p.brand}<br>${esc(role)}</span></button></li>`;
    })
    .join("");
  const x = a.title.toLowerCase();
  return `<h3>${esc(a.title)}</h3><div class="pressure">${tags}</div><p class="why">${esc(a.why)}</p>
<div><div class="mini-h">${esc(t.finder.sysHead)}</div><ul class="sys">${sys}</ul></div>
<div><div class="mini-h">${esc(t.finder.stepsHead)}</div><ol class="steps">${a.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
<div class="cta-row"><a class="btn primary sm" ${waAttrs(fill(t.wa.leak, x))}>${esc(t.finder.ctaPrice)}</a><a class="btn sm" ${waAttrs(fill(t.wa.survey, x))}>${esc(t.finder.ctaSurvey)}</a></div>`;
}

export function productDetail(p: LProduct, t: Dict): string {
  return `<span class="badge" style="background:${BADGE[p.brand][0]};color:${BADGE[p.brand][1]}">${p.brand}</span><h3>${esc(p.name)}</h3><span class="type">${esc(p.type)}</span>${p.photo ? `<img class="pphoto" src="${esc(p.photo)}" alt="${esc(p.brand + " " + p.name)}" loading="lazy">` : ""}<p>${esc(p.desc)}</p>
<dl class="specs">${p.specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
<div class="cta-row"><a class="btn primary sm" ${waAttrs(fill(t.wa.product, `${p.brand} ${p.name}`))}>${esc(t.products.ctaPrice)}</a></div>`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
