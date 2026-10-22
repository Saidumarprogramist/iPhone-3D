import { BRAND, chapters } from '../../constants';

const c = chapters[0];

export default function Hero() {
  return (
    <section
      id="hero"
      data-chapter="0"
      className="relative min-h-[100dvh] flex flex-col justify-end grain"
      aria-label={`${BRAND} introduction`}
    >
      {/* top gradient veil so navbar always reads */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-0/80 to-transparent" />

      <div className="screen-max-width px-5 sm:px-10 pb-16 sm:pb-24">
        <p className="eyebrow reveal">{c.eyebrow}</p>

        <h1 className="display-xl mt-4" data-lines>
          {c.titleLines.map((line) => (
            <span key={line} className="block">
              {line === 'Forged in Light.' ? (
                <span className="grad-gold">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-16">
          <p className="reveal max-w-md text-[15px] leading-relaxed text-mist" data-delay="0.1">
            {c.copy}
          </p>
          <div className="reveal flex items-center gap-4" data-delay="0.2">
            <a href="#showroom" className="btn-gold">Explore the device</a>
            <a href="#chip" className="btn-ghost">Watch the film ↓</a>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 hidden sm:flex flex-col items-center gap-2 text-mist" aria-hidden="true">
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </div>
    </section>
  );
}
