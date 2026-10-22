/* ============================================================
   Showroom — chapter 3. Interactive: drag to spin the device,
   pick a titanium finish; App re-renders the single canvas with
   the new tint/wallpaper. Pointer events are enabled only here.
   ============================================================ */

import { chapters, finishes } from '../../constants';
import { setFinish } from '../../store/experience';

export default function Showroom({ finishIndex, onChange }) {
  const c = chapters[3];
  const f = finishes[finishIndex];

  return (
    <section
      id="showroom"
      data-chapter="3"
      className="relative min-h-[120dvh] flex items-center grain"
      aria-label={c.eyebrow}
    >
      <div className="screen-max-width px-5 sm:px-10 w-full">
        <div className="max-w-xl">
          <p className="eyebrow reveal">{c.eyebrow}</p>
          <h2 className="display-l mt-5" data-lines>
            {c.titleLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h2>
          <p className="reveal mt-6 text-[15px] leading-relaxed text-mist">{c.copy}</p>

          {/* finish swatches */}
          <div
            className="reveal mt-10 flex items-center gap-4"
            role="radiogroup"
            aria-label="Titanium finish"
            data-delay="0.15"
          >
            {finishes.map((fin, i) => (
              <button
                key={fin.id}
                role="radio"
                aria-checked={i === finishIndex}
                aria-label={fin.name}
                onClick={() => {
                  setFinish(i);
                  onChange(i);
                }}
                className={`relative w-11 h-11 rounded-full transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                  i === finishIndex ? 'scale-110' : 'opacity-70'
                }`}
                style={{
                  background: `radial-gradient(120% 120% at 30% 25%, #ffffff33, ${fin.dot})`,
                  boxShadow: i === finishIndex ? `0 0 0 2px var(--ink-0), 0 0 0 3px ${fin.dot}` : 'none',
                }}
              />
            ))}
          </div>

          <div className="reveal mt-6" data-delay="0.2">
            <div className="text-sm font-semibold tracking-wide">{f.name}</div>
            <div className="text-xs text-mist mt-1 italic">{f.tagline}</div>
          </div>

          <p className="chip mt-8 select-none" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse inline-block" />
            Drag anywhere on the screen to spin
          </p>
        </div>
      </div>
    </section>
  );
}
