// Rumah x-ray: titik area bocor, kamera terbang ke area terpilih, bagian terkait menyala biru.
import { THREE, createStage, makeRain } from "./core";
import { $, lerp, REDUCE, hooks, state } from "../state";
import { AREAS } from "../../data/areas"; // urutan id sama dengan tombol titik di halaman

type Part = { mesh: THREE.Mesh; edge: THREE.LineSegments; baseC: THREE.Color; baseO: number; baseE: number; k: number; tk: number };
type View = { t: [number, number, number]; az: number; el: number; d: number };

export function initHouse() {
  const el = $("#houseStage");
  const S = createStage(el, $<HTMLCanvasElement>("#houseGL"), 34);
  if (!S) { el.hidden = true; return; }

  const house = new THREE.Group(); S.scene.add(house);
  const BLUE = new THREE.Color(0x2f8fe6);
  const parts: Part[] = [];
  function part(geo: THREE.BufferGeometry, pos: [number, number, number], o: { c?: number; o?: number; eo?: number } = {}) {
    const m = new THREE.MeshStandardMaterial({ color: o.c ?? 0x9aa6b0, transparent: true, opacity: o.o ?? 0.12, depthWrite: false, roughness: 0.6, emissive: 0x0b5fb4, emissiveIntensity: 0, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(...pos);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x4a9fec, transparent: true, opacity: o.eo ?? 0.45 }));
    mesh.add(edge); house.add(mesh);
    const p: Part = { mesh, edge, baseC: m.color.clone(), baseO: m.opacity, baseE: (edge.material as THREE.LineBasicMaterial).opacity, k: 0, tk: 0 };
    parts.push(p); return p;
  }
  const water = (geo: THREE.BufferGeometry, pos: [number, number, number], o = 0.45) => {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x4fb4e6, transparent: true, opacity: o, roughness: 0.1, depthWrite: false }));
    m.position.set(...pos); house.add(m);
  };

  const grid = new THREE.GridHelper(12, 24, 0x4a9fec, 0x4a9fec);
  (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.14; grid.scale.z = 8 / 12; house.add(grid);
  part(new THREE.BoxGeometry(12, 2.8, 8), [0, -1.4, 0], { c: 0x4a3f36, o: 0.1, eo: 0.18 }); // tanah
  const basement = part(new THREE.BoxGeometry(5, 2, 4), [-1.5, -1.15, 0], { o: 0.14 });
  part(new THREE.BoxGeometry(5, 2.4, 4), [-1.5, 1.2, 0], { o: 0.07 });
  const slab = part(new THREE.BoxGeometry(5, 0.15, 4), [-1.5, 2.45, 0], { o: 0.2 });
  part(new THREE.BoxGeometry(5, 2.3, 4), [-1.5, 3.7, 0], { o: 0.07 });
  const roof = part(new THREE.BoxGeometry(5.4, 0.25, 4.4), [-1.5, 4.98, 0], { c: 0xb8c2ca, o: 0.35 });
  part(new THREE.BoxGeometry(5.4, 0.35, 0.08), [-1.5, 5.28, 2.16], { o: 0.25 });
  part(new THREE.BoxGeometry(5.4, 0.35, 0.08), [-1.5, 5.28, -2.16], { o: 0.25 });
  const bath = part(new THREE.BoxGeometry(1.8, 1.4, 1.8), [-3.0, 3.25, -1.0], { o: 0.12 });
  const front = part(new THREE.BoxGeometry(5, 2.4, 0.06), [-1.5, 1.2, 2.03], { o: 0.06 });
  const pool = part(new THREE.BoxGeometry(3.6, 1.4, 2.6), [3.9, -0.7, 1.1], { o: 0.14 });
  water(new THREE.BoxGeometry(3.4, 1.15, 2.4), [3.9, -0.68, 1.1]);
  const tank = part(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32), [3.9, -1.45, -2.3], { o: 0.16 });
  water(new THREE.CylinderGeometry(0.74, 0.74, 1.1, 32), [3.9, -1.68, -2.3], 0.4);
  part(new THREE.CylinderGeometry(0.25, 0.25, 1.5, 16), [3.9, -0.1, -2.3], { o: 0.12, eo: 0.3 });
  part(new THREE.BoxGeometry(0.9, 1.8, 0.04), [-0.4, 0.9, 2.06], { o: 0.1, eo: 0.6 }); // pintu
  part(new THREE.BoxGeometry(1.4, 0.9, 0.04), [-2.6, 3.8, 2.06], { o: 0.1, eo: 0.6 }); // jendela
  const crack: THREE.Vector3[] = []; let cxp = -2.2, cyp = 2.1;
  for (let i = 0; i < 9; i++) { crack.push(new THREE.Vector3(cxp, cyp, 2.07)); cxp += 0.22 + Math.random() * 0.12; cyp -= 0.18 + Math.random() * 0.1; }
  house.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(crack), new THREE.LineBasicMaterial({ color: 0xff6b5e })));

  const HL: Record<string, Part[]> = { dak: [roof], km: [bath, slab], kolam: [pool], tandon: [tank], basement: [basement], retak: [front] };
  const SPOT: Record<string, [number, number, number]> = { dak: [-1.5, 5.25, 0], km: [-3.0, 3.4, -1.0], kolam: [3.9, 0.05, 1.1], tandon: [3.9, -1.45, -2.3], basement: [-1.5, -1.1, 0], retak: [-1.4, 1.4, 2.08] };
  const CAM: Record<string, View> = {
    def: { t: [0, 1.3, 0], az: 0.75, el: 0.42, d: 19.5 },
    dak: { t: [-1.5, 4.6, 0], az: 0.6, el: 0.72, d: 13 }, km: { t: [-3, 3, -1], az: 0.35, el: 0.38, d: 11 },
    kolam: { t: [3.9, -0.4, 1.1], az: 1.0, el: 0.55, d: 11 }, tandon: { t: [3.9, -1.4, -2.3], az: 1.55, el: 0.18, d: 10 },
    basement: { t: [-1.5, -1.1, 0], az: 0.45, el: 0.12, d: 12.5 }, retak: { t: [-1.2, 1.3, 2], az: 0.15, el: 0.18, d: 10 },
  };
  const cur = { t: new THREE.Vector3(0, 1, 0), az: 0.75, el: 0.42, d: 17 };
  const wantT = new THREE.Vector3();
  let want = CAM.def, azOff = 0, fitK = 1, selected = "";
  const hsBtns = [...$("#hotspots").children] as HTMLElement[];

  hooks.houseFocus = (id, fly = true) => {
    selected = id;
    if (fly) { want = CAM[id] || CAM.def; azOff = 0; }
    parts.forEach((p) => (p.tk = 0)); (HL[id] || []).forEach((p) => (p.tk = 1)); S.kick();
  };

  const rain = makeRain(S.scene, {
    n: 360, xr: 6, zr: 4, y0: 9, y1: 13, floor: -3, len: 0.35, v: 10, sk: 1.4, ps: 0.06,
    hit: (x, z) => (x > -4.2 && x < 1.2 && z > -2.2 && z < 2.2 ? 5.11 : x > 2.1 && x < 5.7 && z > -0.2 && z < 2.4 ? -0.12 : 0),
  });

  S.fit = (a) => { fitK = a < 1.1 ? 1.15 / a : 1; };
  S.frame = (dt) => {
    const k = Math.min(1, dt * 2.6);
    cur.t.lerp(wantT.set(...want.t), k); cur.az = lerp(cur.az, want.az + azOff, k); cur.el = lerp(cur.el, want.el, k); cur.d = lerp(cur.d, want.d * fitK, k);
    if (!REDUCE && want === CAM.def) azOff += dt * 0.05;
    const c = Math.cos(cur.el);
    S.camera.position.set(cur.t.x + cur.d * c * Math.sin(cur.az), cur.t.y + cur.d * Math.sin(cur.el), cur.t.z + cur.d * c * Math.cos(cur.az));
    S.camera.lookAt(cur.t);
    parts.forEach((p) => {
      p.k = lerp(p.k, p.tk, Math.min(1, dt * 5)); const m = p.mesh.material as THREE.MeshStandardMaterial;
      m.color.copy(p.baseC).lerp(BLUE, p.k); m.opacity = lerp(p.baseO, 0.62, p.k); m.emissiveIntensity = p.k * 0.7;
      (p.edge.material as THREE.LineBasicMaterial).opacity = lerp(p.baseE, 1, p.k);
    });
    rain.update(dt);
  };
  // titik di atas model; digeser bila berdempetan
  S.after = () => {
    const placed: [number, number][] = [];
    AREAS.forEach((a, i) => {
      const p = S.toScreen(...SPOT[a.id]), b = hsBtns[i];
      const out = p[2] > 1 || p[0] < 16 || p[0] > S.w - 16 || p[1] < 16 || p[1] > S.h - 16;
      b.style.visibility = out ? "hidden" : "visible";
      const x = p[0]; let y = p[1];
      for (const q of placed) if (Math.abs(q[0] - x) < 34 && Math.abs(q[1] - y) < 34) y = q[1] + 36;
      if (!out) placed.push([x, y]);
      b.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      b.classList.toggle("flip", x > S.w - 170);
      (b.querySelector("span") as HTMLElement).style.display = selected === a.id || S.w > 620 ? "" : "none";
    });
  };
  S.onDrag = (dx) => { azOff -= dx * 0.008; };
  S.start();
  hooks.houseFocus(state.selectedArea, false);
}
