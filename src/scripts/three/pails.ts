// Rak produk berputar. Bentuk tiap model mengikuti kemasan asli dari pabrik:
// kit 2 komponen (sak + jeriken), sak, pail, gulungan, botol. Label digambar sendiri (bukan desain asli pabrik).
// Bila `photo` diisi di products.ts, foto produk asli dipakai sebagai gantinya.
import { THREE, createStage, ctex, glowTex } from "./core";
import { $, lerp, hooks, state } from "../state";
import { PRODUCTS, type Product } from "../../data/products";
import { selectProduct } from "../ui";

type Mat = THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
type Item = { g: THREE.Group; labels: Mat[]; a: number; yOff: number; k: number; photo: boolean; shadow: THREE.Mesh };

export function initPails() {
  const el = $("#pailStage");
  const S = createStage(el, $<HTMLCanvasElement>("#pailGL"), 30);
  if (!S) { el.hidden = true; return; }

  const N = PRODUCTS.length, STEP = (Math.PI * 2) / N, R = 3.3, FLOOR = -0.72;
  const ring = new THREE.Group(); S.scene.add(ring);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R + 2.4, 64), new THREE.MeshBasicMaterial({ map: glowTex(), transparent: true, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR; S.scene.add(floor);
  const ringLine = new THREE.Mesh(new THREE.RingGeometry(R - 0.02, R + 0.02, 128), new THREE.MeshBasicMaterial({ color: 0x4a9fec, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
  ringLine.rotation.x = -Math.PI / 2; ringLine.position.y = FLOOR + 0.01; S.scene.add(ringLine);

  const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05, ...o });
  const colors = (p: Product) => p.brand === "Mapei"
    ? { bg: "#0b5fb4", fg: "#ffffff", acc: "#8fdcf5" }
    : { bg: "#e9ecee", fg: "#121417", acc: "#0b5fb4" };

  /** Label melingkar untuk pail, gulungan, botol (tengah tekstur = sisi depan). */
  function wrapLabel(p: Product, sub?: string) {
    const c = colors(p);
    return ctex(1024, 330, (g, w, h) => {
      g.fillStyle = c.bg; g.fillRect(0, 0, w, h);
      g.fillStyle = p.brand === "Mapei" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.05)"; for (let x = 0; x < w; x += 18) g.fillRect(x, 0, 2, h);
      g.fillStyle = c.acc; g.fillRect(0, h - 34, w, 10); g.fillRect(0, 22, w, 6);
      g.textAlign = "center"; g.fillStyle = c.fg;
      g.font = "700 30px 'JetBrains Mono', monospace"; g.fillText(p.brand.toUpperCase(), w / 2, 74);
      nameLines(g, p.name, w / 2, 150, 190, 300, 104, 78);
      g.font = "500 20px 'JetBrains Mono', monospace"; g.globalAlpha = 0.8; g.fillText(sub ? `WATERPROOFING · ${sub}` : "WATERPROOFING", w / 2, h - 52); g.globalAlpha = 1;
    });
  }
  /** Label datar untuk muka depan sak / jeriken. */
  function flatLabel(p: Product, sub: string, compact = false) {
    const c = colors(p);
    return ctex(512, compact ? 512 : 680, (g, w, h) => {
      g.fillStyle = compact ? "#f1f3f4" : "#eef0f1"; g.fillRect(0, 0, w, h);
      // pita merek di atas
      const band = compact ? 120 : 170;
      g.fillStyle = c.bg === "#e9ecee" ? "#121417" : c.bg; g.fillRect(0, 0, w, band);
      g.fillStyle = c.acc; g.fillRect(0, band, w, 10);
      g.textAlign = "center"; g.fillStyle = "#ffffff";
      g.font = `700 ${compact ? 34 : 40}px 'JetBrains Mono', monospace`; g.fillText(p.brand.toUpperCase(), w / 2, band * 0.62);
      g.fillStyle = "#121417";
      if (compact) {
        g.font = "900 120px 'Big Shoulders Display', Impact, sans-serif"; g.fillText("B", w / 2, 300);
        g.font = "700 46px 'JetBrains Mono', monospace"; g.fillText(sub, w / 2, 400);
      } else {
        nameLines(g, p.name, w / 2, 300, 340, 440, 120, 92);
        g.font = "700 64px 'JetBrains Mono', monospace"; g.fillText(sub, w / 2, h - 120);
        g.fillStyle = c.bg === "#e9ecee" ? "#121417" : c.bg; g.fillRect(0, h - 40, w, 40);
      }
    });
  }
  function nameLines(g: CanvasRenderingContext2D, name: string, x: number, y2: number, y1: number, maxW: number, fs1: number, fs2: number) {
    const words = name.toUpperCase().split(" ");
    const lines = words.length > 1 && name.length > 12 ? [words.slice(0, -1).join(" "), words[words.length - 1]] : [name.toUpperCase()];
    let fs = lines.length > 1 ? fs2 : fs1; const setF = () => (g.font = `900 ${fs}px 'Big Shoulders Display', Impact, sans-serif`); setF();
    while (Math.max(...lines.map((l) => g.measureText(l).width)) > maxW && fs > 36) { fs -= 4; setF(); }
    lines.forEach((l, i) => g.fillText(l, x, (lines.length > 1 ? y2 : y1) + i * fs * 0.92));
  }

  /** Sak berbentuk bantal: kotak yang sisi depan/belakangnya digembungkan. */
  function sack(label: THREE.MeshStandardMaterial, w = 1.1, h = 1.45, d = 0.46) {
    const geo = new THREE.BoxGeometry(w, h, d, 18, 18, 6);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) / (w / 2), y = pos.getY(i) / (h / 2), z = pos.getZ(i);
      const pinch = (1 - 0.55 * x * x) * (1 - 0.7 * Math.pow(Math.abs(y), 6));
      pos.setZ(i, z * pinch);
      pos.setX(i, pos.getX(i) * (1 - 0.06 * Math.pow(Math.abs(y), 4)));
    }
    geo.computeVertexNormals();
    const paper = std({ color: 0xe7e9ea, roughness: 0.85 });
    // urutan muka BoxGeometry: +x, -x, +y, -y, +z, -z — label di -z (sisi depan setelah diputar)
    const m = new THREE.Mesh(geo, [paper, paper, paper, paper, paper, label]);
    m.position.y = h / 2 + FLOOR; return m;
  }
  /** Jeriken cairan dengan pegangan dan tutup. */
  function jerrycan(label: THREE.MeshStandardMaterial) {
    const g = new THREE.Group(), body = std({ color: 0xf2f4f5, roughness: 0.35 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.82, 0.42, 1, 1, 1), [body, body, body, body, body, label]);
    box.position.y = 0.41; g.add(box);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 10, 24, Math.PI), body); handle.position.set(-0.08, 0.84, 0); g.add(handle);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 24), std({ color: 0x0b5fb4 })); cap.position.set(0.2, 0.87, 0); g.add(cap);
    g.position.y = FLOOR; return g;
  }

  const loader = new THREE.TextureLoader();
  // soft contact shadow under every item
  const shadowTex = ctex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, "rgba(0,0,0,.75)"); gr.addColorStop(0.55, "rgba(0,0,0,.35)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const items: Item[] = PRODUCTS.map((p, i) => {
    const g = new THREE.Group(); const labels: Mat[] = [];
    const L = (tex: THREE.Texture) => { const m = std({ map: tex }); labels.push(m); return m; };
    let yOff = 0;

    if (p.photo) {
      // foto asli: kartu berdiri yang selalu menghadap kamera, tanpa pencahayaan agar warnanya asli
      const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.08, side: THREE.DoubleSide, toneMapped: false, depthWrite: true });
      labels.push(mat);
      const card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat); card.visible = false; g.add(card);
      loader.load(p.photo, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; mat.map = tex; mat.needsUpdate = true;
        const img = tex.image as HTMLImageElement, hgt = 1.75, wid = Math.min(1.9, hgt * (img.width / img.height));
        card.scale.set(wid, wid / (img.width / img.height), 1); card.position.y = FLOOR + card.scale.y / 2; card.visible = true; S.kick();
      });
    } else if (p.shape === "kit") {
      const s = sack(L(flatLabel(p, p.pack?.sack ?? ""))); s.position.x = -0.3; s.rotation.y = 0.12; g.add(s);
      const c = jerrycan(L(flatLabel(p, p.pack?.can ?? "", true))); c.position.set(0.6, c.position.y, -0.2); c.rotation.y = -0.25; g.add(c);
    } else if (p.shape === "sack") {
      g.add(sack(L(flatLabel(p, p.pack?.sack ?? ""))));
    } else if (p.shape === "pail") {
      const lab = L(wrapLabel(p, p.pack?.pail));
      const mapei = p.brand === "Mapei", capC = mapei ? 0x0a4f96 : 0xd8dde1, rimC = mapei ? 0x083f78 : 0xbfc6cb;
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.62, 1.3, 64, 1, true), lab));
      const bot = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), std({ color: rimC })); bot.rotation.x = Math.PI / 2; bot.position.y = -0.65; g.add(bot);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.12, 64), std({ color: capC })); lid.position.y = 0.71; g.add(lid);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.03, 10, 64), std({ color: rimC })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.5; g.add(rim);
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.022, 8, 48, Math.PI), std({ color: 0x9aa3aa, metalness: 0.6, roughness: 0.3 })); handle.position.y = 0.72; handle.rotation.x = -0.25; g.add(handle);
      yOff = FLOOR + 0.65;
    } else if (p.shape === "roll") {
      const lab = L(wrapLabel(p));
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.55, 64, 1, true), lab));
      const face = std({ color: 0xd9dfe3, side: THREE.DoubleSide });
      for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.75, 64), face); r.rotation.x = Math.PI / 2; r.position.y = s * 0.275; g.add(r); }
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.56, 48, 1, true), std({ color: 0xb08d5b, side: THREE.DoubleSide })));
      yOff = FLOOR + 0.275;
    } else {
      const lab = L(wrapLabel(p, p.pack?.bottle));
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.15, 64, 1, true), lab); body.position.y = -0.1; g.add(body);
      const bot = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), std({ color: 0xd0d6da })); bot.rotation.x = Math.PI / 2; bot.position.y = -0.675; g.add(bot);
      const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.5, 0.32, 48), std({ color: 0xe9ecee })); sh.position.y = 0.63; g.add(sh);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 32), std({ color: 0xe9ecee })); neck.position.y = 0.86; g.add(neck);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.2, 32), std({ color: 0x0b5fb4 })); cap.position.y = 1.0; g.add(cap);
      yOff = FLOOR + 0.675;
    }
    // sisi depan model = -z lokal; diputar agar menghadap keluar lingkaran
    const a = i * STEP; g.position.set(R * Math.sin(a), yOff, R * Math.cos(a)); g.rotation.y = a + Math.PI;
    g.userData.i = i; ring.add(g);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(R * Math.sin(a), FLOOR + 0.012, R * Math.cos(a)); shadow.rotation.z = -a; ring.add(shadow);
    return { g, labels, a, yOff, k: 0, photo: !!p.photo, shadow };
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
      // foto selalu menghadap kamera (batalkan putaran rak); model 3D tetap bergoyang pelan saat dipilih
      it.g.rotation.y = it.photo ? -ringRot + (on ? Math.sin(S.time * 0.8) * 0.06 : 0) : it.a + Math.PI + (on ? Math.sin(S.time * 0.8) * 0.35 : 0);
      const c = 0.42 + it.k * 0.58; it.labels.forEach((m) => m.color.setRGB(c, c, c));
      const lift = it.g.position.y - it.yOff; it.shadow.scale.setScalar((0.86 + it.k * 0.26) * (1 - lift * 0.6));
      (it.shadow.material as THREE.MeshBasicMaterial).opacity = 0.9 - lift * 1.5;
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
    items.forEach((it, i) => {
      const p = PRODUCTS[i]; if (p.photo) return;
      const fresh = p.shape === "kit" ? [flatLabel(p, p.pack?.sack ?? ""), flatLabel(p, p.pack?.can ?? "", true)]
        : p.shape === "sack" ? [flatLabel(p, p.pack?.sack ?? "")]
        : [wrapLabel(p, p.shape === "pail" ? p.pack?.pail : p.shape === "bottle" ? p.pack?.bottle : undefined)];
      it.labels.forEach((m, j) => { m.map?.dispose(); m.map = fresh[j]; m.needsUpdate = true; });
    });
    S.kick();
  });
}
