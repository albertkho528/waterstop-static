// Inti 3D bersama: renderer, loop hemat baterai, tekstur, tumpukan lapisan, hujan.
import * as THREE from "three";
import { REDUCE } from "../state";

export { THREE };

export interface Stage {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  w: number; h: number; time: number; dragMoved: number;
  frame?: (dt: number) => void;
  after?: () => void;
  fit?: (aspect: number) => void;
  onDrag?: (dx: number) => void;
  onDragEnd?: (moved: number, e: PointerEvent) => void;
  kick: () => void;
  start: () => void;
  toScreen: (x: number, y: number, z: number, m?: THREE.Matrix4) => [number, number, number];
}

function mkRenderer(canvas: HTMLCanvasElement) {
  try {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    r.setPixelRatio(Math.min(innerWidth < 700 ? 1.5 : 2, devicePixelRatio || 1));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    return r;
  } catch {
    return null;
  }
}

/** Membuat satu viewport 3D yang hanya menggambar saat terlihat di layar. */
export function createStage(el: HTMLElement, canvas: HTMLCanvasElement, fov = 32): Stage | null {
  const renderer = mkRenderer(canvas);
  if (!renderer) return null;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
  // intensitas dikali PI karena three.js modern memakai satuan cahaya fisik
  scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x101316, 0.85 * Math.PI));
  const key = new THREE.DirectionalLight(0xffffff, 0.95 * Math.PI); key.position.set(5, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x4a9fec, 0.6 * Math.PI); rim.position.set(-6, 3, -5); scene.add(rim);

  let vis = true, raf = 0, last = 0;
  const v = new THREE.Vector3();
  const S: Stage = {
    renderer, scene, camera, w: 1, h: 1, time: 0, dragMoved: 0,
    kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } },
    start() {
      resize();
      new ResizeObserver(resize).observe(el);
      new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) S.kick(); }, { rootMargin: "150px" }).observe(el);
      S.kick();
    },
    toScreen(x, y, z, m) { v.set(x, y, z); if (m) v.applyMatrix4(m); v.project(camera); return [((v.x + 1) / 2) * S.w, ((1 - v.y) / 2) * S.h, v.z]; },
  };
  function loop(now: number) {
    const dt = REDUCE ? 1 : Math.min(0.05, (now - last) / 1000); last = now; if (!REDUCE) S.time += dt;
    S.frame?.(dt); S.renderer.render(scene, camera); S.after?.();
    raf = vis && !REDUCE ? requestAnimationFrame(loop) : 0;
  }
  function resize() {
    S.w = el.clientWidth || 1; S.h = el.clientHeight || 1;
    S.renderer.setSize(S.w, S.h, false); camera.aspect = S.w / S.h;
    S.fit?.(camera.aspect); camera.updateProjectionMatrix(); S.kick();
  }
  // seret horizontal untuk memutar; klik tanpa seret tetap jadi klik
  let dragX: number | null = null;
  el.addEventListener("pointerdown", (e) => { if ((e.target as Element).closest("button")) return; dragX = e.clientX; S.dragMoved = 0; });
  el.addEventListener("pointermove", (e) => {
    if (dragX == null) return; const dx = e.clientX - dragX; dragX = e.clientX; S.dragMoved += Math.abs(dx);
    if (S.dragMoved > 3 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
    S.onDrag?.(dx); S.kick();
  });
  const end = (e: PointerEvent) => { if (dragX == null) return; dragX = null; S.onDragEnd?.(S.dragMoved, e); S.kick(); };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  return S;
}

/* ---------- tekstur dari canvas ---------- */
export function ctex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
let _conc: THREE.Texture, _mesh: THREE.Texture, _glow: THREE.Texture;
export function concreteTex() {
  return (_conc ??= ctex(256, 256, (g, s) => {
    g.fillStyle = "#6c7073"; g.fillRect(0, 0, s, s);
    for (let i = 0; i < 3000; i++) { const v = (80 + Math.random() * 80) | 0; g.fillStyle = `rgba(${v},${v},${v + 4},${(Math.random() * 0.6).toFixed(2)})`; const r = Math.random() * 2.4; g.fillRect(Math.random() * s, Math.random() * s, r, r); }
    for (let i = 0; i < 70; i++) { g.fillStyle = "rgba(38,40,42,.55)"; g.beginPath(); g.arc(Math.random() * s, Math.random() * s, Math.random() * 2.6 + 0.6, 0, 7); g.fill(); }
  }));
}
export function meshTex() {
  if (_mesh) return _mesh;
  _mesh = ctex(256, 256, (g, s) => {
    g.strokeStyle = "#dfe7ec"; g.lineWidth = 4;
    for (let i = 0; i <= s; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, s); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(s, i); g.stroke(); }
  });
  _mesh.wrapS = _mesh.wrapT = THREE.RepeatWrapping; _mesh.repeat.set(3, 2.2); return _mesh;
}
export function glowTex() {
  return (_glow ??= ctex(256, 256, (g, s) => {
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, "rgba(74,159,236,.55)"); gr.addColorStop(0.5, "rgba(11,95,180,.18)"); gr.addColorStop(1, "rgba(11,95,180,0)");
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  }));
}
export function glowFloor(size: number, y: number) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = y; return m;
}

/* ---------- tumpukan lapisan waterproofing ---------- */
export type LayerKey = "beton" | "primer" | "mesh" | "membran" | "top";
export interface Layer { key: LayerKey; h: number; n: string; mesh: THREE.Mesh; edge: THREE.LineSegments; y: number }

// nama lapisan ada di kamus bahasa (t.layers); di sini hanya tebal, nomor urut dan material
const LAYER_DEFS: Record<LayerKey, { h: number; n: string; mat: () => THREE.MeshStandardMaterialParameters }> = {
  beton: { h: 1, n: "", mat: () => ({ map: concreteTex(), roughness: 0.95 }) },
  primer: { h: 0.07, n: "01", mat: () => ({ color: 0x2a3138, roughness: 0.6 }) },
  mesh: { h: 0.05, n: "02", mat: () => ({ map: meshTex(), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.7 }) },
  membran: { h: 0.24, n: "03", mat: () => ({ color: 0x245f99, roughness: 0.42 }) },
  top: { h: 0.09, n: "04", mat: () => ({ color: 0xbac3c9, roughness: 0.5 }) },
};

export function buildStack(keys: LayerKey[]) {
  const W = 4, D = 3;
  const group = new THREE.Group();
  const layers: Layer[] = keys.map((k) => {
    const d = LAYER_DEFS[k];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(W, d.h, D), new THREE.MeshStandardMaterial({ transparent: true, ...d.mat() }));
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x4a9fec, transparent: true, opacity: 0.4 }));
    mesh.add(edge); group.add(mesh);
    return { key: k, h: d.h, n: d.n, mesh, edge, y: 0 };
  });
  /** spread: jarak antar lapisan (0 = rapat); appear[i]: 0..1 lapisan turun & muncul */
  function layout(spread: number, appear?: number[]) {
    let y = -1;
    layers.forEach((l, i) => {
      const a = appear ? appear[i] : 1;
      l.y = y + i * 0.52 * spread + l.h / 2;
      l.mesh.position.y = l.y + (1 - a) * 2.4;
      (l.mesh.material as THREE.Material).opacity = a;
      (l.edge.material as THREE.Material).opacity = 0.4 * a;
      l.mesh.visible = a > 0.01; y += l.h;
    });
    group.updateMatrixWorld();
  }
  const top = () => { const l = layers[layers.length - 1]; return l.y + l.h / 2; };
  return { group, layers, layout, top, W, D };
}

/* ---------- hujan + percikan ---------- */
interface RainOpts { n: number; xr: number; zr: number; y0: number; y1: number; floor: number; len: number; v: number; sk: number; ps?: number; hit: (x: number, z: number) => number | null }
export function makeRain(scene: THREE.Scene, o: RainOpts) {
  const n = REDUCE ? 0 : o.n;
  const drops = new Float32Array(Math.max(1, n) * 6), spd = new Float32Array(Math.max(1, n));
  const reset = (i: number, y?: number) => {
    const j = i * 6, x = (Math.random() - 0.5) * 2 * o.xr, z = (Math.random() - 0.5) * 2 * o.zr, yy = y ?? o.y0 + Math.random() * (o.y1 - o.y0);
    drops[j] = x; drops[j + 1] = yy; drops[j + 2] = z; drops[j + 3] = x + 0.02; drops[j + 4] = yy + o.len; drops[j + 5] = z; spd[i] = o.v * (1 + Math.random() * 0.5);
  };
  for (let i = 0; i < n; i++) reset(i, o.floor + Math.random() * (o.y1 - o.floor));
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(drops, 3)); geo.setDrawRange(0, n * 2);
  scene.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x8fdcf5, transparent: true, opacity: 0.5 })));
  const M = 140, sp = new Float32Array(M * 3).fill(-99), sv = new Float32Array(M * 3), life = new Float32Array(M); let si = 0;
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xbfeaf8, size: o.ps || 0.05, transparent: true, opacity: 0.85 })));
  return {
    update(dt: number) {
      if (!n) return;
      for (let i = 0; i < n; i++) {
        const j = i * 6, d = spd[i] * dt; drops[j + 1] -= d; drops[j + 4] -= d;
        const h = o.hit(drops[j], drops[j + 2]);
        if (h != null && drops[j + 1] <= h && drops[j + 1] > h - 0.6) {
          for (let k = 0; k < 2; k++) {
            const m = si++ % M, a = Math.random() * 6.283;
            sp[m * 3] = drops[j]; sp[m * 3 + 1] = h + 0.01; sp[m * 3 + 2] = drops[j + 2];
            sv[m * 3] = Math.cos(a) * (0.5 + Math.random()) * o.sk; sv[m * 3 + 1] = (1 + Math.random() * 1.2) * o.sk; sv[m * 3 + 2] = Math.sin(a) * (0.5 + Math.random()) * o.sk; life[m] = 0.45;
          }
          reset(i);
        } else if (drops[j + 1] < o.floor) reset(i);
      }
      geo.attributes.position.needsUpdate = true;
      for (let m = 0; m < M; m++) {
        if (life[m] <= 0) continue; life[m] -= dt; sv[m * 3 + 1] -= 6 * o.sk * dt;
        sp[m * 3] += sv[m * 3] * dt; sp[m * 3 + 1] += sv[m * 3 + 1] * dt; sp[m * 3 + 2] += sv[m * 3 + 2] * dt; if (life[m] <= 0) sp[m * 3 + 1] = -99;
      }
      sg.attributes.position.needsUpdate = true;
    },
  };
}
