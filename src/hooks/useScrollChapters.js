/* ============================================================
   useScrollChapters — binds DOM sections to the cinematic rig.

   Each <section data-chapter="N"> writes its index into the
   shared store when it crosses the viewport center, and GSAP
   ScrollTrigger reveals `.reveal` elements as they enter.
   Also drives the top scroll-progress rail and lifts the boot
   curtain once the experience is interactive (in ALL cases,
   including reduced motion).
   ============================================================ */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setChapter, setScrollProgress, state } from '../store/experience';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollChapters(onReady, onShowroomToggle) {
  useEffect(() => {
    const reduced = state.reducedMotion;

    // ---- chapter switching: whichever section owns viewport center
    const sections = Array.from(document.querySelectorAll('[data-chapter]'));
    const st = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setChapter(Number(el.dataset.chapter));
        },
      })
    );

    // ---- showroom window (chapter 3): enable drag gestures
    const showroom = document.getElementById('showroom');
    if (showroom && onShowroomToggle) {
      ScrollTrigger.create({
        trigger: showroom,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => onShowroomToggle(true),
        onEnterBack: () => onShowroomToggle(true),
        onLeave: () => onShowroomToggle(false),
        onLeaveBack: () => onShowroomToggle(false),
      });
    }

    // ---- global progress + rail
    const rail = document.querySelector('.scroll-rail');
    const prog = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        if (rail) rail.style.setProperty('--progress', self.progress.toFixed(4));
      },
    });

    // ---- reveal-on-enter micro animations
    const reveals = gsap.utils.toArray('.reveal');
    reveals.forEach((el) => {
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 46 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: 'power3.out',
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        }
      );
    });

    // split-line stagger helper: children of [data-lines] animate together
    gsap.utils.toArray('[data-lines]').forEach((wrap) => {
      const lines = wrap.children;
      if (reduced) {
        gsap.set(lines, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        lines,
        { opacity: 0, y: '0.9em' },
        {
          opacity: 1,
          y: 0,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
        }
      );
    });

    // mark ready → App lifts the boot curtain (always, even in reduced motion)
    const t = setTimeout(() => onReady && onReady(), 120);

    return () => {
      clearTimeout(t);
      [...st, prog].forEach((s) => s.kill());
      ScrollTrigger.getAll().forEach((s) => s.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
