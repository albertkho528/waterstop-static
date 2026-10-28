// Interaksi non-3D: menu, meter curing, kartu miring, salin, pencari solusi, pilihan produk, tahap pemasangan.
import { areaResult, pad2, productDetail } from "../lib/templates";
import { $, clamp, data, hooks, REDUCE, state } from "./state";

const PRODUCTS = data.products,
  AREAS = data.areas,
  BUILD_STEPS = data.steps;
const t = data.t as unknown as import("../i18n").Dict;

/* menu mobile */
{
  const mb = $<HTMLButtonElement>("#menuBtn"),
    mn = $("#mnav");
  const set = (open: boolean) => {
    mn.hidden = !open;
    mb.setAttribute("aria-expanded", String(open));
    mb.textContent = (open ? mb.dataset.close : mb.dataset.menu) || "";
  };
  mb.addEventListener("click", () => set(Boolean(mn.hidden)));
  mn.addEventListener("click", (e) => {
    if ((e.target as Element).tagName === "A") set(false);
  });
}

/* meter curing = progres scroll */
{
  const t = $("#cureTxt"),
    bar = $("#cureBar");
  const f = () => {
    const h = document.documentElement;
    const p = clamp(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
    t.textContent = Math.round(p * 100) + "%";
    bar.style.width = p * 100 + "%";
  };
  addEventListener("scroll", f, { passive: true });
  f();
}

/* kartu miring 3D (hanya mouse) */
if (!REDUCE && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  document.querySelectorAll(".tilt-wrap").forEach((g) => {
    g.addEventListener("pointermove", (e: Event) => {
      const ev = e as PointerEvent;
      const c = (ev.target as Element).closest<HTMLElement>(".tilt");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5,
        y = (ev.clientY - r.top) / r.height - 0.5;
      c.style.transform = `rotateY(${(x * 12).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg)`;
    });
    g.addEventListener("pointerout", (e: Event) => {
      const ev = e as PointerEvent;
      const c = (ev.target as Element).closest<HTMLElement>(".tilt");
      if (c && !c.contains(ev.relatedTarget as Node)) c.style.transform = "";
    });
  });
}

/* tombol salin */
document.querySelectorAll<HTMLButtonElement>(".copy").forEach((b) =>
  b.addEventListener("click", () => {
    const el = document.getElementById(b.dataset.copy!)!;
    const done = () => {
      b.textContent = data.t.contact.copied;
      setTimeout(() => (b.textContent = data.t.contact.copy), 1500);
    };
    const sel = () => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection()!;
      s.removeAllRanges();
      s.addRange(r);
    };
    try {
      navigator.clipboard.writeText(el.textContent || "").then(done, sel);
    } catch {
      sel();
    }
  }),
);

/* pilihan produk */
const pIndex = $("#pIndex"),
  pDetail = $("#pDetail");
export function selectProduct(i: number) {
  const n = PRODUCTS.length;
  state.pSel = ((i % n) + n) % n;
  pIndex
    .querySelectorAll<HTMLElement>(".chipbtn")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(+b.dataset.i! === state.pSel)),
    );
  $("#pailCount").textContent = pad2(state.pSel + 1) + " / " + pad2(n);
  pDetail.innerHTML = productDetail(PRODUCTS[state.pSel], t);
  hooks.pailGoTo(state.pSel);
}
pIndex.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>(".chipbtn");
  if (b) selectProduct(+b.dataset.i!);
});
$("#pPrev").addEventListener("click", () => selectProduct(state.pSel - 1));
$("#pNext").addEventListener("click", () => selectProduct(state.pSel + 1));

/* pencari solusi */
const areasEl = $("#areas"),
  resEl = $("#result");
export function showArea(id: string, fly = true) {
  const a = AREAS.find((x) => x.id === id) || AREAS[0];
  state.selectedArea = a.id;
  areasEl
    .querySelectorAll<HTMLElement>(".chipbtn")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.id === a.id)),
    );
  document
    .querySelectorAll<HTMLElement>(".hs")
    .forEach((h) => h.classList.toggle("on", h.dataset.id === a.id));
  resEl.innerHTML = areaResult(a, t, PRODUCTS);
  hooks.houseFocus(a.id, fly);
}
areasEl.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>(".chipbtn");
  if (b) showArea(b.dataset.id!);
});
$("#hotspots").addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>(".hs");
  if (b) showArea(b.dataset.id!);
});
resEl.addEventListener("click", (e) => {
  const b = (e.target as Element).closest<HTMLElement>("[data-prod]");
  if (!b) return;
  selectProduct(PRODUCTS.findIndex((p) => p.name === b.dataset.prod));
  $("#produk").scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" });
});

/* tahap pemasangan mengikuti scroll */
{
  const list = $("#buildSteps");
  const items = [...list.children] as HTMLElement[];
  let active = 0;
  const f = () => {
    const r = list.getBoundingClientRect(),
      vh = innerHeight;
    const line = innerWidth <= 900 ? vh * 0.74 : vh * 0.55;
    const p = clamp((line - r.top) / r.height);
    state.buildQ = p * BUILD_STEPS.length;
    const a = Math.min(
      BUILD_STEPS.length - 1,
      Math.floor(p * BUILD_STEPS.length),
    );
    if (a !== active) {
      active = a;
      items.forEach((li, i) => li.classList.toggle("on", i === a));
      $("#buildNum").textContent = pad2(a + 1);
      $("#buildName").textContent = BUILD_STEPS[a].title;
      $("#buildStatus").innerHTML =
        `${data.t.build.status}: <b>${BUILD_STEPS[a].status}</b>`;
    }
    $("#buildBar").style.width = (p * 100).toFixed(1) + "%";
  };
  addEventListener("scroll", f, { passive: true });
  addEventListener("resize", f);
  f();
}
