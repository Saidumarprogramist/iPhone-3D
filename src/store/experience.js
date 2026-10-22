/* ============================================================
   AURA ONE — shared runtime state (plain module, no deps).

   The DOM layer (sections, scroll) writes here; the single
   persistent R3F canvas reads it inside useFrame. This avoids
   re-mounting WebGL contexts on scroll and keeps everything at
   60fps with one canvas for the whole page.
   ============================================================ */

export const state = {
  // pointer, normalized -1..1 (smoothed inside the scene)
  pointer: { x: 0, y: 0 },
  // global scroll 0..1
  progress: 0,
  // which "chapter" of the cinematic camera path we are in (lerped)
  chapter: 0,
  targetChapter: 0,
  // active finish index (see src/constants/finishes.js)
  finishIndex: 0,
  // interactive showroom spin (radians, driven by drag / autoplay)
  spin: 0,
  spinVelocity: 0,
  dragging: false,
  paused: false,
  hidden: false,
  // quality tier detected at boot: 'high' | 'low'
  quality: 'high',
  // reduced motion preference
  reducedMotion: false,
};

export function setPointer(clientX, clientY) {
  state.pointer.x = (clientX / window.innerWidth) * 2 - 1;
  state.pointer.y = (clientY / window.innerHeight) * 2 - 1;
}

export function setScrollProgress(p) {
  state.progress = p;
}

export function setChapter(i) {
  state.targetChapter = i;
}

export function setFinish(i) {
  state.finishIndex = i;
}

export function detectQuality() {
  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const small = Math.min(window.innerWidth, window.innerHeight) < 500;
  if (mem <= 4 || cores <= 4 || small) return 'low';
  return 'high';
}

export function webglSupported() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
