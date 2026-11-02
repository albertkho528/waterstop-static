type Callback = () => void;

const scrollCallbacks = new Set<Callback>();
const measureCallbacks = new Set<Callback>();
let scrollFrame = 0;
let measureFrame = 0;

function run(callbacks: Set<Callback>) {
  for (const callback of callbacks) callback();
}

function scheduleScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    run(scrollCallbacks);
  });
}

function scheduleMeasure() {
  if (measureFrame) return;
  measureFrame = requestAnimationFrame(() => {
    measureFrame = 0;
    run(measureCallbacks);
    run(scrollCallbacks);
  });
}

/** Run after the next scroll/resize frame, before any DOM writes that frame. */
export function onScroll(callback: Callback) {
  scrollCallbacks.add(callback);
  scheduleScroll();
}

/** Run after layout changes: resize, font load, or dynamic content swaps. */
export function onResize(callback: Callback) {
  measureCallbacks.add(callback);
  scheduleMeasure();
}

export function requestScroll() {
  scheduleScroll();
}

export function requestMeasure() {
  scheduleMeasure();
}

if (typeof window !== "undefined") {
  addEventListener("scroll", scheduleScroll, { passive: true });
  addEventListener("resize", scheduleMeasure, { passive: true });
}
