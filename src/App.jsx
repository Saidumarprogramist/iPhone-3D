import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Marquee from './components/sections/Marquee';
import Chapter from './components/sections/Chapter';
import Showroom from './components/sections/Showroom';
import CTA from './components/sections/CTA';
import Footer from './components/Footer';
import Modal from './components/Modal';
import useScrollChapters from './hooks/useScrollChapters';
import { usePrefersReducedMotion } from './hooks/useMedia';
import { detectQuality, setPointer, state, webglSupported } from './store/experience';

const ExperienceCanvas = lazy(() => import('./components/scene/ExperienceCanvas'));
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  const [supported, setSupported] = useState(webglSupported);
  const reduced = usePrefersReducedMotion();
  const [finishIndex, setFinishIndex] = useState(0);
  const [inShowroom, setInShowroom] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(null);
  const dragRef = useRef(null);
  const ready = useCallback(() => document.getElementById('boot')?.classList.add('done'), []);
  const fail = useCallback(() => {
    setSupported(false);
    ready();
  }, [ready]);
  useScrollChapters(ready, setInShowroom, reduced);

  useEffect(() => {
    state.quality = detectQuality();
    state.reducedMotion = reduced;
  }, [reduced]);
  useEffect(() => {
    state.paused = paused;
  }, [paused]);
  useEffect(() => {
    const move = (e) => setPointer(e.clientX, e.clientY);
    const visibility = () => {
      state.hidden = document.hidden;
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    const el = dragRef.current;
    if (!el || !inShowroom || !supported) return;
    let last = 0;
    const down = (e) => {
      if (e.button !== 0) return;
      state.dragging = true;
      last = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!state.dragging) return;
      const dx = e.clientX - last;
      last = e.clientX;
      state.spin += dx * 0.009;
      state.spinVelocity = dx * 0.002;
    };
    const up = () => {
      state.dragging = false;
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    return () => {
      up();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('lostpointercapture', up);
    };
  }, [inShowroom, supported]);

  return (
    <div className={`experience finish-${finishIndex} ${supported ? '' : 'classic-mode'}`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="scroll-rail" aria-hidden="true" />
      <div className="ambient-orb" aria-hidden="true" />
      <div className="stage-grid" aria-hidden="true" />
      <div className="scene-layer" aria-hidden="true">
        {supported ? (
          <SceneBoundary onError={fail}>
            <Suspense fallback={null}>
              <ExperienceCanvas finishIndex={finishIndex} onError={fail} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <div className="css-device">
            <div className="css-lenses">
              <i />
              <i />
              <i />
            </div>
            <span>A</span>
          </div>
        )}
      </div>
      <Navbar />
      <aside className="chapter-nav" aria-label="Chapters">
        {['hero', 'chip', 'camera', 'showroom'].map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={['Introduction', 'Engineering', 'Camera', 'Finish studio'][i]}
          >
            <span>0{i + 1}</span>
            <i />
          </a>
        ))}
      </aside>
      <main id="main">
        <Hero onFilm={() => setModal('film')} />
        <Marquee />
        <Chapter index={1} align="right" />
        <Chapter index={2} />
        <Showroom
          finishIndex={finishIndex}
          onChange={setFinishIndex}
          paused={paused}
          onPause={() => setPaused((v) => !v)}
          dragRef={dragRef}
          supported={supported}
        />
        <CTA onOpen={() => setModal('summary')} />
      </main>
      <Footer />
      {modal && <Modal type={modal} finishIndex={finishIndex} onClose={() => setModal(null)} />}
    </div>
  );
}
