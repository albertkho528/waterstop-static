// HTML templates dipakai di server (render awal) dan di browser (saat pengguna memilih).
import { AREAS, type Area } from "../data/areas";
import { PRODUCTS, BADGE, DOT, type Product } from "../data/products";
import { STORE, waLink } from "../data/store";

export const esc = (s: string) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

const waAttrs = (text: string) =>
  `href="${waLink(text)}"${STORE.wa ? ' target="_blank" rel="noopener"' : ""}`;

export function areaResult(a: Area = AREAS[0]): string {
  const tags = (["positif", "negatif", "detail"] as const)
    .map((t) => `<span class="chip ${a.pressure.includes(t) ? "on" : ""}">${t === "detail" ? "Detail" : "Tekanan " + t}</span>`)
    .join("");
  const sys = a.sys
    .map(([n, role]) => {
      const p = PRODUCTS.find((x) => x.name === n)!;
      return `<li><button type="button" data-prod="${esc(n)}"><b><span class="dot" style="background:${DOT[p.brand]}"></span>${esc(n)}</b><span>${p.brand}<br>${esc(role)}</span></button></li>`;
    })
    .join("");
  const t = a.title.toLowerCase();
  return `<h3>${esc(a.title)}</h3><div class="pressure">${tags}</div><p class="why">${esc(a.why)}</p>
<div><div class="mini-h">Sistem yang biasa kami pakai</div><ul class="sys">${sys}</ul></div>
<div><div class="mini-h">Urutan kerja</div><ol class="steps">${a.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
<div class="cta-row"><a class="btn primary sm" ${waAttrs(`Halo Waterstop, saya ada masalah bocor di ${t}. Bisa dibantu?`)}>Tanya stok &amp; harga →</a><a class="btn sm" ${waAttrs(`Halo Waterstop, saya mau jadwalkan survei untuk ${t}.`)}>Minta survei</a></div>`;
}

export function productDetail(p: Product = PRODUCTS[0]): string {
  return `<span class="badge" style="background:${BADGE[p.brand][0]};color:${BADGE[p.brand][1]}">${p.brand}</span><h3>${esc(p.name)}</h3><span class="type">${esc(p.type)}</span><p>${esc(p.desc)}</p>
<dl class="specs">${p.specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
<div class="cta-row"><a class="btn primary sm" ${waAttrs(`Halo Waterstop, saya mau tanya stok dan harga ${p.brand} ${p.name}.`)}>Tanya harga →</a></div>`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
