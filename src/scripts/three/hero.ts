// Hero: exploded roof slab cross-section that assembles on scroll, rain splashing on the top coat.
import { esc } from "../../lib/templates";
import { $, clamp, data, lerp, REDUCE } from "../state";
import { buildStack, createStage, glowFloor, makeRain } from "./core";

export function initHero() {
  const el = $("#heroStage");
  const S = createStage(el, $<HTMLCanvasElement>("#heroGL"), 30);
  if (!S) {
    el.hidden = true;
    $("#heroFallback").hidden = false;
    return;
  }

  const st = buildStack(["beton", "primer", "mesh", "membran", "top"]);
  S.scene.add(st.group, glowFloor(9, -1.05));

  const lab = $("#heroLabels");
  lab.innerHTML = st.layers
    .map((l) => {
      const x = data.t.layers[l.key];
      return `<div class="lbl">${l.n ? `<i>${l.n}</i>` : ""}<span class="l">${esc(x.name)}${x.sub ? ` · ${esc(x.sub)}` : ""}</span><span class="s">${esc(x.short)}</span></div>`;
    })
    .join("");
  const lbls = [...lab.children] as HTMLElement[];

  let rot = -0.6,
    autoP = 0,
    spread = 1,
    mx = 0,
    my = 0,
    cx = 0,
    cy = 0;
  let base = [5.8, 4.2, 7.2];
  const rain = makeRain(S.scene, {
    n: 300,
    xr: 3.4,
    zr: 2.6,
    y0: 4.5,
    y1: 8,
    floor: -2.8,
    len: 0.28,
    v: 7,
    sk: 1,
    hit: (x, z) => {
      const c = Math.cos(rot),
        s = Math.sin(rot),
        lx = x * c - z * s,
        lz = x * s + z * c;
      return Math.abs(lx) < st.W / 2 && Math.abs(lz) < st.D / 2
        ? st.top()
        : null;
    },
  });

  // model shifted left so the label column on the right does not cover the layers
  S.fit = (a) => {
    const k = (a < 1.15 ? 1.2 / a : 1.05) * 1.08;
    base = [5.8 * k, 4.2 * k, 7.2 * k];
    S.camera.setViewOffset(S.w, S.h, S.w * (a < 1 ? 0.11 : 0.07), 0, S.w, S.h);
  };
  S.frame = (dt) => {
    // layers stay exploded while the viewport is fully visible, and assemble when scrolled past the header
    const r = el.getBoundingClientRect();
    const target = 1 - clamp((90 - r.top) / (r.height * 0.75));
    spread = lerp(spread, target, Math.min(1, dt * 5));
    if (!REDUCE && autoP <= 0) rot += dt * 0.16;
    autoP -= dt;
    st.group.rotation.y = rot;
    st.layout(spread);
    cx = lerp(cx, mx, Math.min(1, dt * 3));
    cy = lerp(cy, my, Math.min(1, dt * 3));
    S.camera.position.set(base[0] + cx * 1.2, base[1] - cy * 0.8, base[2]);
    S.camera.lookAt(0, 0.45, 0);
    rain.update(dt);
  };
  // labels aligned in one column, not overlapping, not outside the viewport
  S.after = () => {
    let maxX = -1e9;
    const ys: { i: number; y: number }[] = [];
    st.layers.forEach((l, i) => {
      for (const ax of [-st.W / 2, st.W / 2])
        for (const az of [-st.D / 2, st.D / 2]) {
          const p = S.toScreen(ax, l.y, az, st.group.matrixWorld);
          if (p[0] > maxX) maxX = p[0];
        }
      ys.push({ i, y: S.toScreen(0, l.y, 0, st.group.matrixWorld)[1] });
    });
    const lw = Math.max(...lbls.map((e) => e.offsetWidth || 90)),
      lh = (lbls[0].offsetHeight || 22) + 6;
    const x = Math.max(10, Math.min(maxX + 14, S.w - lw - 14));
    ys.sort((a, b) => a.y - b.y);
    for (let k = 1; k < ys.length; k++)
      if (ys[k].y < ys[k - 1].y + lh) ys[k].y = ys[k - 1].y + lh;
    const over = ys[ys.length - 1].y + lh / 2 - (S.h - 44);
    if (over > 0) ys.forEach((o) => (o.y -= over));
    ys.forEach((o) => {
      lbls[o.i].style.transform =
        `translate(${x.toFixed(1)}px,${(o.y - lh / 2 + 3).toFixed(1)}px)`;
    });
  };
  S.onDrag = (dx) => {
    rot += dx * 0.009;
    autoP = 1e9;
  };
  S.onDragEnd = () => {
    autoP = 3;
  };
  const hero = $("#hero");
  if (matchMedia("(pointer:fine)").matches)
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      S.kick();
    });
  addEventListener("scroll", S.kick, { passive: true });
  S.start();
}
