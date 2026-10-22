/* ============================================================
   App — orchestrates the whole experience.

   Boot: detect WebGL + quality tier, then lazy-mount the single
   R3F canvas (code-split so DOM paints first). Global pointer
   tracking feeds parallax; while the Showroom chapter is active
   a transparent drag-layer captures gestures to spin the device
   (wheel still scrolls the page). No WebGL → pure-DOM fallback.
   ============================================================ */

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Marquee from './components/sections/Marquee';
import Chapter from './components/sections/Chapter';
import SpecsGrid from './components/sections/SpecsGrid';
import Showroom from './components/sections/Showroom';
import CTA from './components/sections/CTA';
import Footer from './components/Footer';
import useScrollChapters from './hooks/useScrollChapters';
import { usePrefersReducedMotion } from './hooks/useMedia';
import {
  detectQuality,
  setPointer,
  state,
  webglSupported,
} from './store/experience';

const ExperienceCanvas = lazy(() => import('./components/scene/ExperienceCanvas'));
const Fallback = lazy(() => import('./components/Fallback'));

export default function App() {
  const supported = useMemo(() => webglSupported(), []);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [finishIndex, setFinishIndex] = useState(0);
  const [inShowroom, setInShowroom] = useState(false);
  const dragLayerRef = useRef(null);

  // runtime flags into the shared store
  useEffect(() => {
    state.quality = detectQuality();
    state.reducedMotion = reduced;
  }, [reduced]);

  // global pointer → parallax
  useEffect(() => {
    const onMove = (e) => setPointer(e.clientX, e.clientY);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // showroom activation: App owns the flag so the gesture layer
  // can react to it; hooks call this from a ScrollTrigger onEnter/onLeave.
  const showroomToggled = useCallback((active) => setInShowroom(active), []);

  // drag-spin gestures (only when the layer is interactive)
  useEffect(() => {
    const el = dragLayerRef.current;
    if (!el || !inShowroom) return;

    let lastX = 0;
    const down = (e) => {
      state.dragging = true;
      lastX = e.clientX;
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (!state.dragging) return;
      const dx = (e.clientX - lastX) / window.innerWidth;
      lastX = e.clientX;
      state.spin += dx * Math.PI * 2;
      state.spinVelocity = dx * 0.6;
    };
    const up = () => {
      state.dragging = false;
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      state.dragging = false;
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [inShowroom]);

  const onReady = useCallback(() => setReady(true), []);
  useScrollChapters(supported ? onReady : null, showroomToggled);

  // fallback path also lifts the curtain
  useEffect(() => {
    if (supported) return;
    const t = setTimeout(onReady, 400);
    return () => clearTimeout(t);
  }, [supported, onReady]);

  useEffect(() => {
    if (!ready) return;
    document.getElementById('boot')?.classList.add('done');
  }, [ready]);

  if (!supported) {
    return (
      <Suspense fallback={null}>
        <Fallback reason="webgl" />
      </Suspense>
    );
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="scroll-rail" aria-hidden="true" />

      {/* single persistent WebGL layer, never receives pointers */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} aria-hidden="true">
        <Suspense fallback={null}>
          <ExperienceCanvas finishIndex={finishIndex} />
        </Suspense>
      </div>

      {/* gesture layer: transparent, only live inside the showroom */}
      <div
        ref={dragLayerRef}
        className={`fixed inset-0 z-[5] ${inShowroom ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        style={{ touchAction: 'pan-y' }}
        aria-hidden="true"
      />

      {/* legibility veil over the scene */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-r from-ink-0/70 via-transparent to-ink-0/40"
        aria-hidden="true"
      />

      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <Marquee />
        <Chapter index={1} align="right" extra={<SpecsGrid />} />
        <Chapter index={2} align="left" />
        <Showroom finishIndex={finishIndex} onChange={setFinishIndex} />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
