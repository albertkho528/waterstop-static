// Simulasi pemasangan: retak ditambal, primer, mesh, membran, lalu uji genang — mengikuti scroll.
import { THREE, createStage, buildStack, ctex, glowFloor } from "./core";
import { $, clamp, lerp, REDUCE, state } from "../state";

export function initBuild() {
  const el = $("#buildStage");
  const S = createStage(el, $<HTMLCanvasElement>("#buildGL"), 30);
  if (!S) { $("#buildGL").hidden = true; return; }

  const st = buildStack(["beton", "primer", "mesh", "membran"]);
  S.scene.add(st.group, glowFloor(9, -1.05));

  // retak di permukaan beton
  const crackMat = new THREE.MeshBasicMaterial({
    transparent: true, depthWrite: false,
    map: ctex(512, 384, (g, w, h) => {
      g.strokeStyle = "rgba(10,10,12,.95)"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath();
      let x = 40, y = h * 0.3; g.moveTo(x, y);
      while (x < w - 40) { x += 30 + Math.random() * 30; y += (Math.random() - 0.4) * 46; g.lineTo(x, clamp(y, 40, h - 40)); }
      g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(w * 0.45, h * 0.42); g.lineTo(w * 0.5, h * 0.7); g.lineTo(w * 0.56, h * 0.85); g.stroke();
    }),
  });
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(st.W * 0.9, st.D * 0.9), crackMat); crack.rotation.x = -Math.PI / 2; st.group.add(crack);

  // bidang pemindai survei
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(st.W + 0.5, st.D + 0.5), new THREE.MeshBasicMaterial({ color: 0x4a9fec, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  scan.rotation.x = -Math.PI / 2; st.group.add(scan);
  const scanEdge = new THREE.LineSegments(new THREE.EdgesGeometry(scan.geometry), new THREE.LineBasicMaterial({ color: 0x8fdcf5, transparent: true }));
  scan.add(scanEdge);

  // air uji genang
  const water = new THREE.Mesh(new THREE.BoxGeometry(st.W - 0.04, 1, st.D - 0.04), new THREE.MeshStandardMaterial({ color: 0x6fc8ee, transparent: true, opacity: 0.5, roughness: 0.1, metalness: 0.1, depthWrite: false }));
  st.group.add(water);

  let q = 0, rot = -0.7, autoP = 0;
  S.fit = (a) => { const k = (a < 1.2 ? 1.25 / a : 1.05) * 1.12; S.camera.position.set(5.4 * k, 3.9 * k, 6.8 * k); S.camera.lookAt(0, -0.15, 0); };
  S.frame = (dt) => {
    q = lerp(q, state.buildQ, Math.min(1, dt * 8));
    const ap = [1, clamp(q - 2), clamp(q - 3), clamp(q - 4)];
    if (!REDUCE && autoP <= 0) rot += dt * 0.12; autoP -= dt; st.group.rotation.y = rot;
    st.layout(0.16, ap);
    const concTop = st.layers[0].y + 0.5;
    crack.position.y = concTop + 0.004; crackMat.opacity = 1 - clamp(q - 1);
    const sv = 1 - clamp((q - 0.85) / 0.4);
    scan.visible = sv > 0.01; (scan.material as THREE.MeshBasicMaterial).opacity = 0.22 * sv; (scanEdge.material as THREE.LineBasicMaterial).opacity = sv;
    scan.position.y = concTop + 0.15 + (Math.sin(S.time * 2.2) * 0.5 + 0.5) * 1.1;
    const w = clamp(q - 5), mem = st.layers[3], hW = Math.max(0.001, w * 0.32);
    water.scale.y = hW; water.position.y = mem.mesh.position.y + mem.h / 2 + hW / 2 + 0.002;
    water.visible = w > 0.01; (water.material as THREE.MeshStandardMaterial).opacity = 0.5 * clamp(w * 3);
  };
  S.onDrag = (dx) => { rot += dx * 0.009; autoP = 1e9; };
  S.onDragEnd = () => { autoP = 3; };
  addEventListener("scroll", S.kick, { passive: true });
  S.start();
}
