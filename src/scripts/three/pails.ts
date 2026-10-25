// Rak produk berputar: pail Mapei, gulungan Mapeband, botol Bondall dengan label yang digambar di canvas.
import { THREE, createStage, ctex, glowTex } from "./core";
import { $, lerp, hooks, state } from "../state";
import { PRODUCTS, type Product } from "../../data/products";
import { selectProduct } from "../ui";

export function initPails() {
  const el = $("#pailStage");
  const S = createStage(el, $<HTMLCanvasElement>("#pailGL"), 30);
  if (!S) { el.hidden = true; return; }

  const N = PRODUCTS.length, STEP = (Math.PI * 2) / N, R = 3.3;
  const ring = new THREE.Group(); S.scene.add(ring);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R + 2.4, 64), new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.72; S.scene.add(floor);
  const ringLine = new THREE.Mesh(new THREE.RingGeometry(R - 0.02, R + 0.02, 128), new THREE.MeshBasicMaterial({ color: 0x4a9fec, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
  ringLine.rotation.x = -Math.PI / 2; ringLine.position.y = -0.71; S.scene.add(ringLine);

  function labelTex(p: Product) {
    const mapei = p.brand === "Mapei", bg = mapei ? "#0b5fb4" : "#e9ecee", fg = mapei ? "#ffffff" : "#121417", acc = mapei ? "#8fdcf5" : "#0b5fb4";
    return ctex(1024, 330, (g, w, h) => {
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      g.fillStyle = mapei ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)"; for (let x = 0; x < w; x += 18) g.fillRect(x, 0, 2, h);
      g.fillStyle = acc; g.fillRect(0, h - 34, w, 10); g.fillRect(0, 22, w, 6);
      g.textAlign = "center"; g.fillStyle = fg;
      g.font = "700 30px 'JetBrains Mono', monospace"; g.fillText(p.brand.toUpperCase(), w / 2, 74);
      const words = p.name.toUpperCase().split(" ");
      const lines = words.length > 1 && p.name.length > 12 ? [words.slice(0, -1).join(" "), words[words.length - 1]] : [p.name.toUpperCase()];
      let fs = lines.length > 1 ? 78 : 104; const setF = () => (g.font = `900 ${fs}px 'Big Shoulders Display', Impact, sans-serif`); setF();
      while (Math.max(...lines.map((l) => g.measureText(l).width)) > 300 && fs > 40) { fs -= 4; setF(); }
      lines.forEach((l, i) => g.fillText(l, w / 2, (lines.length > 1 ? 150 : 190) + i * fs * 0.92));
      g.font = "500 20px 'JetBrains Mono', monospace"; g.globalAlpha = 0.8; g.fillText("WATERPROOFING", w / 2, h - 52); g.globalAlpha = 1;
    });
  }
  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05, ...o });

  const items = PRODUCTS.map((p, i) => {
    const g = new THREE.Group(), mapei = p.brand === "Mapei"; const lab = std({ map: labelTex(p) });
    const capC = mapei ? 0x0a4f96 : 0xd8dde1, rimC = mapei ? 0x083f78 : 0xbfc6cb;
    let yOff = 0;
    if (p.shape === "pail") {
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.62, 1.3, 64, 1, true), lab));
      const bot = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), std({ color: rimC })); bot.rotation.x = Math.PI / 2; bot.position.y = -0.65; g.add(bot);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.12, 64), std({ color: capC })); lid.position.y = 0.71; g.add(lid);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.03, 10, 64), std({ color: rimC })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.5; g.add(rim);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.022, 8, 48, Math.PI), std({ color: 0x9aa3aa, metalness: 0.6, roughness: 0.3 })); handle.position.y = 0.72; handle.rotation.x = -0.25; g.add(handle);
    } else if (p.shape === "roll") {
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.55, 64, 1, true), lab));
      const face = std({ color: 0xd9dfe3, side: THREE.DoubleSide });
      for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.75, 64), face); r.rotation.x = Math.PI / 2; r.position.y = s * 0.275; g.add(r); }
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.56, 48, 1, true), std({ color: 0xb08d5b, side: THREE.DoubleSide })));
      yOff = -0.37;
    } else {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.15, 64, 1, true), lab); body.position.y = -0.1; g.add(body);
      const bot = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), std({ color: 0xd0d6da })); bot.rotation.x = Math.PI / 2; bot.position.y = -0.675; g.add(bot);
      const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.5, 0.32, 48), std({ color: 0xe9ecee })); sh.position.y = 0.63; g.add(sh);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 32), std({ color: 0xe9ecee })); neck.position.y = 0.86; g.add(neck);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.2, 32), std({ color: 0x0b5fb4 })); cap.position.y = 1.0; g.add(cap);
    }
    // label digambar di tengah tekstur = sisi -z lokal; diputar agar menghadap keluar lingkaran
    const a = i * STEP; g.position.set(R * Math.sin(a), yOff, R * Math.cos(a)); g.rotation.y = a + Math.PI;
    g.userData.i = i; ring.add(g);
    return { g, lab, a, yOff, k: 0 };
  });

  let ringRot = 0, target = 0, dragging = false;
  hooks.pailGoTo = (i) => {
    let t = -i * STEP; while (t - target > Math.PI) t -= Math.PI * 2; while (t - target < -Math.PI) t += Math.PI * 2;
    target = t; S.kick();
  };
  S.fit = (a) => { const k = a < 1.2 ? 1.25 / a : 1; S.camera.position.set(0, 2.3 * k, R + 6.6 * k); S.camera.lookAt(0, 0.2, R - 1.8); };
  S.frame = (dt) => {
    if (!dragging) ringRot = lerp(ringRot, target, Math.min(1, dt * 5));
    ring.rotation.y = ringRot;
    items.forEach((it, i) => {
      const on = i === state.pSel; it.k = lerp(it.k, on ? 1 : 0, Math.min(1, dt * 6));
      it.g.scale.setScalar(0.86 + it.k * 0.26);
      it.g.position.y = it.yOff + it.k * (0.15 + Math.sin(S.time * 1.6) * 0.06);
      it.g.rotation.y = it.a + Math.PI + (on ? Math.sin(S.time * 0.8) * 0.35 : 0);
      const c = 0.42 + it.k * 0.58; it.lab.color.setRGB(c, c, c);
    });
  };
  S.onDrag = (dx) => { dragging = true; ringRot += dx * 0.006; };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  S.onDragEnd = (moved, e) => {
    dragging = false;
    if (moved > 5) { const i = Math.round(-ringRot / STEP); target = ringRot; selectProduct(((i % N) + N) % N); return; }
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, S.camera);
    const hit = ray.intersectObjects(ring.children, true)[0];
    if (hit) { let o: THREE.Object3D | null = hit.object; while (o && o.userData.i == null) o = o.parent; if (o) selectProduct(o.userData.i); }
  };
  S.start();
  hooks.pailGoTo(state.pSel);
  // gambar ulang label setelah font web siap
  document.fonts?.ready.then(() => {
    items.forEach((it, i) => { it.lab.map?.dispose(); it.lab.map = labelTex(PRODUCTS[i]); it.lab.needsUpdate = true; });
    S.kick();
  });
}
