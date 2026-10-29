// Entry point: the regular UI runs immediately; each 3D scene loads when it is almost visible (saves data on phones).
import "./ui";

const lazy: [string, () => Promise<void>][] = [
  ["#heroStage", () => import("./three/hero").then((m) => m.initHero())],
  ["#buildStage", () => import("./three/build").then((m) => m.initBuild())],
  ["#houseStage", () => import("./three/house").then((m) => m.initHouse())],
  ["#pailStage", () => import("./three/pails").then((m) => m.initPails())],
];

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

if (!webglOK()) {
  // no 3D: show the flat version, content stays complete
  (["#houseStage", "#pailStage"] as const).forEach(
    (s) => ((document.querySelector(s) as HTMLElement).hidden = true),
  );
  (document.querySelector("#heroStage") as HTMLElement).hidden = true;
  (document.querySelector("#heroFallback") as HTMLElement).hidden = false;
  (document.querySelector("#buildGL") as HTMLElement).hidden = true;
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const job = lazy.find(([s]) => e.target.matches(s));
        job?.[1]().catch((err) => console.error("3D gagal dimuat", err));
      });
    },
    { rootMargin: "600px 0px" },
  );
  lazy.forEach(([s]) => {
    const el = document.querySelector(s);
    if (el) io.observe(el);
  });
}
