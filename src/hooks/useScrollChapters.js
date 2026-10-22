import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setChapter, setScrollProgress, state } from '../store/experience';
gsap.registerPlugin(ScrollTrigger);
export default function useScrollChapters(onReady, onShowroomToggle, reduced) {
  useEffect(() => {
    const updateFallback = () => {
      const section = document.querySelector(`[data-chapter="${state.targetChapter}"]`);
      const y =
        (section?.getBoundingClientRect().top || 0) +
        [320, 270, 270, 570, 300][state.targetChapter];
      document.querySelector('.scene-layer')?.style.setProperty('--device-y', `${y}px`);
    };
    const context = gsap.context(() => {
      document.querySelectorAll('[data-chapter]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (!self.isActive) return;
            const chapter = Number(el.dataset.chapter);
            setChapter(chapter);
            updateFallback();
            onShowroomToggle(chapter === 3);
            document.querySelectorAll('.chapter-nav a').forEach((link, i) => {
              if (i === Math.min(chapter, 3)) link.setAttribute('aria-current', 'step');
              else link.removeAttribute('aria-current');
            });
          },
        });
      });
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          updateFallback();
          document.querySelector('.scroll-rail')?.style.setProperty('--progress', self.progress);
        },
      });
      if (!reduced) {
        gsap.utils.toArray('.reveal, [data-lines]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 95%', once: true },
            },
          );
        });
      }
    });
    ScrollTrigger.refresh();
    updateFallback();
    onReady();
    return () => context.revert();
  }, [onReady, onShowroomToggle, reduced]);
}
