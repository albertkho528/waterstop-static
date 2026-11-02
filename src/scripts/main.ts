// Entry point: the regular UI runs immediately; each 3D scene loads when it is almost visible (saves data on phones).
import "./ui";

const lazy: [string, () => Promise<void>][] = [
  ["#heroStage", () => import("./three/hero").then((m) => m.initHero())],
  ["#buildStage", () => import("./three/build").then((m) => m.initBuild())],
  ["#houseStage", () => import("./three/house").then((m) => m.initHouse())],
  ["#pailStage", () => import("./three/pails").then((m) => m.initPails())],
];

function fail(selector: string) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  el.hidden = true;
  if (selector === "#heroStage") {
    const fallback = document.querySelector<HTMLElement>("#heroFallback");
    if (fallback) fallback.hidden = false;
  } else {
    el.closest(".build-grid, .finder, .prod3d")?.classList.add("no-3d");
  }
}

const mobile = matchMedia("(max-width: 700px)").matches;
const marginFor = (selector: string) =>
  selector === "#heroStage" || !mobile ? "600px 0px" : "100px 0px";

for (const [selector, load] of lazy) {
  const el = document.querySelector(selector);
  if (!el) continue;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        load().catch((err) => {
          console.error("3D gagal dimuat", err);
          fail(selector);
        });
      });
    },
    { rootMargin: marginFor(selector) },
  );
  io.observe(el);
}
